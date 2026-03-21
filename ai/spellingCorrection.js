module.exports = (text = "") => {

  const corrections = {
    "flter": "filter",
    "airflter": "air filter",
    "brak": "brake",
    "brakepad": "brake pad",
    "ol filter": "oil filter"
  };

  const lower = text.toLowerCase().trim();

  return corrections[lower] || text;
};
