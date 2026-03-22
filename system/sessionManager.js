const sessions = {};
const SESSION_TIMEOUT = 30 * 60 * 1000;

exports.getSession = (userId) => {
    const session = sessions[userId];

    if (!session) return null;

    const now = Date.now();
    if (now - session.lastActivity > SESSION_TIMEOUT) {
        delete sessions[userId];
        return null;
    }

    return session;
};

exports.createSession = (userId) => {
    sessions[userId] = {
        currentStep: "MAIN_MENU",
        data: {},
        lastActivity: Date.now(),
        botPaused: false
    };
    return sessions[userId];
};

exports.updateSession = (userId, updates) => {
    if (!sessions[userId]) return;

    sessions[userId] = {
        ...sessions[userId],
        ...updates,
        lastActivity: Date.now()
    };
};

exports.resetSession = (userId) => {
    delete sessions[userId];
};
