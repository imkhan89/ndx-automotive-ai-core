const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const parseQueryAI = async (message) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5.3",
      messages: [
        {
          role: "user",
          content: `
Extract vehicle details from this:

"${message}"

Return JSON:
{
  "make": "",
  "model": "",
  "year": ""
}
`
        }
      ]
    });

    return JSON.parse(response.choices[0].message.content);

  } catch (err) {
    console.error("AI Parse Error:", err.message);
    return { raw: message };
  }
};

module.exports = {
  parseQueryAI
};
