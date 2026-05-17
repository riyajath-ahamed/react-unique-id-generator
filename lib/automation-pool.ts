import type { AutomationIdOptions, AutomationIdStrategy } from './core/types';
import { formatName } from './core/format';

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
    if (this.released.length > 0) return this.released.pop()!;
    if (this.available.length > 0) return this.available.shift()!;
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
