import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapidly changing values (such as search inputs)
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
