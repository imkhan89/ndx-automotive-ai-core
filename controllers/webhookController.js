const axios = require("axios");
const { sendTextMessage } = require("../services/whatsappService");
const { findProductMatch } = require("../utils/productMap");

// ===============================
// 🔹 VERIFY WEBHOOK
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
      return res.sendStatus(403);
    }
  } catch (err) {
    console.error("❌ VERIFY ERROR:", err);
    return res.sendStatus(500);
  }
};

// ===============================
// 🔹 HANDLE WEBHOOK
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
    // 🔹 PRODUCT MATCHING (AI + RULES)
    // ===============================
    const matchedProduct = findProductMatch(userText);

    let finalReply = "";

    if (matchedProduct) {
      finalReply = buildSalesReply(matchedProduct);
    } else {
      finalReply = await generateAIResponse(userText);
    }

    // ===============================
    // 🔹 SEND
    // ===============================
    await sendTextMessage(from, finalReply);

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error.message);
  }
};

// ===============================
// 🔹 SALES REPLY BUILDER
// ===============================
const buildSalesReply = (product) => {
  let reply = `✅ *${product.name}*

💰 Price: ${product.price}

🔗 Order Now:
${product.link}`;

  // Upsell
  if (product.upsell) {
    reply += `

🔥 *Recommended Add-on:*
${product.upsell.name}

💰 Price: ${product.upsell.price}

👉 ${product.upsell.link}

💡 Order both & save delivery cost!`;
  }

  reply += `

🚗 Need confirmation for your exact model? Tell me your variant 👍`;

  return reply;
};

// ===============================
// 🔹 AI RESPONSE (UNLIMITED LEARNING CORE)
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
You are an expert automotive AI sales assistant for ndestore.com.

Rules:
- Understand ANY car, ANY part (no limitation)
- Ask missing info (Make, Model, Year, Engine)
- Recommend parts intelligently
- Be concise, professional, sales-focused
- Encourage buying from ndestore.com
- If unclear → ask questions instead of guessing
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
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
    return "Please share your car model & part required 👍";
  }
};

// ===============================
module.exports = {
  handleWebhook,
  verifyWebhook,
};
