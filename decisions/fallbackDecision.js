module.exports = (products) => {

  if (!products || products.length === 0) {
    return {
      type: "no_results",
      message: "No products found. Try another option or type support."
    };
  }

  return {
    type: "ok"
  };
};
