import { useRef } from 'react';
import { useIdContext } from './context';

let delimiterCounter = 0;
let delimiterOverflowWarned = false;
const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const OVERFLOW_THRESHOLD = 1_000_000;

function getNextCounter(): number {
  delimiterCounter++;
  if (isDev && delimiterCounter >= OVERFLOW_THRESHOLD && !delimiterOverflowWarned) {
    delimiterOverflowWarned = true;
    console.warn(
      `[react-unique-id-generator] Delimiter counter has exceeded ${OVERFLOW_THRESHOLD}. ` +
      `This may indicate a memory leak or unintended usage pattern.`
    );
  }
  return delimiterCounter;
}

export function resetDelimiterCounter(): void {
  delimiterCounter = 0;
  delimiterOverflowWarned = false;
}

export function getDelimiterCounter(): number {
  return delimiterCounter;
}

export interface DelimitedIdOptions {
  prefix?: string;
  suffix?: string;
  delimiter?: string;
}

export function generateDelimitedId(options: DelimitedIdOptions = {}): string {
  const { prefix = '', suffix = '', delimiter = '-' } = options;
  const counter = getNextCounter();

  const parts: string[] = [];
  if (prefix) parts.push(prefix);
  parts.push(String(counter));
  if (suffix) parts.push(suffix);

  return parts.join(delimiter);
}

export function useDelimitedId(
  prefix: string = '',
  delimiter: string = '-',
  suffix: string = '',
): string {
  const context = useIdContext();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    if (context) {
      const rawId = context.nextId();
      const counter = parseInt(rawId.replace(/\D/g, ''), 10) || getNextCounter();
      const parts: string[] = [];
      if (prefix || context.prefix) parts.push(prefix || context.prefix);
      parts.push(String(counter));
      if (suffix || context.suffix) parts.push(suffix || context.suffix);
      idRef.current = parts.join(delimiter);
    } else {
      const counter = getNextCounter();
      const parts: string[] = [];
      if (prefix) parts.push(prefix);
      parts.push(String(counter));
      if (suffix) parts.push(suffix);
      idRef.current = parts.join(delimiter);
    }
  }

  return idRef.current;
}
