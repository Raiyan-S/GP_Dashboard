export const formatPercentage = (value: number): string => {
  return value.toFixed(2) + '%';
};

export const formatDecimal = (value: number, decimals: number = 4): string => {
  return value.toFixed(decimals);
};

export const formatTimestamp = (index: number): string => {
  return `2024-03-${String(index + 1).padStart(2, '0')} 14:30:00`;
};