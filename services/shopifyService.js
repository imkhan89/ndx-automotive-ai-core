exports.getProducts = async () => {

  return [
    { title: "Air Filter VIC", price: "1800", usdPrice: "8" },
    { title: "Air Filter OEM", price: "3200", usdPrice: "14" },
    { title: "Air Filter Premium", price: "4500", usdPrice: "20" },
    { title: "Extra Filter", price: "5000", usdPrice: "22" }
  ];
};

exports.createOrder = async (state) => {
  console.log("ORDER:", state);
  return true;
};
