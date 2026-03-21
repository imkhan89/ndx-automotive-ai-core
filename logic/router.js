const autoPartsEntry = require("../flows/autoParts/entry");
const chatFlow = require("../flows/chatFlow");
const { extractAutoIntent } = require("../services/aiParser");

// ===============================
// 🔥 MAIN ROUTER
// ===============================
const routeMessage = async (userId, message) => {
  try {
    const text = message.toLowerCase().trim();

    console.log("🧠 Routing message:", text);

    // ===============================
    // 🔹 HANDLE EXISTING SESSION FIRST
    // ===============================
    // If user already inside autoParts flow → continue flow
    const autoPartsFlow = require("../flows/autoParts/entry");

    if (autoPartsFlow.isUserInFlow && autoPartsFlow.isUserInFlow(userId)) {
      console.log("🔁 Continuing existing autoParts flow");
      return await autoPartsEntry.handleAutoPartsFlow(userId, message);
    }

    // ===============================
    // 🔥 AI INTENT EXTRACTION
    // ===============================
    let aiData = null;

    try {
      aiData = await extractAutoIntent(message);
      console.log("🤖 AI Extracted:", aiData);
    } catch (err) {
      console.error("⚠️ AI failed, fallback to keyword detection");
    }

    // ===============================
    // 🔹 AUTO PARTS FLOW (AI BASED)
    // ===============================
    if (aiData && aiData.part) {
      console.log("🚗 AutoParts Flow Triggered (AI)");

      return await autoPartsEntry.handleAutoPartsFlow(
        userId,
        message,
        aiData
      );
    }

    // ===============================
    // 🔹 KEYWORD FALLBACK (IMPORTANT)
    // ===============================
    if (
      text.includes("filter") ||
      text.includes("brake") ||
      text.includes("spark") ||
      text.includes("plug") ||
      text.includes("oil") ||
      text.includes("part")
    ) {
      console.log("🚗 AutoParts Flow Triggered (Keyword)");

      return await autoPartsEntry.handleAutoPartsFlow(
        userId,
        message
      );
    }

    // ===============================
    // 🔹 DEFAULT CHAT FLOW
    // ===============================
    console.log("🤖 Chat Flow Triggered");

    return await chatFlow(userId, message);

  } catch (err) {
    console.error("❌ Router error:", err.message);
  }
};

module.exports = {
  routeMessage
};
