const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseUserInput(message) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract car make, model, year (if any), and part. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0,
    });

    let text = response.choices[0].message.content;

    console.log("RAW AI RESPONSE:", text);

    // 🔥 CLEAN RESPONSE (IMPORTANT)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Parser Error:", error.message);
    return null;
  }
}

module.exports = { parseUserInput };
