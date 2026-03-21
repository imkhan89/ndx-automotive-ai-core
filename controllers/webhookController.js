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
  } else {
    return res.sendStatus(403);
  }
};

// ===============================
// HANDLE WEBHOOK
// ===============================
const handleWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK EVENT");

    res.sendStatus(200);

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    if (!value?.messages) return;

    const message = value.messages[0];
    const from = message.from;

    let userText =
      message.text?.body ||
      message.button?.text ||
      message.interactive?.button_reply?.title ||
      message.interactive?.list_reply?.title ||
      "";

    console.log("💬 USER:", userText);

    // ===============================
    // 🔹 SHOPIFY LIVE SEARCH
    // ===============================
    const products = await searchProducts(userText);

    let reply = "";

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

    } else {
      reply = await generateAIResponse(userText);
    }

    // ===============================
    // SEND
    // ===============================
    console.log("🚀 BEFORE SEND");

    const result = await sendTextMessage(from, reply);

    console.log("📤 RESULT:", result);

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
};

// ===============================
// AI RESPONSE
// ===============================
const generateAIResponse = async (text) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an automotive sales assistant for ndestore.com",
          },
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

  } catch (err) {
    return "Please share your car model & part 👍";
  }
};

module.exports = {
  handleWebhook,
  verifyWebhook,
};
