const { detectIntent, extractEntities } = require("../semantic/intentMapper");
const { findProductMatch } = require("../../utils/productMatcher");

const processQuery = (text = "") => {
  const intent = detectIntent(text);

  const entities = extractEntities(text);

  const product = findProductMatch(entities.normalized);

  return {
    intent,
    query: entities.normalized,
    product,
    found: !!product
  };
};

module.exports = {
  processQuery
};
