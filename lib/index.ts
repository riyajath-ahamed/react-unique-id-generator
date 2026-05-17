export { IdManager, createIdManager } from './core/id-manager';
export { OVERFLOW_THRESHOLD } from './core/overflow';
export type {
  IdManagerOptions,
  IdStrategy,
  AutomationIdStrategy,
  AutomationIdOptions,
  CollisionAction,
  CollisionDetectorOptions,
  SelectorOptions,
} from './core/types';

export { generateAutomationId } from './automation';
export { AutomationIdPool } from './automation-pool';
export { generateSelector } from './selector';
export {
  CollisionDetector,
  getGlobalCollisionDetector,
  resetGlobalCollisionDetector,
  checkCollision,
} from './collision';
export {
  numericStrategy,
  zeroPaddedStrategy,
  timestampStrategy,
  hashStrategy,
  generateIdWithStrategy,
} from './strategy';

export { IdManagerProvider, useIdManager } from './react/context';
export type { IdManagerProviderProps } from './react/context';
export { useAutomationId } from './react/use-automation-id';
export { useStableSelector } from './react/use-stable-selector';
export { useIdWithStrategy } from './react/use-id-with-strategy';
