// FILE: routes/whatsappWebhook.js

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const { searchProducts } = require("../services/shopifyService");
const { parseUserQuery } = require("../services/aiParser");

// ==============================
// 🔐 VERIFY WEBHOOK (GET)
// ==============================
router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ==============================
// 📩 RECEIVE MESSAGE (POST)
// ==============================
router.post("/webhook", async (req, res) => {
  try {
    console.log("📥 RAW BODY:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const userText = message.text?.body;

    console.log("👤 From:", from);
    console.log("💬 Message:", userText);

    // ==============================
    // 👋 GREETING HANDLER
    // ==============================
    if (!userText || userText.toLowerCase() === "hi") {
      const welcomeMsg = `👋 Welcome to NDX Automotive!

Please tell me:
🚗 Car Make + Model  
🔧 Part you need  

Example:
Toyota Corolla air filter`;

      await sendWhatsAppMessage(from, welcomeMsg);
      return res.sendStatus(200);
    }

    // ==============================
    // 🧠 AI PARSE QUERY
    // ==============================
    const query = await parseUserQuery(userText);

    console.log("🧠 PARSED QUERY:", query);

    if (!query || !query.part) {
      await sendWhatsAppMessage(
        from,
        "❌ Could not understand your request.\n\nTry:\nToyota Corolla air filter"
      );
      return res.sendStatus(200);
    }

    // ==============================
    // 🔍 SEARCH PRODUCTS
    // ==============================
    const products = await searchProducts(query);

    console.log("📦 PRODUCTS FOUND:", products.length);

    // ==============================
    // ❌ NO PRODUCTS CASE
    // ==============================
    if (!products || products.length === 0) {
      await sendWhatsAppMessage(
        from,
        `❌ No products found.\n\nTry:\n${query.make} ${query.model} ${query.part}`
      );
      return res.sendStatus(200);
    }

    // ==============================
    // 📤 FORMAT RESPONSE
    // ==============================
    let reply = `🔧 *${query.make} ${query.model} ${query.part.toUpperCase()} Options:*\n\n`;

    products.slice(0, 10).forEach((p, index) => {
      reply += `${index + 1}. ${p.title}\n`;
      reply += `💰 PKR ${p.price}\n`;
      reply += `🔗 ${p.url}\n\n`;
    });

    reply += "👉 Reply with the *option number* to select product.";

    console.log("📤 FINAL REPLY:", reply);

    // ==============================
    // 📲 SEND MESSAGE
    // ==============================
    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.sendStatus(500);
  }
});

// ==============================
// 📲 SEND WHATSAPP MESSAGE
// ==============================
async function sendWhatsAppMessage(to, text) {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const TOKEN = process.env.WHATSAPP_TOKEN;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          text: { body: text }
        })
      }
    );

    const data = await response.json();

    console.log("📤 WhatsApp API Response:", data);

  } catch (error) {
    console.error("❌ WhatsApp Send Error:", error);
  }
}

module.exports = router;
