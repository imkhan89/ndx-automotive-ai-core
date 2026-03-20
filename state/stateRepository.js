const store = {};

exports.get = (user) => store[user];

exports.set = (user, state) => {
  store[user] = state;
};
