const { detectIntent } = require("../../engine/semantic/intentMapper");
const { processQuery } = require("../../engine/processors/queryProcessor");
const { whatsappFormatter } = require("../../interface/formatters/whatsappFormatter");

async function handleUserQuery(message, state) {

  // 1. Intent Detection
  const intent = detectIntent(message);

  // 2. Menu Flow Control
  if (!state.step) {
    return whatsappFormatter("menu");
  }

  if (state.step === "menu") {
    return whatsappFormatter("menu_selection", message, state);
  }

  // 3. Core Processing
  const result = await processQuery(message);

  // 4. Format Output (STRICTLY SEPARATED)
  return whatsappFormatter("product_result", result);
}

module.exports = { handleUserQuery };
