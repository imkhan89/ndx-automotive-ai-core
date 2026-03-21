const { parseQueryAI } = require("../ai/queryParser");
const { normalizePart } = require("../ai/synonymEngine");
const { extractPosition } = require("../engine/positionEngine");
const { matchProduct } = require("../utils/productMatcher");

const processQuery = async (message) => {
  try {
    // 🧠 Step 1: AI Parse (vehicle extraction)
    const parsed = await parseQueryAI(message);

    // 🔧 Step 2: Part detection
    const part = normalizePart(message);

    // 📍 Step 3: Position detection
    const position = extractPosition(message);

    // 🔎 Step 4: Product match
    const product = await matchProduct({
      ...parsed,
      part,
      position
    });

    // 🧾 Step 5: Response formatting
    const reply = `
🚗 Vehicle: ${parsed.make || ""} ${parsed.model || ""} ${parsed.year || ""}

🔧 Part: ${part || "Not detected"}

📍 Position:
${JSON.stringify(position, null, 2)}

${product ? "✅ Product Found" : "❌ No Product Found"}
`;

    return { reply };

  } catch (error) {
    console.error("❌ Query Engine Error:", error.message);

    return {
      reply: "⚠️ System error. Please try again."
    };
  }
};

module.exports = {
  processQuery
};
