import { createContext, useContext, useRef, useMemo, type ReactNode } from 'react';

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
  const configRef = useRef({ prefix, suffix });
  configRef.current = { prefix, suffix };

  const contextValue = useMemo<IdContextValue>(() => ({
    nextId: (localPrefix?: string | null): string => {
      counterRef.current++;
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
