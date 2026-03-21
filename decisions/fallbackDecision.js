module.exports = (products) => {

  if (!products || products.length === 0) {
    return {
      type: "no_results"
    };
  }

  return {
    type: "ok"
  };
};
