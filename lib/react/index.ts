export { IdManagerProvider, useIdManager } from './context';
export type { IdManagerProviderProps } from './context';
export { useAutomationId } from './use-automation-id';
export { useStableSelector } from './use-stable-selector';
export { useIdWithStrategy } from './use-id-with-strategy';

export { IdManager, createIdManager } from '../core/id-manager';
export type {
  IdManagerOptions,
  IdStrategy,
  AutomationIdStrategy,
  AutomationIdOptions,
  CollisionAction,
  CollisionDetectorOptions,
  SelectorOptions,
} from '../core/types';
