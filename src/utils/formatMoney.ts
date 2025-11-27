/**
 * Formats a number or string containing numbers with thousand separators
 * @param value - The value to format (can be a number or string)
 * @returns Formatted string with thousand separators
 * 
 * @example
 * formatMoney(10000) // "10,000"
 * formatMoney("10000") // "10,000"
 * formatMoney("AED 10000") // "AED 10,000"
 * formatMoney("10000 - 20000") // "10,000 - 20,000"
 */
export function formatMoney(value: string | number): string {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US');
  }

  if (typeof value !== 'string' || !value) {
    return value;
  }

  // Extract all numbers from the string
  const numbers = value.match(/\d+/g);
  
  if (!numbers) {
    return value;
  }

  // Format each number with thousand separators
  let formatted = value;
  numbers.forEach((num) => {
    const formattedNum = parseInt(num, 10).toLocaleString('en-US');
    formatted = formatted.replace(num, formattedNum);
  });

  return formatted;
}

