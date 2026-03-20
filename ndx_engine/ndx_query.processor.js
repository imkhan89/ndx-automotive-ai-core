import { ndxExtractPosition } from "./ndx_position.engine.js";
import { ndxNormalizePart } from "./ndx_synonym.engine.js";

export const ndxQueryProcessor = (data) => {
  const rawText = data.raw || "";

  const part = ndxNormalizePart(rawText);
  const position = ndxExtractPosition(rawText);

  return {
    vehicle: {
      make: data.make,
      model: data.model,
      year: data.year
    },
    part,
    position
  };
};
