export const formatPercentage = (value) => {
  return value.toFixed(2) + '%';
};

export const formatDecimal = (value, decimals = 4) => {
  return value.toFixed(decimals);
};

export const formatTimestamp = (index) => {
  return `2024-03-${String(index + 1).padStart(2, '0')} 14:30:00`;
};