const axios = require("axios");

// ===============================
// 🔥 EXTRACT AUTO INTENT
// ===============================
const extractAutoIntent = async (message) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Extract structured automotive data.

Return ONLY valid JSON:

{
  "make": "",
  "model": "",
  "year": "",
  "part": ""
}

Rules:
- Detect brand (Toyota, Honda, Suzuki, etc.)
- Detect model (Corolla, Civic, Wagon R, etc.)
- Detect year if present
- Detect part (air filter, brake pads, spark plug, oil filter, etc.)
- If missing → return empty string
            `
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = res.data.choices[0].message.content;

    console.log("🤖 AI RAW:", content);

    return JSON.parse(content);

  } catch (err) {
    console.error("❌ AI Parser Error:", err.message);
    return null;
  }
};

module.exports = {
  extractAutoIntent
};
