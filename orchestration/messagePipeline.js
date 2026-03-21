const { parseUserInput } = require("../services/aiParser");
const { runFlow } = require("./flowPipeline");
const { sendTextMessage } = require("../services/whatsappService");

const normalize = require("../ai/queryNormalizer");

async function runMessagePipeline({ from, text }) {
  try {
    // 🔹 STEP 1: Normalize (spelling + synonym)
    text = normalize(text);

    // 🔹 STEP 2: AI Parse (your existing system)
    const parsed = await parseUserInput(text);

    console.log("🧠 AI Parsed:", parsed);

    // 🔹 STEP 3: Flow Execution
    const result = await runFlow(parsed, from);

    // 🔹 STEP 4: Send Response
    if (result?.reply) {
      await sendTextMessage(from, result.reply);
    }

  } catch (error) {
    console.error("Pipeline Error:", error);

    await sendTextMessage(
      from,
      "⚠️ Something went wrong. Please try again."
    );
  }
}

module.exports = { runMessagePipeline };
