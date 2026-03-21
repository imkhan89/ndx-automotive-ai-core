const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseUserInput(text) {
  const prompt = `
You are an automotive expert for ndestore.com.

Extract:
- product
- car make
- model
- year
- intent (search / order)

User: "${text}"

Return JSON only:
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    return JSON.parse(res.choices[0].message.content);
  } catch {
    return {
      intent: "search",
      product: text,
    };
  }
}

module.exports = { parseUserInput };
