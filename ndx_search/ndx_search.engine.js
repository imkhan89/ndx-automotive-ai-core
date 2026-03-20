import { NDX_PARTS } from "../ndx_data/ndx_parts.data.js";

export const ndxSearchPart = (partName) => {
  return NDX_PARTS.find(p => 
    p.name.toLowerCase() === partName
  );
};
