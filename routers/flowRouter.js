const stateRepo = require("../state/stateRepository");
const send = require("../services/whatsappService").send;

const mainMenu = require("../interface/templates/mainMenuTemplate");

// Flow entries
const autoPartsEntry = require("../flows/autoParts/entry");

// (Placeholders for future)
const notImplemented = async (user) => {
  return send(user, "This section is coming soon.");
};

exports.route = async (user, text) => {

  let state = stateRepo.get(user);

  // 🟢 FIRST TIME USER
  if (!state) {
    stateRepo.set(user, { flow: "main" });
    return send(user, mainMenu());
  }

  // 🟢 IF USER IS IN FLOW → CONTINUE FLOW
  if (state.flow === "autoParts") {
    return autoPartsEntry(user, text, state);
  }

  // 🟡 MAIN MENU HANDLING
  switch (text) {

    case "1":
      state.flow = "autoParts";
      state.step = "category";
      stateRepo.set(user, state);

      return autoPartsEntry(user, "", state);

    case "2":
      return notImplemented(user);

    case "3":
      return notImplemented(user);

    case "4":
      return notImplemented(user);

    case "5":
      return notImplemented(user);

    case "6":
      return notImplemented(user);

    default:
      return send(user, mainMenu());
  }
};
