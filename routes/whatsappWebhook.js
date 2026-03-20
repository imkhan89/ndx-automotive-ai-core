// FILE: routes/whatsappWebhook.js

const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");

const { handleAutoPartsFlow } = require("../flows/autoParts/entry");
const aiParser = require("../services/aiParser");

// ==============================
// 🔐 VERIFY WEBHOOK (META)
// ==============================
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook Verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
});

// ==============================
// 📩 HANDLE INCOMING MESSAGES
// ==============================
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    console.log("📥 RAW BODY:", JSON.stringify(body, null, 2));

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const message = value?.messages?.[0];

      if (message) {
        const from = message.from;

        // 🔥 SAFE TEXT EXTRACTION
        const text = message.text?.body || "";

        if (!text) {
          console.log("⚠️ No text message received");
          return res.sendStatus(200);
        }

        console.log("📩 Incoming:", text);

        let reply;

        // ==============================
        // ⚡ SMART ROUTING
        // ==============================

        // 🔢 NUMBER → SELECTION
        if (/^\d+$/.test(text)) {
          reply = await handleAutoPartsFlow(from, text, null);
        }

        // ✅ YES / NO → CONFIRMATION
        else if (["yes", "no"].includes(text.toLowerCase())) {
          reply = await handleAutoPartsFlow(from, text, null);
        }

        // 🧠 OTHERWISE → AI PARSE
        else {
          const aiData = await aiParser(text);

          // SAFETY CHECK
          if (!aiData || !aiData.part) {
            console.log("⚠️ AI parsing failed:", aiData);

            reply = "❌ Could not understand your request.\nPlease try like:\nToyota Corolla air filter";
          } else {
            reply = await handleAutoPartsFlow(from, text, aiData);
          }
        }

        console.log("📤 Reply:", reply);

        // ==============================
        // 📤 SEND WHATSAPP MESSAGE
        // ==============================
        await sendWhatsAppMessage(from, reply);
      }

      return res.sendStatus(200);
    }

    return res.sendStatus(404);

  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    return res.sendStatus(500);
  }
});

// ==============================
// 📤 SEND MESSAGE FUNCTION
// ==============================
async function sendWhatsAppMessage(to, message) {
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
  const TOKEN = process.env.WHATSAPP_TOKEN;

  if (!PHONE_NUMBER_ID || !TOKEN) {
    console.error("❌ Missing WhatsApp credentials");
    return;
  }

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
