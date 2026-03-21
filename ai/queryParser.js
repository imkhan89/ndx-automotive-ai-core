const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const parseQueryAI = async (message) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an automotive query parser.

Extract:
- make
- model
- year

Return ONLY valid JSON.

Example:
{
  "make": "Toyota",
  "model": "Corolla",
  "year": "2017"
}
`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0
    });

    const raw = response.choices[0].message.content;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("JSON Parse Error:", raw);
      return { raw: message };
    }

  } catch (err) {
    console.error("AI Parse Error:", err.message);
    return { raw: message };
  }
};

module.exports = {
  parseQueryAI
};
