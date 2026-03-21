const express = require("express");
const router = express.Router();

const { handleWebhook } = require("../controllers/webhookController");

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ndestore_verify_token";

// ✅ Webhook Verification (Meta)
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ✅ Receive Messages
router.post("/", handleWebhook);

module.exports = router;
