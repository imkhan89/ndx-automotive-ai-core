const { parseSynonyms } = require("../../utils/synonymMap");

// ✅ MAIN INTENT DETECTOR
const detectIntent = (text = "") => {
  const parsed = parseSynonyms(text);

  return {
    intent: parsed.intent,
    part: parsed.part,
    positions: parsed.positions,
    normalized: parsed.normalized,
    raw: parsed.raw
  };
};

// ✅ EXPORT (VERY IMPORTANT)
module.exports = {
  detectIntent
};
