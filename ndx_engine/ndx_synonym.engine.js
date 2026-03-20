import { NDX_SYNONYMS } from "../ndx_data/ndx_synonyms.data.js";

export const ndxNormalizePart = (text) => {
  const t = text.toLowerCase();

  for (const key in NDX_SYNONYMS) {
    if (t.includes(key)) return key;

    for (const synonym of NDX_SYNONYMS[key]) {
      if (t.includes(synonym)) return key;
    }
  }

  return null;
};
