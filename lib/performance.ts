import { useRef, useEffect, useSyncExternalStore } from 'react';
import nextId from './nextId';
import { useIdContext } from './context';

const activeIds = new Set<string>();
let totalGenerated = 0;
let peakActiveCount = 0;
let cachedSnapshot: IdMetrics = { totalGenerated: 0, activeCount: 0, peakActiveCount: 0 };

const listeners = new Set<() => void>();

function updateSnapshot(): void {
  cachedSnapshot = {
    totalGenerated,
    activeCount: activeIds.size,
    peakActiveCount,
  };
}

function notifyListeners(): void {
  updateSnapshot();
  listeners.forEach((listener) => listener());
}

function trackId(id: string): void {
  activeIds.add(id);
  totalGenerated++;
  if (activeIds.size > peakActiveCount) {
    peakActiveCount = activeIds.size;
  }
  notifyListeners();
}

function untrackId(id: string): void {
  activeIds.delete(id);
  notifyListeners();
}

export interface IdMetrics {
  totalGenerated: number;
  activeCount: number;
  peakActiveCount: number;
}

export function getIdMetrics(): IdMetrics {
  return cachedSnapshot;
}

export function resetIdMetrics(): void {
  totalGenerated = 0;
  peakActiveCount = activeIds.size;
  updateSnapshot();
  listeners.forEach((listener) => listener());
}

export function getActiveIdCount(): number {
  return activeIds.size;
}

export function useTrackedUniqueId(localPrefix?: string): string {
  const context = useIdContext();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    if (context) {
      idRef.current = context.nextId(localPrefix);
    } else {
      idRef.current = nextId(localPrefix);
    }
    trackId(idRef.current);
  }

  useEffect(() => {
    return () => {
      if (idRef.current) {
        untrackId(idRef.current);
      }
    };
  }, []);

  return idRef.current;
}

export function useTrackedUniqueIds(count: number, localPrefix?: string): string[] {
  const context = useIdContext();
  const idsRef = useRef<string[] | null>(null);

  if (idsRef.current === null) {
    if (context) {
      idsRef.current = Array.from({ length: count }, () => {
        const id = context.nextId(localPrefix);
        trackId(id);
        return id;
      });
    } else {
      idsRef.current = Array.from({ length: count }, () => {
        const id = nextId(localPrefix);
        trackId(id);
        return id;
      });
    }
  }

  useEffect(() => {
    return () => {
      if (idsRef.current) {
        idsRef.current.forEach(untrackId);
      }
    };
  }, []);

  return idsRef.current;
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => { listeners.delete(onStoreChange); };
}

function getSnapshot(): IdMetrics {
  return cachedSnapshot;
}

export function useIdMetrics(): IdMetrics {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function cleanupInactiveIds(): void {
  activeIds.clear();
  notifyListeners();
}
