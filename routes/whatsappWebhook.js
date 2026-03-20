// FILE: routes/whatsappWebhook.js

const express = require("express");
const router = express.Router();

const { handleAutoPartsFlow } = require("../flows/autoParts/entry");
const aiParser = require("../services/aiParser");

// 🔥 VERIFY WEBHOOK (META REQUIRED)
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// 🔥 HANDLE INCOMING MESSAGES
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const message = value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body;

        console.log("📩 Incoming:", text);

        // 🔥 AI PARSE
        const aiData = await aiParser(text);

        // 🔥 FLOW ENGINE
        const reply = await handleAutoPartsFlow(from, text, aiData);

        // 🔥 SEND REPLY
        await sendWhatsAppMessage(from, reply);
      }

      return res.sendStatus(200);
    }

    res.sendStatus(404);
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.sendStatus(500);
  }
});

// 🔥 SEND MESSAGE FUNCTION
const fetch = require("node-fetch");

async function sendWhatsAppMessage(to, message) {
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
  const TOKEN = process.env.WHATSAPP_TOKEN;

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      text: { body: message }
    })
  });
}

module.exports = router;
