const { processQuery } = require("../engine/processors/queryProcessor");
const { sendWhatsAppMessage } = require("../services/whatsappService");

// ✅ MAIN PIPELINE
const runMessagePipeline = async ({ from, text }) => {
  try {
    console.log("📥 Incoming Message:", text);

    // 🔹 STEP 1: PROCESS QUERY (ENGINE)
    const result = processQuery(text);

    console.log("🧠 Processed Result:", result);

    // 🔹 STEP 2: EXTRACT DATA
    const { part, positions, intent } = result.data || {};

    // 🔹 STEP 3: BUILD RESPONSE (TEMP FORMAT)
    let reply = "";

    if (intent === "PART_SEARCH") {
      reply = `🔧 Part: ${part || "Not detected"}\n📍 Position: ${
        positions?.join(", ") || "Not specified"
      }`;
    } else {
      reply = "👋 Welcome to ND Auto Parts\nHow can I help you today?";
    }

    // 🔹 STEP 4: SEND TO WHATSAPP
    await sendWhatsAppMessage(from, reply);

    console.log("✅ Reply Sent:", reply);

    return true;

  } catch (error) {
    console.error("❌ Pipeline Error:", error);

    // fallback reply
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
