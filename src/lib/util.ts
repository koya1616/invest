export const formatNumber = (value: number) => {
  if (value >= 100000000) {
    return `${(Math.floor((value / 100000000) * 10) / 10).toFixed(1)}億`;
  }

  if (value >= 10000) {
    return `${(Math.floor((value / 10000) * 10) / 10).toFixed(1)}万`;
  }
  return value.toString();
};

export const generateRandomString = (): string => {
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 10);
    result += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(randomIndex);
  }
  return result;
};
