import { useState, useEffect, useRef } from 'react';
import { generateSelector } from '../selector';
import type { SelectorOptions } from '../core/types';

type RefObject<T> = { readonly current: T | null };

export function useStableSelector(
  ref: RefObject<Element | null>,
  options: SelectorOptions = {},
): string | null {
  const [selector, setSelector] = useState<string | null>(null);
  const computedRef = useRef(false);

  useEffect(() => {
    if (ref.current && !computedRef.current) {
      computedRef.current = true;
      setSelector(generateSelector(ref.current, options));
    }
  });

  return selector;
}
