const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const validate = require("../../decisions/validationDecision");
const confirm = require("../../interface/templates/confirmationTemplate");
const error = require("../../interface/templates/errorTemplate");
const pricing = require("../../decisions/pricingDecision");

module.exports = (user, text, state) => {

  const valid = validate(text, state.products.length);

  if (!valid) return send(user, error.invalidSelection());

  let product = state.products[text - 1];

  product = pricing(user, product);

  state.selected = product;
  state.step = "confirm";
  stateRepo.set(user, state);

  return send(user, confirm(product));
};
