// ✅ Internal synonym map (NO external dependency)
const synonymMap = {
  "filter": "air filter",
  "air cleaner": "air filter",
  "oil": "oil filter",
  "engine oil filter": "oil filter",

  "brake pad": "brake pads",
  "brake pads": "brake pads",
  "pads": "brake pads",

  "disc": "brake disc",
  "rotor": "brake disc",

  "plug": "spark plug",
  "spark plugs": "spark plug",

  "wishbone": "control arm",
  "lower arm": "control arm",
  "upper arm": "control arm"
};

// ✅ Intent Mapper Function
const mapIntent = (text = "") => {
  const input = text.toLowerCase();

  let detectedPart = null;

  for (const key in synonymMap) {
    if (input.includes(key)) {
      detectedPart = synonymMap[key];
      break;
    }
  }

  return {
    original: text,
    normalized: detectedPart || text,
    intent: detectedPart ? "PART_SEARCH" : "GENERAL_QUERY"
  };
};

module.exports = {
  mapIntent
};
