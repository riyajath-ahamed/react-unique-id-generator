const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const OVERFLOW_THRESHOLD = 1_000_000;

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
  let overflowWarned = false;

  return {
    nextId(localPrefix?: string | null): string {
      lastId++;
      if (isDev && lastId >= OVERFLOW_THRESHOLD && !overflowWarned) {
        overflowWarned = true;
        console.warn(
          `[react-unique-id-generator] Server ID manager counter has exceeded ${OVERFLOW_THRESHOLD}. ` +
          `This may indicate a memory leak or unintended usage pattern.`
        );
      }
      const p = localPrefix !== null && localPrefix !== undefined
        ? localPrefix
        : prefix;
      return `${p}${lastId}${suffix}`;
    },

    resetId(): void {
      lastId = 0;
      overflowWarned = false;
    },

    getCurrentId(): number {
      return lastId;
    },

    setId(id: number): void {
      lastId = Math.max(0, Math.floor(id));
    },
  };
}
