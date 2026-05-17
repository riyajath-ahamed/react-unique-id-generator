import { useRef } from 'react';
import { useIdManager } from './context';
import { generateAutomationId } from '../automation';
import { IdManager } from '../core/id-manager';
import type { AutomationIdOptions } from '../core/types';

let _fallbackManager: IdManager | null = null;
function getFallbackManager(): IdManager {
  if (!_fallbackManager) {
    _fallbackManager = new IdManager();
  }
  return _fallbackManager;
}

export function useAutomationId(
  componentName: string,
  options?: AutomationIdOptions,
  reactId?: string,
): string {
  const manager = useIdManager();
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    const mgr = manager ?? getFallbackManager();
    idRef.current = generateAutomationId(mgr, componentName, options, reactId);
  }

  return idRef.current;
}

export function _resetFallbackManager(): void {
  _fallbackManager = null;
}
