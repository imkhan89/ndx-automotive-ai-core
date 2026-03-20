const categorySelection = require("./categorySelection");

module.exports = (user, text, state) => {
  return categorySelection(user, text, state);
};
