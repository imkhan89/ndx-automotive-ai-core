export const ndxFuzzyMatch = (input, list) => {
  return list.find(item =>
    input.toLowerCase().includes(item.toLowerCase())
  );
};
