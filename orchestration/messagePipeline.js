const { processQuery } = require("../engine/processors/queryProcessor");
const { whatsappFormatter } = require("../interface/formatters/whatsappFormatter");
const { sendWhatsAppMessage } = require("../services/whatsappService");

// ✅ MAIN PIPELINE
const runMessagePipeline = async ({ from, text, state = {} }) => {
  try {
    console.log("📥 Incoming Message:", text);
    console.log("📦 Current State:", state);

    let reply = "";

    // 🔴 FIRST TIME → SHOW MENU
    if (!state.step) {
      reply = whatsappFormatter("menu", null, state);
    }

    // 🔴 MENU HANDLING
    else if (state.step === "menu") {
      reply = whatsappFormatter("menu_selection", text, state);
    }

    // 🔴 AUTO PARTS FLOW
    else if (state.step === "auto_parts") {

      const result = processQuery(text);
      const data = result.data || {};

      reply = whatsappFormatter("product_result", data, state);
    }

    // 🔹 SEND MESSAGE
    await sendWhatsAppMessage(from, reply);

    console.log("✅ Reply Sent:", reply);

    return true;

  } catch (error) {
    console.error("❌ Pipeline Error:", error);

    await sendWhatsAppMessage(
      from,
      "⚠️ Sorry, something went wrong. Please try again."
    );

    return false;
  }
};

module.exports = {
  runMessagePipeline
};
