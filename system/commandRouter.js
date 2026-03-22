const sessionManager = require('./sessionManager');
const mainMenu = require('../flows/mainMenu/mainMenu.response');
const stepA = require('../flows/autoParts/stepA.request');
const stepAValidation = require('../flows/autoParts/stepA.validation');
const stepBHandler = require('../flows/autoParts/stepB.handler');
const agentEscalation = require('../integrations/agentEscalation');

exports.route = async ({ from, text }) => {

    let session = sessionManager.getSession(from);

    if (!session) {
        session = sessionManager.createSession(from);
        return mainMenu(from);
    }

    if (session.botPaused) return;

    // GLOBAL COMMANDS
    if (text === "*") {
        return agentEscalation(from);
    }

    if (text === "#") {
        sessionManager.resetSession(from);
        return mainMenu(from);
    }

    // MAIN MENU SELECTION
    if (session.currentStep === "MAIN_MENU") {
        if (text === "1") {
            sessionManager.updateSession(from, { currentStep: "AUTO_PARTS_STEP_A" });
            return stepA(from);
        }
        return mainMenu(from);
    }

    // AUTO PARTS FLOW
    if (session.currentStep === "AUTO_PARTS_STEP_A") {
        return stepAValidation(from, text);
    }

    if (session.currentStep === "AUTO_PARTS_STEP_B") {
        return stepBHandler(from, text);
    }
};
