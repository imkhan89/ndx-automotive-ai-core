const commandPipeline = require("./commandPipeline");
const flowPipeline = require("./flowPipeline");

exports.execute = async (user, text) => {
  const commandHandled = await commandPipeline.execute(user, text);

  if (commandHandled) return;

  return flowPipeline.execute(user, text);
};
