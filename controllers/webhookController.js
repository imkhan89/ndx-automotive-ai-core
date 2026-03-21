const { sendTextMessage } = require("../services/whatsappService");
const { processUserMessage } = require("./aiController"); // ✅ ENABLE AI

async function handleWebhook(req, res) {
  try {
    console.log("=================================");
    console.log("🔥 WEBHOOK EVENT RECEIVED");
    console.log("=================================");

    // ✅ CRITICAL: Respond immediately to Meta
    res.sendStatus(200);

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // ✅ Full debug (keep this for now)
    console.log("📦 FULL PAYLOAD:");
    console.log(JSON.stringify(req.body, null, 2));

    // ❌ Ignore non-message events (delivery/read)
    if (!value?.messages) {
      console.log("ℹ️ No user message (status update event)");
      return;
    }

    const message = value.messages[0];

    const from = message.from;
    const messageType = message.type;

    console.log("📩 From:", from);
    console.log("📌 Type:", messageType);

    let userText = "";

    // =====================================================
    // ✅ HANDLE ALL MESSAGE TYPES
    // =====================================================

    if (messageType === "text") {
      userText = message.text?.body || "";
    } else if (messageType === "button") {
      userText = message.button?.text || "";
    } else if (messageType === "interactive") {
      userText =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        "interactive message";
    } else {
      userText = "Unsupported message type";
    }

    console.log("💬 User Message:", userText);

    // =====================================================
    // 🚀 MAIN FLOW (AI + SHOPIFY)
    // =====================================================

    await processUserMessage(from, userText);

  } catch (error) {
    console.error(
      "❌ WEBHOOK ERROR:",
      error.response?.data || error.message || error
    );
  }
}

module.exports = {
  handleWebhook,
};
