const synonymMap = {
  "control arm": ["wishbone", "lower arm", "suspension arm"],
  "brake pad": ["brake pads", "pads", "brake lining"],
  "air filter": ["filter", "air cleaner", "engine filter"],
  "oil filter": ["oil filter", "engine oil filter"],
  "fuel filter": ["fuel filter", "petrol filter"],
  "headlight": ["lamp", "front light"],
  "tail light": ["back light", "rear light"],
};

const normalizePart = (text = "") => {
  const t = text.toLowerCase();

  // 1. Direct match
  for (const mainPart in synonymMap) {
    if (t.includes(mainPart)) return mainPart;

    for (const synonym of synonymMap[mainPart]) {
      if (t.includes(synonym)) return mainPart;
    }
  }

  // 2. AI-style fallback (pattern-based)
  if (t.includes("arm")) return "control arm";
  if (t.includes("brake")) return "brake pad";
  if (t.includes("filter")) return "air filter";

  return null;
};

module.exports = {
  normalizePart
};
