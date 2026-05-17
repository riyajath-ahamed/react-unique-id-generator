import { useRef } from 'react';
import { useIdManager } from './context';
import { generateIdWithStrategy } from '../strategy';
import { IdManager } from '../core/id-manager';
import type { IdStrategy } from '../core/types';

let _fallbackManager: IdManager | null = null;
function getFallbackManager(): IdManager {
  if (!_fallbackManager) _fallbackManager = new IdManager();
  return _fallbackManager;
}

export function useIdWithStrategy(
  strategy: IdStrategy,
  prefix?: string,
  suffix?: string,
  reactId?: string,
): string {
  const manager = useIdManager();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    const mgr = manager ?? getFallbackManager();

    if (reactId) {
      const parsed = parseInt(reactId.replace(/\D/g, ''), 10);
      const counter = Number.isNaN(parsed) ? mgr.nextStrategyCounter() : parsed;
      idRef.current = strategy.generate(prefix ?? '', suffix ?? '', counter);
    } else {
      idRef.current = generateIdWithStrategy(mgr, strategy, prefix, suffix);
    }
  }

  return idRef.current;
}

export function _resetFallbackManager(): void {
  _fallbackManager = null;
}
