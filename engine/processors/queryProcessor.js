const { detectIntent } = require("../semantic/intentMapper");

// ✅ MAIN QUERY PROCESSOR
const processQuery = (text = "") => {
  console.log("📥 Processing Query:", text);

  // 🔥 STEP 1: Detect Intent
  const intentData = detectIntent(text);

  console.log("🧠 Intent Result:", intentData);

  // 🔥 STEP 2: Build Response Object
  return {
    success: true,
    data: intentData
  };
};

module.exports = {
  processQuery
};
