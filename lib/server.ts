export interface ServerIdManagerOptions {
  prefix?: string;
  suffix?: string;
  startId?: number;
}

export interface ServerIdManager {
  nextId: (localPrefix?: string | null) => string;
  resetId: () => void;
  getCurrentId: () => number;
  setId: (id: number) => void;
}

export function createServerIdManager(
  options: ServerIdManagerOptions = {}
): ServerIdManager {
  const { prefix = '', suffix = '', startId = 0 } = options;
  let lastId = startId;

  return {
    nextId(localPrefix?: string | null): string {
      lastId++;
      const p = localPrefix !== null && localPrefix !== undefined
        ? localPrefix
        : prefix;
      return `${p}${lastId}${suffix}`;
    },

    resetId(): void {
      lastId = 0;
    },

    getCurrentId(): number {
      return lastId;
    },

    setId(id: number): void {
      lastId = Math.max(0, Math.floor(id));
    },
  };
}
