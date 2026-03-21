const stateRepo = require("../state/stateRepository");

const autoPartsEntry = require("../flows/autoParts/entry");

module.exports = {

  route: async ({ user, text }) => {

    let state = stateRepo.get(user);

    // 🔹 FIRST TIME USER → SHOW MENU
    if (!state) {
      state = { flow: "main" };
      stateRepo.set(user, state);

      return {
        reply: `Main Menu:

1. Auto Parts
2. Accessories
3. Decal Stickers
4. Order Status
5. Complaint
6. Chat Support

Reply with number`
      };
    }

    // 🔹 CONTINUE EXISTING FLOW
    if (state.flow === "autoParts") {
      await autoPartsEntry(user, text, state);
      return null; // flow already sent response
    }

    // 🔹 MANUAL MENU SELECTION
    if (text === "1") {
      state.flow = "autoParts";
      state.step = "category";
      stateRepo.set(user, state);

      await autoPartsEntry(user, "", state);
      return null;
    }

    // 🔹 FALLBACK → MENU
    return {
      reply: `Main Menu:

1. Auto Parts
2. Accessories
3. Decal Stickers
4. Order Status
5. Complaint
6. Chat Support

Reply with number`
    };
  }

};
