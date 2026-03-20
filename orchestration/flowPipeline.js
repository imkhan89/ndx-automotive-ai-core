const flowRouter = require("../routers/flowRouter");

exports.execute = async (user, text) => {
  return flowRouter.route(user, text);
};
