import type { IdManager } from './core/id-manager';
import type { AutomationIdOptions } from './core/types';
import { formatName } from './core/format';

export function generateAutomationId(
  manager: IdManager,
  componentName: string,
  options: AutomationIdOptions = {},
  reactId?: string,
): string {
  const {
    strategy = 'sequential',
    prefix = '',
    separator = '-',
    customFn,
  } = options;

  let counter: number;
  if (reactId) {
    const parsed = parseInt(reactId.replace(/\D/g, ''), 10);
    counter = Number.isNaN(parsed) ? manager.nextAutomationCounter() : parsed;
  } else {
    counter = manager.nextAutomationCounter();
  }

  if (strategy === 'custom') {
    if (!customFn) {
      throw new Error(
        '[react-unique-id-generator] customFn is required when using the "custom" automation strategy.'
      );
    }
    return customFn(componentName, counter);
  }

  const name = formatName(componentName, strategy);
  return `${prefix}${name}${separator}${counter}`;
}

export { AutomationIdPool } from './automation-pool';
export type { AutomationIdOptions, AutomationIdStrategy } from './core/types';
