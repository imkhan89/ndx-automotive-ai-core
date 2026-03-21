// FILE: routes/whatsappWebhook.js

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const { handleAutoPartsFlow } = require("../flows/autoParts/entry");
const aiParser = require("../services/aiParser");

// ==============================
// 🔐 VERIFY WEBHOOK
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

        // 🔥 HANDLE TEXT + BUTTON INPUT
        const text =
          message.text?.body ||
          message.button?.text ||
          message.interactive?.button_reply?.id ||
          "";

        if (!text) {
          console.log("⚠️ No valid message");
          return res.sendStatus(200);
        }

        console.log("📩 Incoming:", text);

        let reply;
        const lowerText = text.toLowerCase();

        // ==============================
        // ⚡ SMART ROUTING
        // ==============================

        // 🔢 NUMBER (selection)
        if (/^\d+$/.test(text)) {
          reply = await handleAutoPartsFlow(from, text, null);
        }

        // ✅ YES / NO (confirmation)
        else if (["yes", "no"].includes(lowerText)) {
          reply = await handleAutoPartsFlow(from, text, null);
        }

        // 👋 GREETING
        else if (
          ["hi", "hello", "assalamualaikum", "salam"].includes(lowerText)
        ) {
          reply = {
            message:
              "👋 Welcome to NDX Automotive!\n\n" +
              "Please tell me:\n" +
              "🚗 Car Make + Model\n" +
              "🔧 Part you need\n\n" +
              "Example:\nToyota Corolla air filter",
            buttons: []
          };
        }

        // 🧠 AI PARSE
        else {
          const aiData = await aiParser(text);

          if (!aiData || !aiData.part) {
            reply = {
              message:
                "❌ Could not understand your request.\n\n" +
                "Please try like:\nToyota Corolla air filter",
              buttons: []
            };
          } else {
            reply = await handleAutoPartsFlow(from, text, aiData);
          }
        }

        console.log("📤 Reply:", reply);

        // ==============================
        // 📤 SEND MESSAGE
        // ==============================
        if (typeof reply === "object") {
          await sendWhatsAppMessage(from, reply.message, reply.buttons);
        } else {
          await sendWhatsAppMessage(from, reply);
        }
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
// 📤 SEND WHATSAPP MESSAGE
// ==============================
async function sendWhatsAppMessage(to, message, buttons = []) {
  try {
    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
    const TOKEN = process.env.WHATSAPP_TOKEN;

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    let payload;

    // 🔥 INTERACTIVE BUTTON MESSAGE
    if (buttons && buttons.length > 0) {
      payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: message
          },
          action: {
            buttons: buttons.map(btn => ({
              type: "reply",
              reply: {
                id: btn.id,
                title: btn.title
              }
            }))
          }
        }
      };
    }

    // 🔹 NORMAL TEXT MESSAGE
    else {
      payload = {
        messaging_product: "whatsapp",
        to: to,
        text: { body: message }
      };
    }

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

  } catch (error) {
    console.error("❌ Send Message Error:", error);
  }
}

module.exports = router;
