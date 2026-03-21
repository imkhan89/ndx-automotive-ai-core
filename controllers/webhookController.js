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
// 🔹 HANDLE INCOMING MESSAGES (POST)
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

    // ❌ No message
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
    // 🔹 MESSAGE TYPES
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
    // 🔹 SEND REPLY (DEBUG SAFE)
    // ===============================
    console.log("🚀 BEFORE SEND");

    const result = await sendTextMessage(
      from,
      `✅ TEST MESSAGE RECEIVED: ${userText}`
    );

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
// 🔹 EXPORTS (CRITICAL FIX)
// ===============================
module.exports = {
  handleWebhook,
  verifyWebhook,
};
