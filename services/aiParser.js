// FILE: services/aiParser.js

const OpenAI = require("openai");

// 🔐 INIT OPENAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ==============================
// 🧠 MAIN AI PARSER FUNCTION
// ==============================
async function aiParser(message) {
  try {
    if (!message) {
      return null;
    }

    // 🔥 PROMPT (STRICT JSON OUTPUT)
    const prompt = `
Extract automotive details from the user query.

Return ONLY JSON. No explanation.

Format:
{
  "make": "",
  "model": "",
  "part": ""
}

Examples:
Input: Toyota Corolla air filter
Output:
{
  "make": "Toyota",
  "model": "Corolla",
  "part": "air filter"
}

Input: Honda Civic brake pads
Output:
{
  "make": "Honda",
  "model": "Civic",
  "part": "brake pad"
}

Now extract:

Input: ${message}
`;

    // 🔥 OPENAI CALL
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an automotive parts assistant. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0
    });

    let content = response.choices[0].message.content;

    // ==============================
    // 🔧 CLEAN RESPONSE (IMPORTANT)
    // ==============================

    // Remove markdown if exists
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    // ==============================
    // 🔍 PARSE JSON SAFELY
    // ==============================

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON Parse Error:", content);
      return null;
    }

    // ==============================
    // ✅ VALIDATION
    // ==============================

    if (!parsed.make || !parsed.model || !parsed.part) {
      console.log("⚠️ Incomplete AI data:", parsed);
      return null;
    }

    return {
      make: parsed.make.trim(),
      model: parsed.model.trim(),
      part: parsed.part.toLowerCase().trim()
    };

  } catch (error) {
    console.error("❌ AI Parser Error:", error);
    return null;
  }
}

// ==============================
// EXPORT (CRITICAL FIX)
// ==============================
module.exports = aiParser;
