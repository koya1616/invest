export const formatNumber = (value: number) => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}億`;
  }
  return `${(value / 10000).toFixed(1)}万`;
};
