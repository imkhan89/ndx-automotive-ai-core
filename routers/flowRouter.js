const stateRepo = require("../state/stateRepository");

// Flow entry points
const autoPartsEntry = require("../flows/autoParts/entry");

exports.route = async (user, text) => {

  const state = stateRepo.get(user);

  // Safety fallback
  if (!state || !state.flow) {
    return null;
  }

  switch (state.flow) {

    case "autoParts":
      return autoPartsEntry(user, text, state);

    // Future flows (kept isolated)
    case "accessories":
    case "decals":
    case "orders":
    case "support":
    case "complaints":
      return require("../services/whatsappService").send(
        user,
        "This section is coming soon."
      );

    default:
      return null;
  }
};
