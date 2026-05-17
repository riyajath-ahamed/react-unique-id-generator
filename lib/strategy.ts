import type { IdManager } from './core/id-manager';
import type { IdStrategy } from './core/types';

export const numericStrategy: IdStrategy = {
  generate(prefix, suffix, counter) {
    return `${prefix}${counter}${suffix}`;
  },
};

export const zeroPaddedStrategy = (width: number = 4): IdStrategy => ({
  generate(prefix, suffix, counter) {
    return `${prefix}${String(counter).padStart(width, '0')}${suffix}`;
  },
});

export const timestampStrategy: IdStrategy = {
  generate(prefix, suffix, counter) {
    return `${prefix}${Date.now()}-${counter}${suffix}`;
  },
};

export const hashStrategy: IdStrategy = {
  generate(prefix, suffix, counter) {
    let hash = counter;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = (hash >> 16) ^ hash;
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `${prefix}${hex}${suffix}`;
  },
};

export function generateIdWithStrategy(
  manager: IdManager,
  strategy: IdStrategy,
  prefix: string = '',
  suffix: string = '',
): string {
  const counter = manager.nextStrategyCounter();
  return strategy.generate(prefix, suffix, counter);
}

export type { IdStrategy } from './core/types';
