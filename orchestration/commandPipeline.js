const commandRouter = require("../routers/commandRouter");

exports.execute = async (user, text) => {
  const command = commandRouter.route(text);

  if (!command) return false;

  await command(user);

  return true;
};
