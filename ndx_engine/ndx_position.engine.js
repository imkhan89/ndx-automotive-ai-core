export const ndxExtractPosition = (text) => {
  const t = text.toLowerCase();

  return {
    front_rear: t.includes("front") ? "front" : t.includes("rear") ? "rear" : null,
    left_right: t.includes("left") ? "left" : t.includes("right") ? "right" : null,
    upper_lower: t.includes("upper") ? "upper" : t.includes("lower") ? "lower" : null,
    inner_outer: t.includes("inner") ? "inner" : t.includes("outer") ? "outer" : null
  };
};
