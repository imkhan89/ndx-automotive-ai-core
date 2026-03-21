const axios = require("axios");
const { sendTextMessage } = require("../services/whatsappService");
const { searchProducts } = require("../services/shopifyService");

// ===============================
// 🔹 VERIFY WEBHOOK (FIX CRASH)
// ===============================
const verifyWebhook = (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === process.env.VERIFY_TOKEN) {
      console.log("✅ Webhook verified");
      return res.status(200).send(challenge);
    } else {
      console.log("❌ Verification failed");
      return res.sendStatus(403);
    }
  } catch (err) {
    console.error("❌ Verify Error:", err);
    return res.sendStatus(500);
  }
};

// ===============================
// 🔹 HANDLE WEBHOOK
// ===============================
const handleWebhook = async (req, res) => {
  try {
    console.log("=================================");
    console.log("🔥 WEBHOOK EVENT RECEIVED");
    console.log("=================================");

    // ✅ Respond immediately
    res.sendStatus(200);

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    console.log("📦 FULL PAYLOAD:");
    console.log(JSON.stringify(req.body, null, 2));

    if (!value?.messages) {
      console.log("ℹ️ No user message");
      return;
    }

    const message = value.messages[0];
    const from = message.from;
    const type = message.type;

    console.log("📩 From:", from);
    console.log("📌 Type:", type);

    let userText =
      message.text?.body ||
      message.button?.text ||
      message.interactive?.button_reply?.title ||
      message.interactive?.list_reply?.title ||
      "";

    console.log("💬 User:", userText);

    // ===============================
    // 🔹 LIVE SHOPIFY SEARCH
    // ===============================
    const products = await searchProducts(userText);

    let finalReply = "";

    if (products.length > 0) {
      console.log("🛒 Products Found:", products.length);

      finalReply = "🛒 *Available Products:*\n\n";

      products.forEach((p, i) => {
        const price = p.variants[0]?.price || "N/A";
        const link = `https://${process.env.SHOPIFY_STORE}/products/${p.handle}`;

        finalReply += `*${i + 1}. ${p.title}*\n`;
        finalReply += `💰 Price: PKR ${price}\n`;
        finalReply += `🔗 ${link}\n\n`;
      });

      finalReply += "Reply with product name to confirm order 👍";

    } else {
      console.log("🤖 No product → AI fallback");

      finalReply = await generateAIResponse(userText);
    }

    // ===============================
    // 🔹 SEND MESSAGE
    // ===============================
    console.log("🚀 BEFORE SEND");

    const result = await sendTextMessage(from, finalReply);

    console.log("📤 SEND RESULT:", result);
    console.log("✅ AFTER SEND");

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error.message);
  }
};

// ===============================
// 🔹 AI RESPONSE
// ===============================
const generateAIResponse = async (userMessage) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an automotive expert for ndestore.com.

- Help users find car parts
- Ask missing info
- Recommend products
- Keep replies short & professional
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    return "Please share your car model & part needed 👍";
  }
};

// ===============================
// 🔹 EXPORTS (CRITICAL FIX)
// ===============================
module.exports = {
  handleWebhook,
  verifyWebhook,
};
