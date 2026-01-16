import { useState, useEffect } from 'react';
import { getFlagsSnapshot, subscribeFlags } from '../features/flags';

/**
 * Reactive hook for CloudBees Feature Management string variant flags
 * Updates automatically when flag values change in FM dashboard
 *
 * @param key - The variant key to watch
 * @returns Current string value of the variant
 *
 * @example
 * const algorithm = useRoxVariant('searchAlgorithm');
 */
export default function useRoxVariant(key: string): string {
  const [val, setVal] = useState(() => String(getFlagsSnapshot()[key] || ''));

  useEffect(() => {
    return subscribeFlags((_reason, snap) => {
      const newVal = String(snap[key] || '');
      // Only update if the value actually changed to prevent unnecessary re-renders
      setVal((prevVal) => (prevVal !== newVal ? newVal : prevVal));
    });
  }, [key]);

  return val;
}
