import { useRef } from 'react';
import { useIdContext } from './context';

export interface IdStrategy {
  generate(prefix: string, suffix: string, counter: number): string;
}

let strategyCounter = 0;
let strategyOverflowWarned = false;
const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const OVERFLOW_THRESHOLD = 1_000_000;

function getNextCounter(): number {
  strategyCounter++;
  if (isDev && strategyCounter >= OVERFLOW_THRESHOLD && !strategyOverflowWarned) {
    strategyOverflowWarned = true;
    console.warn(
      `[react-unique-id-generator] Strategy counter has exceeded ${OVERFLOW_THRESHOLD}. ` +
      `This may indicate a memory leak or unintended usage pattern.`
    );
  }
  return strategyCounter;
}

export function resetStrategyCounter(): void {
  strategyCounter = 0;
  strategyOverflowWarned = false;
}

export function getStrategyCounter(): number {
  return strategyCounter;
}

export const numericStrategy: IdStrategy = {
  generate(prefix: string, suffix: string, counter: number): string {
    return `${prefix}${counter}${suffix}`;
  },
};

export const zeroPaddedStrategy = (width: number = 4): IdStrategy => ({
  generate(prefix: string, suffix: string, counter: number): string {
    return `${prefix}${String(counter).padStart(width, '0')}${suffix}`;
  },
});

export const timestampStrategy: IdStrategy = {
  generate(prefix: string, suffix: string, counter: number): string {
    return `${prefix}${Date.now()}-${counter}${suffix}`;
  },
};

export const hashStrategy: IdStrategy = {
  generate(prefix: string, suffix: string, counter: number): string {
    let hash = counter;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = (hash >> 16) ^ hash;
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `${prefix}${hex}${suffix}`;
  },
};

export function generateIdWithStrategy(
  strategy: IdStrategy,
  prefix: string = '',
  suffix: string = '',
): string {
  const counter = getNextCounter();
  return strategy.generate(prefix, suffix, counter);
}

export function useIdWithStrategy(
  strategy: IdStrategy,
  prefix: string = '',
  suffix: string = '',
): string {
  const context = useIdContext();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    if (context) {
      const rawId = context.nextId();
      const counter = parseInt(rawId.replace(/\D/g, ''), 10) || getNextCounter();
      idRef.current = strategy.generate(prefix || context.prefix, suffix || context.suffix, counter);
    } else {
      const counter = getNextCounter();
      idRef.current = strategy.generate(prefix, suffix, counter);
    }
  }

  return idRef.current;
}
