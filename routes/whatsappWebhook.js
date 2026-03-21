const express = require("express");
const router = express.Router();

const { handleWebhook } = require("../controllers/webhookController");

// 🔐 VERIFY TOKEN (must match Meta dashboard)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ndestore_verify_token";


// =====================================================
// ✅ GET: Webhook Verification (Meta Requirement)
// =====================================================
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Webhook Verification Attempt");

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified Successfully");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Verification Failed");
    return res.sendStatus(403);
  }
});


// =====================================================
// ✅ POST: Receive WhatsApp Messages
// =====================================================
router.post("/", async (req, res) => {
  console.log("🔥 Incoming Webhook Hit");

  try {
    await handleWebhook(req, res);
  } catch (error) {
    console.error("❌ Webhook Route Error:", error);
    res.sendStatus(500);
  }
});


module.exports = router;
