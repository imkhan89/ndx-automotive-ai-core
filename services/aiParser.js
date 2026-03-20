// FILE: services/aiParser.js

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseUserInput(message) {
  try {
    const prompt = `
Extract structured automotive data from user message.

Return JSON ONLY with:
- make
- model
- year (optional)
- part

Message: "${message}"
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const text = response.choices[0].message.content;

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Parser Error:", error);
    return null;
  }
}

module.exports = { parseUserInput };
