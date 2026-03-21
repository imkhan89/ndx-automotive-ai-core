const stateRepo = require("../state/stateRepository");

const autoPartsEntry = require("../flows/autoParts/entry");

module.exports = {

  route: async (parsed, user) => {

    let state = stateRepo.get(user);

    // 🔹 FIRST TIME USER
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

    // 🔹 AUTO PARTS FLOW CONTINUATION
    if (state.flow === "autoParts") {
      return autoPartsEntry(user, parsed.text || "", state);
    }

    // 🔹 TRIGGER AUTO PARTS VIA AI INTENT
    if (parsed.intent === "autoParts") {
      state.flow = "autoParts";
      state.step = "category";

      stateRepo.set(user, state);

      return autoPartsEntry(user, "", state);
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
