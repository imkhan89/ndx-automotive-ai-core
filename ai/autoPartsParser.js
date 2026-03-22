const axios = require('axios');

module.exports = async (input) => {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Extract partName, make, model, year from text. Return JSON only."
                },
                {
                    role: "user",
                    content: input
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const text = response.data.choices[0].message.content;
        return JSON.parse(text);

    } catch (e) {
        return null;
    }
};
