import { useRef } from 'react';

export type AutomationIdStrategy = 'sequential' | 'kebab-case' | 'camelCase' | 'custom';

export interface AutomationIdOptions {
  strategy?: AutomationIdStrategy;
  prefix?: string;
  separator?: string;
  customFn?: (componentName: string, index: number) => string;
}

let automationCounter = 0;

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function formatName(name: string, strategy: AutomationIdStrategy): string {
  switch (strategy) {
    case 'kebab-case':
      return toKebabCase(name);
    case 'camelCase':
      return toCamelCase(name);
    default:
      return name;
  }
}

export function generateAutomationId(
  componentName: string,
  options: AutomationIdOptions = {}
): string {
  const {
    strategy = 'sequential',
    prefix = '',
    separator = '-',
    customFn,
  } = options;

  automationCounter++;

  if (strategy === 'custom') {
    if (!customFn) {
      throw new Error(
        '[react-unique-id-generator] customFn is required when using the "custom" automation strategy.'
      );
    }
    return customFn(componentName, automationCounter);
  }

  const name = formatName(componentName, strategy);
  return `${prefix}${name}${separator}${automationCounter}`;
}

export function resetAutomationCounter(): void {
  automationCounter = 0;
}

export function useAutomationId(
  componentName: string,
  options?: AutomationIdOptions
): string {
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    idRef.current = generateAutomationId(componentName, options);
  }

  return idRef.current;
}

export class AutomationIdPool {
  private available: string[] = [];
  private released: string[] = [];
  private counter = 0;
  private readonly componentName: string;
  private readonly strategy: AutomationIdStrategy;
  private readonly prefix: string;
  private readonly separator: string;

  constructor(
    poolSize: number,
    componentName: string = 'auto',
    options: Omit<AutomationIdOptions, 'customFn'> = {}
  ) {
    this.componentName = componentName;
    this.strategy = options.strategy ?? 'sequential';
    this.prefix = options.prefix ?? '';
    this.separator = options.separator ?? '-';
    this.fill(poolSize);
  }

  private createId(): string {
    this.counter++;
    const name = formatName(this.componentName, this.strategy);
    return `${this.prefix}${name}${this.separator}${this.counter}`;
  }

  private fill(count: number): void {
    for (let i = 0; i < count; i++) {
      this.available.push(this.createId());
    }
  }

  acquire(): string {
    if (this.released.length > 0) {
      return this.released.pop()!;
    }
    if (this.available.length > 0) {
      return this.available.shift()!;
    }
    return this.createId();
  }

  release(id: string): void {
    this.released.push(id);
  }

  drain(): void {
    this.available = [];
    this.released = [];
  }

  get size(): number {
    return this.available.length + this.released.length;
  }
}
