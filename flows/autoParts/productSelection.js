const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const confirmationTemplate = require("../../interface/templates/confirmationTemplate");
const errorTemplate = require("../../interface/templates/errorTemplate");
const validationDecision = require("../../decisions/validationDecision");

module.exports = (user, text, state) => {

  // 🧠 Validate input
  if (!validationDecision(text, "number")) {
    return send(user, errorTemplate.invalidSelection());
  }

  const index = parseInt(text) - 1;
  const product = state.products[index];

  if (!product) {
    return send(user, errorTemplate.invalidSelection());
  }

  state.selected = product;
  state.step = "confirm";
  stateRepo.set(user, state);

  return send(user, confirmationTemplate(product));
};
