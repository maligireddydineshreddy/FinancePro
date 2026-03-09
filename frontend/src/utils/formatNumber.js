// Utility function to format numbers with Indian style commas (1,00,000)
export const formatNumberWithCommas = (value) => {
  if (!value && value !== 0) return '';
  
  // Remove existing commas and non-numeric characters except decimal point
  const numericValue = String(value).replace(/[^\d.]/g, '');
  
  // Split by decimal point if exists
  const parts = numericValue.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Indian numbering system: first 3 digits from right, then groups of 2
  // Example: 1234567 -> 12,34,567
  if (integerPart.length > 3) {
    const lastThree = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);
    // Add commas every 2 digits from the left for remaining part
    const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = formattedRemaining + ',' + lastThree;
  } else if (integerPart.length === 0) {
    integerPart = '0';
  }
  
  // Combine with decimal part if exists
  return decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
};

// Utility function to remove commas from formatted number
export const removeCommas = (value) => {
  if (!value) return '';
  return String(value).replace(/,/g, '');
};

// Format number for display (with commas and currency symbol)
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '₹0';
  const numValue = typeof value === 'string' ? parseFloat(removeCommas(value)) : value;
  if (isNaN(numValue)) return '₹0';
  return `₹${formatNumberWithCommas(numValue.toFixed(2))}`;
};

// Convert large numbers to words (crores, lakhs)
export const formatNumberToWords = (value) => {
  if (!value && value !== 0) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(removeCommas(value)) : value;
  if (isNaN(numValue)) return '0';
  
  // Round to nearest value for better readability
  const absValue = Math.abs(numValue);
  
  // For very large numbers (>= 1 crore)
  if (absValue >= 10000000) {
    const crores = absValue / 10000000;
    // Round to 2 decimal places for crores
    const roundedCrores = Math.round(crores * 100) / 100;
    return `${formatNumberWithCommas(roundedCrores)} crores`;
  }
  
  // For lakhs (>= 1 lakh, < 1 crore)
  if (absValue >= 100000) {
    const lakhs = absValue / 100000;
    // Round to 2 decimal places for lakhs
    const roundedLakhs = Math.round(lakhs * 100) / 100;
    return `${formatNumberWithCommas(roundedLakhs)} lakhs`;
  }
  
  // For thousands (>= 1000, < 1 lakh)
  if (absValue >= 1000) {
    const thousands = absValue / 1000;
    // Round to 2 decimal places for thousands
    const roundedThousands = Math.round(thousands * 100) / 100;
    return `${formatNumberWithCommas(roundedThousands)}K`;
  }
  
  // For numbers less than 1000, return formatted with commas
  return formatNumberWithCommas(Math.round(numValue));
};
