const stateRepo = require("../state/stateRepository");

const autoPartsEntry = require("../flows/autoParts/entry");

module.exports = {

  route: async ({ user, text }) => {

    let state = stateRepo.get(user);

    // FIRST TIME → MENU
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

    // SELECT AUTO PARTS
    if (text === "1") {
      state.flow = "autoParts";
      stateRepo.set(user, state);

      return {
        reply: "🔍 Enter product (e.g., Corolla air filter)"
      };
    }

    // CONTINUE AUTO PARTS FLOW
    if (state.flow === "autoParts") {
      return await autoPartsEntry(user, text, state);
    }

    // FALLBACK
    return {
      reply: "⚠️ Invalid option. Reply 1–6"
    };
  }

};
