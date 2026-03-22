const sessionManager = require('../../system/sessionManager');
const stepA = require('./stepA.request');
const stepC = require('./stepC.results');

module.exports = async (from, text) => {

    if (text === "1") {
        return stepC(from);
    }

    if (text === "2") {
        sessionManager.updateSession(from, {
            currentStep: "AUTO_PARTS_STEP_A",
            data: {}
        });
        return stepA(from);
    }
};
