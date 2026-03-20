const menuCommand = require("../commands/menuCommand");

exports.route = (text) => {
  text = text.toLowerCase();

  if (text === "menu") return menuCommand;

  return null;
};
