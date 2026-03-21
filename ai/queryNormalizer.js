const spell = require("./spellingCorrection");
const synonym = require("./synonymEngine");

module.exports = (text = "") => {

  let output = text;

  output = spell(output);
  output = synonym(output);

  return output;
};
