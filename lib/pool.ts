import { useRef, useCallback } from 'react';
import nextId from './nextId';
import { useIdContext } from './context';

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

export interface IdPoolOptions {
  prefix?: string;
  suffix?: string;
  autoRefill?: boolean;
  generator?: (index: number) => string;
}

export class IdPool {
  private available: string[] = [];
  private released: string[] = [];
  private generated = 0;
  private readonly prefix: string;
  private readonly suffix: string;
  private readonly autoRefill: boolean;
  private readonly generator?: (index: number) => string;

  constructor(size: number, options: IdPoolOptions = {}) {
    this.prefix = options.prefix ?? '';
    this.suffix = options.suffix ?? '';
    this.autoRefill = options.autoRefill ?? true;
    this.generator = options.generator;
    this.fill(size);
  }

  private createId(): string {
    this.generated++;
    if (this.generator) {
      return this.generator(this.generated);
    }
    return `${this.prefix}${this.generated}${this.suffix}`;
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
    if (this.autoRefill) {
      return this.createId();
    }
    if (isDev) {
      console.warn(
        `[react-unique-id-generator] IdPool exhausted and autoRefill is disabled. ` +
        `Returning a newly generated ID.`
      );
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

  refill(count: number): void {
    this.fill(count);
  }

  get size(): number {
    return this.available.length + this.released.length;
  }

  get totalGenerated(): number {
    return this.generated;
  }
}

export function useIdPool(
  size: number,
  prefix?: string,
): () => string {
  const context = useIdContext();
  const poolRef = useRef<string[] | null>(null);
  const indexRef = useRef(0);

  if (poolRef.current === null) {
    if (context) {
      poolRef.current = Array.from({ length: size }, () => context.nextId(prefix));
    } else {
      poolRef.current = Array.from({ length: size }, () => nextId(prefix));
    }
  }

  const acquire = useCallback((): string => {
    const pool = poolRef.current!;
    if (indexRef.current < pool.length) {
      return pool[indexRef.current++];
    }
    if (context) {
      const newId = context.nextId(prefix);
      pool.push(newId);
      indexRef.current++;
      return newId;
    }
    const newId = nextId(prefix);
    pool.push(newId);
    indexRef.current++;
    return newId;
  }, [context, prefix]);

  return acquire;
}
