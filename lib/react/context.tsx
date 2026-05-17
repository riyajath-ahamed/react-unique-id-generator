import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { IdManager } from '../core/id-manager';
import type { IdManagerOptions } from '../core/types';

export interface IdManagerProviderProps {
  manager?: IdManager;
  options?: IdManagerOptions;
  children: ReactNode;
}

const IdManagerContext = createContext<IdManager | null>(null);

export function IdManagerProvider({
  manager,
  options,
  children,
}: IdManagerProviderProps) {
  const value = useMemo(
    () => manager ?? new IdManager(options),
    [manager],
  );

  return <IdManagerContext.Provider value={value}>{children}</IdManagerContext.Provider>;
}

export function useIdManager(): IdManager | null {
  return useContext(IdManagerContext);
}

export { IdManagerContext };
