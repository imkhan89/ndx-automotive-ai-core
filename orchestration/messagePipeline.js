const { parseUserInput } = require("../services/aiParser");
const { runFlow } = require("./flowPipeline");
const { sendTextMessage } = require("../services/whatsappService");

async function runMessagePipeline({ from, text }) {
  try {
    // STEP 1: AI PARSE
    const parsed = await parseUserInput(text);

    console.log("🧠 AI Parsed:", parsed);

    // STEP 2: FLOW EXECUTION
    const result = await runFlow(parsed, from);

    // STEP 3: SEND RESPONSE
    if (result?.reply) {
      await sendTextMessage(from, result.reply);
    }

  } catch (error) {
    console.error("Pipeline Error:", error);

    await sendTextMessage(from,
      "⚠️ Something went wrong. Please try again."
    );
  }
}

module.exports = { runMessagePipeline };
