const { parseQueryAI } = require("../ai/queryParser");
const { normalizePart } = require("../ai/synonymEngine");
const { extractPosition } = require("../engine/positionEngine");
const { matchProduct } = require("../utils/productMatcher");

const processQuery = async (message) => {

  const parsed = await parseQueryAI(message);

  const part = normalizePart(message);

  const position = extractPosition(message);

  const product = await matchProduct({
    ...parsed,
    part,
    position
  });

  return {
    reply: `
🚗 ${parsed.make || ""} ${parsed.model || ""} ${parsed.year || ""}

🔧 Part: ${part || "Not detected"}
📍 Position: ${JSON.stringify(position)}

${product ? "✅ Product Found" : "❌ No Product Found"}
`
  };
};

module.exports = {
  processQuery
};
