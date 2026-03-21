const axios = require("axios");
const { sendTextMessage } = require("../services/whatsappService");
const { searchProducts } = require("../services/shopifyService");

// ===============================
// VERIFY WEBHOOK
// ===============================
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// ===============================
// HANDLE WEBHOOK (SAFE VERSION)
// ===============================
const handleWebhook = async (req, res) => {
  try {
    res.sendStatus(200);

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    if (!value?.messages) return;

    const message = value.messages[0];
    const from = message.from;

    const userText =
      message.text?.body ||
      message.button?.text ||
      message.interactive?.button_reply?.title ||
      message.interactive?.list_reply?.title ||
      "";

    console.log("💬 USER:", userText);

    let reply = "⚠️ System busy, please try again.";

    // ===============================
    // 🛒 TRY SHOPIFY (SAFE)
    // ===============================
    try {
      const products = await searchProducts(userText);

      if (products.length > 0) {
        reply = "🛒 *Available Products:*\n\n";

        products.forEach((p, i) => {
          const price = p.variants[0]?.price || "N/A";
          const link = `https://${process.env.SHOPIFY_STORE}/products/${p.handle}`;

          reply += `*${i + 1}. ${p.title}*\n`;
          reply += `💰 PKR ${price}\n`;
          reply += `🔗 ${link}\n\n`;
        });

        reply += "Reply with product name to confirm 👍";
      }
    } catch (err) {
      console.error("❌ Shopify Failed:", err.message);
    }

    // ===============================
    // 🤖 FALLBACK AI (SAFE)
    // ===============================
    if (!reply.includes("Available Products")) {
      try {
        reply = await generateAIResponse(userText);
      } catch (err) {
        console.error("❌ AI Failed:", err.message);
        reply = "Please share car model & part needed 👍";
      }
    }

    // ===============================
    // 📤 ALWAYS SEND (CRITICAL)
    // ===============================
    try {
      console.log("🚀 SENDING MESSAGE...");
      await sendTextMessage(from, reply);
      console.log("✅ MESSAGE SENT");
    } catch (err) {
      console.error("❌ SEND FAILED:", err.message);
    }

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error.message);
  }
};

// ===============================
// AI RESPONSE
// ===============================
const generateAIResponse = async (text) => {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Automotive assistant for ndestore.com" },
        { role: "user", content: text },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return res.data.choices[0].message.content;
};

module.exports = {
  handleWebhook,
  verifyWebhook,
};
