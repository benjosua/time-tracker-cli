export function cleanUnits(duration) {
  return Object.keys(duration).reduce((result, key) => {
    const value = duration[key];
    return value ? { ...result, [key]: value } : result;
  }, {});
}