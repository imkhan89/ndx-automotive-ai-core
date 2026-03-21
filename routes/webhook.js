const express = require("express");
const router = express.Router();

const webhookController = require("../controllers/webhookController");

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ndestore_verify_token";

// =====================================================
// ✅ WEBHOOK VERIFICATION (GET)
// =====================================================
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Verification request received");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Verification failed");
  return res.sendStatus(403);
});


// =====================================================
// ✅ RECEIVE WHATSAPP MESSAGES (POST)
// =====================================================
router.post("/", webhookController.handleWebhook);

module.exports = router;
