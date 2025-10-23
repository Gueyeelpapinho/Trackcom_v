import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  Hbar,
} from "npm:@hashgraph/sdk@^2.40.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Store topic IDs in memory (in production, use database)
const componentTopics = new Map<string, string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { componentId, nftId, eventData } = await req.json();

    console.log('Received request:', { componentId, nftId, eventType: eventData?.type });

    if (!componentId || !eventData) {
      throw new Error('Component ID and event data are required');
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

    console.log('Adding event for component:', componentId);

    // Get or create topic for this component
    let topicId = componentTopics.get(componentId);

    if (!topicId) {
      console.log('Creating new HCS topic for component');
      
      const topicCreateTx = await new TopicCreateTransaction()
        .setTopicMemo(`ISS Component Events: ${nftId}`)
        .setAdminKey(PrivateKey.fromString(operatorKey))
        .setSubmitKey(PrivateKey.fromString(operatorKey))
        .setMaxTransactionFee(new Hbar(10))
        .execute(client);

      const topicCreateRx = await topicCreateTx.getReceipt(client);
      topicId = topicCreateRx.topicId?.toString();
      
      if (topicId) {
        componentTopics.set(componentId, topicId);
        console.log('HCS Topic created with ID:', topicId);
      }
    }

    // Prepare event message
    const eventMessage = {
      componentId,
      nftId,
      timestamp: Date.now(),
      event: {
        type: eventData.type,
        description: eventData.description,
        performedBy: eventData.performedBy,
        metadata: eventData.metadata || {},
      },
    };

    console.log('Submitting event to HCS topic:', topicId);

    // Submit message to HCS topic
    const messageTx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId!)
      .setMessage(JSON.stringify(eventMessage))
      .setMaxTransactionFee(new Hbar(5))
      .execute(client);

    const messageRx = await messageTx.getReceipt(client);
    const sequenceNumber = messageRx.topicSequenceNumber;

    console.log('Event submitted with sequence number:', sequenceNumber?.toString());

    return new Response(
      JSON.stringify({
        success: true,
        topicId,
        sequenceNumber: sequenceNumber?.toString(),
        transactionId: messageTx.transactionId.toString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error adding event:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to add event',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
