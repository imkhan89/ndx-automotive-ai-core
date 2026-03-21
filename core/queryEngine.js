const parseQuery = require("../ai/queryParser");

function detectIntent(message) {
  const msg = message.toLowerCase();

  if (["hi", "hello", "aoa", "assalamualaikum"].some(w => msg.includes(w))) {
    return "greeting";
  }

  if (msg.length < 3) return "unknown";

  return "product_search";
}

async function processQuery(message) {
  const intent = detectIntent(message);

  // 👉 Greeting handling
  if (intent === "greeting") {
    return {
      type: "text",
      reply: "👋 Welcome to NDE Store!\nPlease tell me your car model and required part."
    };
  }

  // 👉 Product search
  const parsed = await parseQuery(message);

  return {
    type: "product_search",
    data: parsed
  };
}

module.exports = { processQuery };
