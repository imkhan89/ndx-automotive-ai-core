const express = require("express");
const router = express.Router();

const webhookController = require("../controllers/webhookController");

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ndestore_verify_token";

// ✅ VERIFY
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ✅ RECEIVE MESSAGE
router.post("/", webhookController.handleWebhook);

module.exports = router;
