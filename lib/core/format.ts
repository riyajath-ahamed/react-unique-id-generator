import type { AutomationIdStrategy } from './types';

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export function formatName(name: string, strategy: AutomationIdStrategy): string {
  switch (strategy) {
    case 'kebab-case':
      return toKebabCase(name);
    case 'camelCase':
      return toCamelCase(name);
    default:
      return name;
  }
}
