const { parseSynonyms } = require("../../utils/synonymMap");

// ✅ MAIN FUNCTION
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

module.exports = {
  detectIntent
};
