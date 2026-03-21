const { runFlow } = require("./flowPipeline");
const { sendTextMessage } = require("../services/whatsappService");

// ======================================================
// ✅ MAIN MESSAGE PIPELINE (FINAL CLEAN VERSION)
// ======================================================
async function runMessagePipeline({ from, text }) {
  try {
    console.log("💬 USER:", text);

    // --------------------------------------------------
    // STEP 1: PASS RAW INPUT TO FLOW (NO AI PARSER)
    // --------------------------------------------------
    const result = await runFlow({
      user: from,
      text: text || ""
    });

    console.log("📦 Flow Result:", result);

    // --------------------------------------------------
    // STEP 2: SEND RESPONSE
    // --------------------------------------------------
    if (result && result.reply) {
      await sendTextMessage(from, result.reply);
    } else {
      await sendTextMessage(
        from,
        "⚠️ Unable to process request. Please try again."
      );
    }

  } catch (error) {
    console.error("❌ Pipeline Error:", error);

    await sendTextMessage(
      from,
      "⚠️ System error. Please try again later."
    );
  }
}

module.exports = { runMessagePipeline };
