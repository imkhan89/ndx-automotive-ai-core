const synonymMap = require("../../utils/synonymMap");

const detectIntent = (text = "") => {
  const lower = text.toLowerCase();

  let intent = "unknown";

  if (
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("kit")
  ) {
    intent = "purchase";
  } else if (
    lower.includes("available") ||
    lower.includes("have") ||
    lower.includes("stock")
  ) {
    intent = "availability";
  } else if (
    lower.includes("what") ||
    lower.includes("which")
  ) {
    intent = "inquiry";
  }

  return intent;
};

const extractEntities = (text = "") => {
  const normalized = synonymMap(text);

  return {
    raw: text,
    normalized
  };
};

module.exports = {
  detectIntent,
  extractEntities
};
