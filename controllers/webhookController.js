const axios = require("axios");
const { sendTextMessage } = require("../services/whatsappService");

// ===============================
// 🔹 VERIFY WEBHOOK (GET)
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
      console.log("❌ Webhook verification failed");
      return res.sendStatus(403);
    }
  } catch (error) {
    console.error("❌ VERIFY ERROR:", error);
    return res.sendStatus(500);
  }
};

// ===============================
// 🔹 HANDLE INCOMING MESSAGES
// ===============================
const handleWebhook = async (req, res) => {
  try {
    console.log("=================================");
    console.log("🔥 WEBHOOK EVENT RECEIVED");
    console.log("=================================");

    // ✅ Respond immediately (VERY IMPORTANT)
    res.sendStatus(200);

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    console.log("📦 FULL PAYLOAD:");
    console.log(JSON.stringify(req.body, null, 2));

    // ❌ Ignore non-message events
    if (!value?.messages) {
      console.log("ℹ️ No user message");
      return;
    }

    const message = value.messages[0];
    const from = message.from;
    const type = message.type;

    console.log("📩 From:", from);
    console.log("📌 Type:", type);

    let userText = "";

    // ===============================
    // 🔹 HANDLE MESSAGE TYPES
    // ===============================
    if (type === "text") {
      userText = message.text?.body || "";
    } else if (type === "button") {
      userText = message.button?.text || "";
    } else if (type === "interactive") {
      userText =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        "interactive message";
    } else {
      userText = "Unsupported message";
    }

    console.log("💬 User Message:", userText);

    // ===============================
    // 🔹 GENERATE AI RESPONSE
    // ===============================
    const aiReply = await generateAIResponse(userText);

    console.log("🤖 AI Reply:", aiReply);

    // ===============================
    // 🔹 SEND WHATSAPP MESSAGE
    // ===============================
    console.log("🚀 BEFORE SEND");

    const result = await sendTextMessage(from, aiReply);

    console.log("📤 SEND RESULT:", result);
    console.log("✅ AFTER SEND");

  } catch (error) {
    console.error(
      "❌ WEBHOOK ERROR:",
      error.response?.data || error.message || error
    );
  }
};

// ===============================
// 🔹 OPENAI RESPONSE FUNCTION
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
You are a professional automotive assistant for ndestore.com (Pakistan).

Your job:
- Help users find correct car parts
- Ask relevant questions (car make, model, year, engine)
- Recommend products (air filters, oil filters, brake pads, etc.)
- Keep replies short, clear, and sales-focused
- Suggest ordering from ndestore.com when relevant
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
    console.error(
      "❌ OpenAI Error:",
      error.response?.data || error.message
    );

    return "Sorry, I'm facing a temporary issue. Please try again shortly.";
  }
};

// ===============================
// 🔹 EXPORTS (CRITICAL)
// ===============================
module.exports = {
  handleWebhook,
  verifyWebhook,
};
