export const truncate = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '...';
};
