const parseQuery = require("../ai/queryParser");

async function processQuery(message, state = {}) {

  // 🔴 FIRST TIME USER → ALWAYS SHOW MENU
  if (!state.step) {
    return {
      type: "menu"
    };
  }

  // 🔹 AFTER menu → allow AI
  const parsed = await parseQuery(message);

  return {
    type: "product_search",
    data: parsed
  };
}

module.exports = { processQuery };
