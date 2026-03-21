// utils/synonymMap.js

// 🔥 CORE SYNONYM DATABASE (Expandable)
const synonymMap = {
  // ===== FILTERS =====
  "filter": "air filter",
  "air filter": "air filter",
  "air cleaner": "air filter",

  "oil filter": "oil filter",
  "engine oil filter": "oil filter",
  "oil": "oil filter",

  "cabin filter": "cabin filter",
  "ac filter": "cabin filter",
  "aircon filter": "cabin filter",

  // ===== BRAKES =====
  "brake pad": "brake pads",
  "brake pads": "brake pads",
  "pads": "brake pads",

  "brake shoe": "brake shoes",
  "brake shoes": "brake shoes",

  "disc": "brake disc",
  "rotor": "brake disc",
  "brake disc": "brake disc",

  // ===== ENGINE =====
  "spark plug": "spark plug",
  "spark plugs": "spark plug",
  "plug": "spark plug",

  "radiator": "radiator",
  "coolant": "coolant",
  "radiator coolant": "coolant",

  // ===== SUSPENSION =====
  "wishbone": "control arm",
  "control arm": "control arm",
  "lower arm": "control arm",
  "upper arm": "control arm",

  "bush": "bushing",
  "bushing": "bushing",

  "shock": "shock absorber",
  "shocker": "shock absorber",
  "shock absorber": "shock absorber",

  // ===== BODY PARTS =====
  "bumper": "bumper",
  "front bumper": "front bumper",
  "rear bumper": "rear bumper",

  "fender": "fender",
  "wing": "fender",

  // ===== ELECTRICAL =====
  "horn": "car horn",
  "denso horn": "car horn",

  "battery": "car battery",

  // ===== GENERAL =====
  "mat": "floor mat",
  "floor mat": "floor mat",

  "sunshade": "sun shade",
  "sun shade": "sun shade",

  "wiper": "wiper blade",
  "wiper blade": "wiper blade"
};

// 🔥 POSITION MAPPING
const positionMap = {
  "front": "front",
  "rear": "rear",
  "back": "rear",

  "left": "left",
  "right": "right",

  "driver side": "left",
  "passenger side": "right",

  "upper": "upper",
  "lower": "lower",

  "inner": "inner",
  "outer": "outer"
};

// 🔥 CLEAN + NORMALIZE TEXT
const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
};

// 🔥 EXTRACT PART
const extractPart = (text) => {
  for (const key in synonymMap) {
    if (text.includes(key)) {
      return synonymMap[key];
    }
  }
  return null;
};

// 🔥 EXTRACT POSITION
const extractPosition = (text) => {
  const positions = [];

  for (const key in positionMap) {
    if (text.includes(key)) {
      positions.push(positionMap[key]);
    }
  }

  return positions;
};

// 🔥 MAIN FUNCTION
const parseSynonyms = (input = "") => {
  const text = normalizeText(input);

  const part = extractPart(text);
  const positions = extractPosition(text);

  return {
    raw: input,
    normalized: text,
    part,
    positions,
    intent: part ? "PART_SEARCH" : "GENERAL_QUERY"
  };
};

module.exports = {
  synonymMap,
  positionMap,
  parseSynonyms,
  normalizeText,
  extractPart,
  extractPosition
};
