const commandRouter = require('../system/commandRouter');

exports.handleWebhook = async (req, res) => {
    try {
        // ✅ ALWAYS respond immediately to Meta
        res.sendStatus(200);

        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const message = changes?.value?.messages?.[0];

        if (!message) return;

        const from = message.from;
        const text = message.text?.body || "";

        // Process async (AFTER 200 response)
        await commandRouter.route({
            from,
            text
        });

    } catch (error) {
        console.error("Webhook Error:", error);
    }
};
