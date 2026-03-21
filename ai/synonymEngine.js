module.exports = (text = "") => {

  const map = {
    "filter": "air filter",
    "air cleaner": "air filter",
    "oil": "oil filter",
    "engine oil filter": "oil filter",
    "brake pad": "brake parts",
    "brake shoes": "brake parts"
  };

  const lower = text.toLowerCase().trim();

  return map[lower] || text;
};
