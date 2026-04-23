import { createContext, useContext, useRef, useMemo, type ReactNode } from 'react';

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const OVERFLOW_THRESHOLD = 1_000_000;

export interface IdContextValue {
  nextId: (localPrefix?: string | null) => string;
  prefix: string;
  suffix: string;
}

export interface IdProviderProps {
  prefix?: string;
  suffix?: string;
  startId?: number;
  children: ReactNode;
}

const IdContext = createContext<IdContextValue | null>(null);

export function IdProvider({
  prefix = '',
  suffix = '',
  startId = 0,
  children,
}: IdProviderProps) {
  const counterRef = useRef(startId);
  const overflowWarnedRef = useRef(false);
  const configRef = useRef({ prefix, suffix });
  configRef.current = { prefix, suffix };

  const contextValue = useMemo<IdContextValue>(() => ({
    nextId: (localPrefix?: string | null): string => {
      counterRef.current++;
      if (isDev && counterRef.current >= OVERFLOW_THRESHOLD && !overflowWarnedRef.current) {
        overflowWarnedRef.current = true;
        console.warn(
          `[react-unique-id-generator] IdProvider counter has exceeded ${OVERFLOW_THRESHOLD}. ` +
          `This may indicate a memory leak or unintended usage pattern.`
        );
      }
      const p = localPrefix !== null && localPrefix !== undefined
        ? localPrefix
        : configRef.current.prefix;
      return `${p}${counterRef.current}${configRef.current.suffix}`;
    },
    prefix,
    suffix,
  }), [prefix, suffix]);

  return <IdContext.Provider value={contextValue}>{children}</IdContext.Provider>;
}

export function useIdContext(): IdContextValue | null {
  return useContext(IdContext);
}

export { IdContext };
