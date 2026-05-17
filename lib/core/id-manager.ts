import { checkOverflow } from './overflow';
import type { CollisionDetectorOptions, IdManagerOptions } from './types';
import { CollisionDetector } from '../collision';

export class IdManager {
  private _automationCounter: number;
  private _strategyCounter: number;
  private _collisionDetector: CollisionDetector | null;
  private _collisionOptions: CollisionDetectorOptions;
  private _overflowWarned: Record<string, boolean> = {};

  constructor(options: IdManagerOptions = {}) {
    this._automationCounter = options.automationStart ?? 0;
    this._strategyCounter = options.strategyStart ?? 0;
    this._collisionOptions = options.collision ?? {};
    this._collisionDetector = null;
  }

  nextAutomationCounter(): number {
    this._automationCounter++;
    checkOverflow(this._automationCounter, 'automation', this._overflowWarned);
    return this._automationCounter;
  }

  getAutomationCounter(): number {
    return this._automationCounter;
  }

  resetAutomationCounter(): void {
    this._automationCounter = 0;
    this._overflowWarned.automation = false;
  }

  nextStrategyCounter(): number {
    this._strategyCounter++;
    checkOverflow(this._strategyCounter, 'strategy', this._overflowWarned);
    return this._strategyCounter;
  }

  getStrategyCounter(): number {
    return this._strategyCounter;
  }

  resetStrategyCounter(): void {
    this._strategyCounter = 0;
    this._overflowWarned.strategy = false;
  }

  get collisionDetector(): CollisionDetector {
    if (!this._collisionDetector) {
      this._collisionDetector = new CollisionDetector(this._collisionOptions);
    }
    return this._collisionDetector;
  }

  reset(): void {
    this.resetAutomationCounter();
    this.resetStrategyCounter();
    if (this._collisionDetector) {
      this._collisionDetector.clear();
    }
  }
}

export function createIdManager(options?: IdManagerOptions): IdManager {
  return new IdManager(options);
}
