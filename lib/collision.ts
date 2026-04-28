const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

export type CollisionAction = 'warn' | 'throw' | 'skip';

export interface CollisionDetectorOptions {
  action?: CollisionAction;
  maxSize?: number;
}

export class CollisionDetector {
  private registry = new Set<string>();
  private readonly action: CollisionAction;
  private readonly maxSize: number;
  private collisionCount = 0;

  constructor(options: CollisionDetectorOptions = {}) {
    this.action = options.action ?? 'warn';
    this.maxSize = options.maxSize ?? 100_000;
  }

  register(id: string): boolean {
    if (this.registry.has(id)) {
      this.collisionCount++;
      const message =
        `[react-unique-id-generator] ID collision detected: "${id}" has already been registered.`;

      if (this.action === 'throw') {
        throw new Error(message);
      }
      if (this.action === 'warn' && isDev) {
        console.warn(message);
      }
      return false;
    }

    if (this.registry.size >= this.maxSize) {
      if (isDev) {
        console.warn(
          `[react-unique-id-generator] CollisionDetector registry has reached maxSize (${this.maxSize}). ` +
          `Oldest entries are not evicted. Consider calling clear() or increasing maxSize.`
        );
      }
    }

    this.registry.add(id);
    return true;
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  unregister(id: string): boolean {
    return this.registry.delete(id);
  }

  clear(): void {
    this.registry.clear();
    this.collisionCount = 0;
  }

  get size(): number {
    return this.registry.size;
  }

  get collisions(): number {
    return this.collisionCount;
  }

  getRegisteredIds(): string[] {
    return Array.from(this.registry);
  }
}

let globalDetector: CollisionDetector | null = null;

export function getGlobalCollisionDetector(options?: CollisionDetectorOptions): CollisionDetector {
  if (!globalDetector) {
    globalDetector = new CollisionDetector(options);
  }
  return globalDetector;
}

export function resetGlobalCollisionDetector(): void {
  if (globalDetector) {
    globalDetector.clear();
  }
  globalDetector = null;
}

export function checkCollision(id: string, action: CollisionAction = 'warn'): boolean {
  const detector = getGlobalCollisionDetector({ action });
  return detector.register(id);
}
