const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  // Move directly to free text mode
  state.step = "freeText";
  stateRepo.set(user, state);

  return send(user,
`Share Auto Parts Inquiry in the following format:

Part Name:
Vehicle Make:
Model Name:
Model Year:

Example:
Air Filter Suzuki Swift 2021`
  );
};
