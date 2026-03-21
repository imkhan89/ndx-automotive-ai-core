const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ndestore_verify_token";

// ✅ Webhook verification (Meta requirement)
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Verification request received");

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Verification failed");
  return res.sendStatus(403);
});

// ✅ Incoming messages
router.post("/", (req, res) => {
  console.log("🔥 Webhook POST HIT");

  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

module.exports = router;
