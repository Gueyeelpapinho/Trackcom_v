import dotenv from "dotenv";
import fetch from "node-fetch";
import {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
  TokenMintTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

dotenv.config();

function getClient() {
  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY;
  if (!operatorId || !operatorKey) {
    throw new Error("HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY are required in .env");
  }
  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
  return client;
}

export async function createNftCollection(name, symbol) {
  const client = getClient();
  const tx = await new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(process.env.HEDERA_OPERATOR_ID)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY))
    .setAdminKey(PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY))
    .setMaxTransactionFee(new Hbar(10))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const tokenId = receipt.tokenId.toString();
  return { tokenId };
}

export async function mintNftSerial({ tokenId, memo = "", metadataJson = {} }) {
  const client = getClient();
  const metadataBytes = Buffer.from(JSON.stringify(metadataJson));
  const tx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .addMetadata(metadataBytes)
    .setTransactionMemo(memo)
    .execute(client);
  const receipt = await tx.getReceipt(client);
  const serial = Number(receipt.serials[0]);
  return { serial };
}

export async function createHcsTopic(memo = "") {
  const client = getClient();
  const tx = await new TopicCreateTransaction().setTopicMemo(memo).execute(client);
  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId.toString();
  return { topicId };
}

export async function submitHcsMessage(topicId, obj) {
  const client = getClient();
  const message = Buffer.from(JSON.stringify(obj));
  const tx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);
  const receipt = await tx.getReceipt(client);
  return { status: receipt.status.toString() };
}

export async function getMirrorTopicMessages(topicId, limit = 200) {
  const base = process.env.MIRROR_NODE_BASE || "https://testnet.mirrornode.hedera.com";
  const url = `${base}/api/v1/topics/${topicId}/messages?limit=${limit}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Mirror node error: ${resp.status}`);
  }
  const json = await resp.json();
  return json.messages || [];
}


