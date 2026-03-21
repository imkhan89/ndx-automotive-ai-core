const express = require("express");
const router = express.Router();
const { processIncomingMessage } = require("../core/webhookReceiver");

// VERIFY WEBHOOK
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// RECEIVE MESSAGE
router.post("/", async (req, res) => {
  try {
    await processIncomingMessage(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
