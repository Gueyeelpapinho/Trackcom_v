import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { ensureDataDirs, readJson, writeJson } from "./storage.js";
import {
  createNftCollection,
  mintNftSerial,
  createHcsTopic,
  submitHcsMessage,
  getMirrorTopicMessages,
} from "./hedera.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

ensureDataDirs();

// Root info page
app.get("/", (_req, res) => {
  res.type("application/json").send(
    JSON.stringify(
      {
        service: "trackcom-backend",
        ok: true,
        docs: {
          health: "/api/health",
          setupToken: "/api/setup/token",
          setupTopic: "/api/setup/topic",
          registerAsset: "/api/assets",
          addEvent: "/api/events",
          assetHistory: "/api/assets/:serial/history?tokenId=...",
        },
      },
      null,
      2
    )
  );
});

// Simple healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "trackcom-backend" });
});

// Optional one-time setup: create NFT collection (HTS) and persist tokenId
app.post("/api/setup/token", async (req, res) => {
  try {
    const { name = "TrackCom Components", symbol = "TCC" } = req.body || {};
    const { tokenId } = await createNftCollection(name, symbol);
    const cfg = readJson("config.json", {});
    cfg.nftTokenId = tokenId;
    writeJson("config.json", cfg);
    res.json({ tokenId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional one-time setup: create HCS topic and persist topicId
app.post("/api/setup/topic", async (_req, res) => {
  try {
    const { topicId } = await createHcsTopic("TrackCom Event Log");
    const cfg = readJson("config.json", {});
    cfg.hcsTopicId = topicId;
    writeJson("config.json", cfg);
    res.json({ topicId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register an asset: mint an NFT serial and persist minimal metadata
app.post("/api/assets", async (req, res) => {
  try {
    const { componentType, metadata = {} } = req.body || {};
    if (!componentType) {
      return res.status(400).json({ error: "componentType is required" });
    }

    const cfg = readJson("config.json", {});
    const tokenId = cfg.nftTokenId || process.env.NFT_TOKEN_ID;
    if (!tokenId) {
      return res
        .status(400)
        .json({ error: "NFT tokenId missing. Run /api/setup/token or set NFT_TOKEN_ID" });
    }

    const { serial } = await mintNftSerial({
      tokenId,
      memo: `${componentType}-${Date.now()}`,
      metadataJson: { componentType, ...metadata },
    });

    const db = readJson("assets.json", { assets: [] });
    const asset = {
      tokenId,
      serial,
      componentType,
      metadata,
      createdAt: new Date().toISOString(),
    };
    db.assets.push(asset);
    writeJson("assets.json", db);

    res.json({ tokenId, serial, asset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Append an event to HCS topic for an asset
app.post("/api/events", async (req, res) => {
  try {
    const { tokenId, serial, eventType, details = {} } = req.body || {};
    if (!tokenId || !serial || !eventType) {
      return res
        .status(400)
        .json({ error: "tokenId, serial and eventType are required" });
    }
    const cfg = readJson("config.json", {});
    const topicId = cfg.hcsTopicId || process.env.HCS_TOPIC_ID;
    if (!topicId) {
      return res
        .status(400)
        .json({ error: "HCS topicId missing. Run /api/setup/topic or set HCS_TOPIC_ID" });
    }

    const message = {
      tokenId,
      serial,
      eventType,
      details,
      timestamp: new Date().toISOString(),
    };
    const receipt = await submitHcsMessage(topicId, message);
    res.json({ ok: true, receipt, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve history for an asset from Mirror Node and filter messages
app.get("/api/assets/:serial/history", async (req, res) => {
  try {
    const serial = Number(req.params.serial);
    const tokenId = req.query.tokenId;
    if (!tokenId || Number.isNaN(serial)) {
      return res.status(400).json({ error: "tokenId query and numeric serial are required" });
    }
    const cfg = readJson("config.json", {});
    const topicId = cfg.hcsTopicId || process.env.HCS_TOPIC_ID;
    if (!topicId) {
      return res.status(400).json({ error: "HCS topicId not configured" });
    }
    const messages = await getMirrorTopicMessages(topicId);
    const history = messages
      .map((m) => {
        try {
          return JSON.parse(Buffer.from(m.message, "base64").toString("utf8"));
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .filter((m) => m.tokenId === tokenId && Number(m.serial) === serial);

    res.json({ tokenId, serial, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
 
  console.log(`TrackCom backend listening on http://localhost:${PORT}`);
});


