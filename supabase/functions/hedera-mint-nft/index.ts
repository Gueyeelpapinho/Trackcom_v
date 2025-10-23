import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  TokenId,
  Hbar,
} from "npm:@hashgraph/sdk@^2.40.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { componentData } = await req.json();

    console.log('Received mint request for:', componentData?.name);

    if (!componentData) {
      throw new Error('Component data is required');
    }

    // Get Hedera credentials from environment
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

    console.log('Hedera credentials check:', { 
      hasOperatorId: !!operatorId, 
      hasOperatorKey: !!operatorKey,
      operatorIdType: typeof operatorId,
      operatorKeyType: typeof operatorKey
    });

    if (!operatorId || !operatorKey) {
      throw new Error('Hedera credentials not configured');
    }

    if (typeof operatorKey !== 'string' || typeof operatorId !== 'string') {
      throw new Error('Hedera credentials must be strings');
    }

    console.log('Creating Hedera client...');
    // Create Hedera client for testnet
    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));
    console.log('Hedera client configured successfully');

    console.log('Creating NFT token for component:', componentData.name);

    // Create NFT token
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(`ISS Component: ${componentData.name}`)
      .setTokenSymbol('ISSCOMP')
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(1)
      .setTreasuryAccountId(operatorId)
      .setSupplyKey(PrivateKey.fromString(operatorKey))
      .setAdminKey(PrivateKey.fromString(operatorKey))
      .setMaxTransactionFee(new Hbar(30))
      .freezeWith(client);

    const tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(operatorKey));
    const tokenCreateSubmit = await tokenCreateSign.execute(client);
    const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    const tokenId = tokenCreateRx.tokenId;

    console.log('NFT Token created with ID:', tokenId?.toString());

    // Mint NFT with metadata
    const metadata = new TextEncoder().encode(JSON.stringify({
      name: componentData.name,
      type: componentData.type,
      location: componentData.location,
      installationDate: componentData.installationDate,
      manufacturer: componentData.metadata.manufacturer,
      serialNumber: componentData.metadata.serialNumber,
      specifications: componentData.metadata.specifications,
    }));

    const mintTx = await new TokenMintTransaction()
      .setTokenId(tokenId!)
      .setMetadata([metadata])
      .setMaxTransactionFee(new Hbar(20))
      .freezeWith(client);

    const mintSign = await mintTx.sign(PrivateKey.fromString(operatorKey));
    const mintSubmit = await mintSign.execute(client);
    const mintRx = await mintSubmit.getReceipt(client);

    console.log('NFT minted with serial:', mintRx.serials[0].toString());

    const nftId = `${tokenId?.toString()}-${mintRx.serials[0].toString()}`;

    return new Response(
      JSON.stringify({
        success: true,
        nftId,
        tokenId: tokenId?.toString(),
        serialNumber: mintRx.serials[0].toString(),
        transactionId: mintSubmit.transactionId.toString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error minting NFT:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to mint NFT',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
