const { runMessagePipeline } = require("../orchestration/messagePipeline");

async function processIncomingMessage(body) {
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (!message) return;

  const from = message.from;
  const text = message.text?.body;

  console.log("📩 Incoming:", from, text);

  await runMessagePipeline({
    from,
    text,
  });
}

module.exports = { processIncomingMessage };
