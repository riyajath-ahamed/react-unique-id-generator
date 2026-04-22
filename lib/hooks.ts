import { useRef } from 'react';
import nextId from './nextId';
import { useIdContext } from './context';

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const warnedNoProvider = { current: false };

function warnMissingProvider(hookName: string): void {
  if (isDev && !warnedNoProvider.current) {
    warnedNoProvider.current = true;
    console.warn(
      `[react-unique-id-generator] ${hookName}() called without an <IdProvider>. ` +
      `Falling back to global state (deprecated). Wrap your app in <IdProvider> for SSR safety.`
    );
  }
}

export function useUniqueId(localPrefix?: string): string {
  const context = useIdContext();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    if (context) {
      idRef.current = context.nextId(localPrefix);
    } else {
      warnMissingProvider('useUniqueId');
      idRef.current = nextId(localPrefix);
    }
  }

  return idRef.current;
}

export function useUniqueIds(count: number, localPrefix?: string): string[] {
  const context = useIdContext();
  const idsRef = useRef<string[] | null>(null);

  if (idsRef.current === null) {
    if (context) {
      idsRef.current = Array.from({ length: count }, () => context.nextId(localPrefix));
    } else {
      warnMissingProvider('useUniqueIds');
      idsRef.current = Array.from({ length: count }, () => nextId(localPrefix));
    }
  }

  return idsRef.current;
}
