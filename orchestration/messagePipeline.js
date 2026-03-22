const stateRepo = require("../state/stateRepository");
const flowRouter = require("../routers/flowRouter");
const menuHandler = require("./menuHandler");

const send = require("../services/whatsappService").send;
const mainMenu = require("../interface/templates/mainMenuTemplate");

exports.execute = async (user, text) => {

  // Normalize input
  text = (text || "").trim();

  let state = stateRepo.get(user);

  // 🟢 FIRST TIME USER → SHOW MENU
  if (!state) {
    state = { flow: "main" };
    stateRepo.set(user, state);
    return send(user, mainMenu());
  }

  // 🔴 GLOBAL INTERRUPTS (OPTIONAL SAFE HOOK)
  if (text === "#" || text.toLowerCase() === "menu") {
    stateRepo.set(user, { flow: "main" });
    return send(user, mainMenu());
  }

  // 🟡 IF USER IS INSIDE FLOW → FLOW OWNS INPUT
  if (state.flow !== "main") {
    return flowRouter.route(user, text);
  }

  // 🔵 OTHERWISE → MENU HANDLER
  return menuHandler(user, text, state);
};
