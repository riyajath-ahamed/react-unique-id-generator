import { createContext, useContext, useRef, useMemo, type ReactNode, createElement } from 'react';

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const OVERFLOW_THRESHOLD = 1_000_000;

export interface SSRContextValue {
  nextId: (prefix?: string) => string;
  resetId: () => void;
  getCurrentId: () => number;
}

export interface SSRProviderProps {
  prefix?: string;
  suffix?: string;
  requestId?: string;
  children: ReactNode;
}

const SSRContext = createContext<SSRContextValue | null>(null);

export function useSSRContext(): SSRContextValue | null {
  return useContext(SSRContext);
}

export function SSRProvider({
  prefix = '',
  suffix = '',
  requestId,
  children,
}: SSRProviderProps) {
  const counterRef = useRef(0);
  const overflowWarnedRef = useRef(false);
  const configRef = useRef({ prefix, suffix, requestId });
  configRef.current = { prefix, suffix, requestId };

  const contextValue = useMemo<SSRContextValue>(() => ({
    nextId(localPrefix?: string): string {
      counterRef.current++;
      if (isDev && counterRef.current >= OVERFLOW_THRESHOLD && !overflowWarnedRef.current) {
        overflowWarnedRef.current = true;
        console.warn(
          `[react-unique-id-generator] SSRProvider counter has exceeded ${OVERFLOW_THRESHOLD}.`
        );
      }
      const p = localPrefix ?? configRef.current.prefix;
      const reqPart = configRef.current.requestId ? `${configRef.current.requestId}-` : '';
      return `${p}${reqPart}${counterRef.current}${configRef.current.suffix}`;
    },
    resetId(): void {
      counterRef.current = 0;
      overflowWarnedRef.current = false;
    },
    getCurrentId(): number {
      return counterRef.current;
    },
  }), []);

  return createElement(SSRContext.Provider, { value: contextValue }, children);
}

export function useSSRSafeId(prefix?: string): string {
  const ssrContext = useSSRContext();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    if (ssrContext) {
      idRef.current = ssrContext.nextId(prefix);
    } else if (isDev) {
      console.warn(
        `[react-unique-id-generator] useSSRSafeId() called without <SSRProvider>. ` +
        `Wrap your server render in <SSRProvider> for request-scoped IDs.`
      );
      idRef.current = `${prefix ?? ''}${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    } else {
      idRef.current = `${prefix ?? ''}${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
  }

  return idRef.current;
}

export function createSSRIdFactory(requestId: string, prefix: string = '', suffix: string = '') {
  let counter = 0;

  return {
    nextId(localPrefix?: string): string {
      counter++;
      const p = localPrefix ?? prefix;
      return `${p}${requestId}-${counter}${suffix}`;
    },
    resetId(): void {
      counter = 0;
    },
    getCurrentId(): number {
      return counter;
    },
  };
}

export { SSRContext };
