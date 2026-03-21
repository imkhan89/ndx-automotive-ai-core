const { processQuery } = require("../engine/processors/queryProcessor");

const runQueryEngine = async (text) => {
  try {
    const result = processQuery(text);

    console.log("🧠 ENGINE RESULT:", result);

    if (!result.found) {
      return "❌ Sorry, we couldn't find the exact part.\nPlease share vehicle + part name.";
    }

    const product = result.product;

    return `✅ *${product.name}*\n💰 Price: ${product.price}\n🚗 Vehicle: ${product.vehicle}`;
    
  } catch (err) {
    console.error("QueryEngine Error:", err);
    return "⚠️ System error. Please try again.";
  }
};

module.exports = {
  runQueryEngine
};
