const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseQuery(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an automotive AI.

Extract:
- vehicle make/model/year
- part name
- position (front/rear/left/right/upper/lower/inner/outer)

Return JSON only:
{
  "vehicle": "",
  "part": "",
  "position": {
    "front": false,
    "rear": false,
    "left": false,
    "right": false,
    "upper": false,
    "lower": false,
    "inner": false,
    "outer": false
  }
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

    const text = response.choices[0].message.content;

    return JSON.parse(text);

  } catch (error) {
    console.error("❌ AI Parser Error:", error.message);

    return {
      vehicle: null,
      part: null,
      position: {}
    };
  }
}

module.exports = parseQuery;
