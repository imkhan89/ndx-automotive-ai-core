const autoPartsEntry = require("../flows/autoParts/entry");
const { extractAutoIntent } = require("../services/aiParser");

// ===============================
// 🔥 MAIN ROUTER
// ===============================
const routeMessage = async (userId, message) => {
  try {
    const text = message.toLowerCase().trim();

    console.log("🧠 Routing message:", text);

    // ===============================
    // 🔹 CONTINUE EXISTING FLOW
    // ===============================
    if (autoPartsEntry.isUserInFlow(userId)) {
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
      console.error("⚠️ AI failed:", err.message);
    }

    // ===============================
    // 🔹 AUTO PARTS FLOW (AI)
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
    // 🔹 KEYWORD FALLBACK
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

      return await autoPartsEntry.handleAutoPartsFlow(userId, message);
    }

    // ===============================
    // 🔹 SAFE DEFAULT RESPONSE
    // ===============================
    return `👋 Welcome to NDE Store!

Please tell me:
🚗 Car Make (e.g. Toyota)
🚘 Model (e.g. Corolla)
🔧 Part (e.g. air filter)

Example:
👉 Corolla 2015 air filter`;

  } catch (err) {
    console.error("❌ Router error:", err.message);
    return "⚠️ System error. Please try again.";
  }
};

module.exports = {
  routeMessage
};
