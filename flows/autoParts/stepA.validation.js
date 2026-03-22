const parser = require('../../ai/autoPartsParser');
const sessionManager = require('../../system/sessionManager');
const stepA = require('./stepA.request');
const stepB = require('./stepB.confirmation');

module.exports = async (from, text) => {

    const parsed = await parser(text);

    if (!parsed || !parsed.partName || !parsed.make || !parsed.model || !parsed.year) {
        return stepA(from);
    }

    sessionManager.updateSession(from, {
        currentStep: "AUTO_PARTS_STEP_B",
        data: parsed
    });

    return stepB(from, parsed);
};
