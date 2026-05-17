export type CollisionAction = 'warn' | 'throw' | 'skip';

export interface CollisionDetectorOptions {
  action?: CollisionAction;
  maxSize?: number;
}

export interface IdStrategy {
  generate(prefix: string, suffix: string, counter: number): string;
}

export type AutomationIdStrategy = 'sequential' | 'kebab-case' | 'camelCase' | 'custom';

export interface AutomationIdOptions {
  strategy?: AutomationIdStrategy;
  prefix?: string;
  separator?: string;
  customFn?: (componentName: string, index: number) => string;
}

export interface SelectorOptions {
  root?: Element;
  dataAttributes?: string[];
  maxDepth?: number;
  ignoreIdPattern?: RegExp;
  ignoreClassPattern?: RegExp;
}

export interface IdManagerOptions {
  automationStart?: number;
  strategyStart?: number;
  collision?: CollisionDetectorOptions;
}
