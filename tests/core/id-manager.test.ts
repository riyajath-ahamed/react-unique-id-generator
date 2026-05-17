import { IdManager, createIdManager } from '../../lib/core/id-manager';

describe('IdManager', () => {
  let manager: IdManager;

  beforeEach(() => {
    manager = new IdManager();
  });

  describe('automation counter', () => {
    it('should start at 0', () => {
      expect(manager.getAutomationCounter()).toBe(0);
    });

    it('should increment on nextAutomationCounter', () => {
      expect(manager.nextAutomationCounter()).toBe(1);
      expect(manager.nextAutomationCounter()).toBe(2);
      expect(manager.nextAutomationCounter()).toBe(3);
    });

    it('should reset automation counter', () => {
      manager.nextAutomationCounter();
      manager.nextAutomationCounter();
      manager.resetAutomationCounter();
      expect(manager.getAutomationCounter()).toBe(0);
      expect(manager.nextAutomationCounter()).toBe(1);
    });

    it('should accept custom start value', () => {
      const m = new IdManager({ automationStart: 10 });
      expect(m.getAutomationCounter()).toBe(10);
      expect(m.nextAutomationCounter()).toBe(11);
    });
  });

  describe('strategy counter', () => {
    it('should start at 0', () => {
      expect(manager.getStrategyCounter()).toBe(0);
    });

    it('should increment on nextStrategyCounter', () => {
      expect(manager.nextStrategyCounter()).toBe(1);
      expect(manager.nextStrategyCounter()).toBe(2);
    });

    it('should reset strategy counter', () => {
      manager.nextStrategyCounter();
      manager.nextStrategyCounter();
      manager.resetStrategyCounter();
      expect(manager.getStrategyCounter()).toBe(0);
    });

    it('should accept custom start value', () => {
      const m = new IdManager({ strategyStart: 50 });
      expect(m.getStrategyCounter()).toBe(50);
      expect(m.nextStrategyCounter()).toBe(51);
    });
  });

  describe('counters are independent', () => {
    it('should not affect each other', () => {
      manager.nextAutomationCounter();
      manager.nextAutomationCounter();
      manager.nextStrategyCounter();
      expect(manager.getAutomationCounter()).toBe(2);
      expect(manager.getStrategyCounter()).toBe(1);
    });
  });

  describe('collision detector', () => {
    it('should lazily create collision detector', () => {
      const detector = manager.collisionDetector;
      expect(detector).toBeDefined();
      expect(detector.size).toBe(0);
    });

    it('should return the same detector on subsequent access', () => {
      const d1 = manager.collisionDetector;
      const d2 = manager.collisionDetector;
      expect(d1).toBe(d2);
    });

    it('should use provided collision options', () => {
      const m = new IdManager({ collision: { action: 'throw' } });
      const detector = m.collisionDetector;
      detector.register('test-id');
      expect(() => detector.register('test-id')).toThrow();
    });
  });

  describe('overflow warnings', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('should warn when automation counter exceeds threshold', () => {
      const m = new IdManager({ automationStart: 999_999 });
      m.nextAutomationCounter();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('automation counter has exceeded')
      );
    });

    it('should warn when strategy counter exceeds threshold', () => {
      const m = new IdManager({ strategyStart: 999_999 });
      m.nextStrategyCounter();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('strategy counter has exceeded')
      );
    });

    it('should not re-warn after reset for automation', () => {
      const m = new IdManager({ automationStart: 999_999 });
      m.nextAutomationCounter();
      expect(warnSpy).toHaveBeenCalledTimes(1);

      m.resetAutomationCounter();
      // Counter is at 0 after reset, so no overflow
      m.nextAutomationCounter();
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('should reset all counters', () => {
      manager.nextAutomationCounter();
      manager.nextAutomationCounter();
      manager.nextStrategyCounter();
      manager.reset();
      expect(manager.getAutomationCounter()).toBe(0);
      expect(manager.getStrategyCounter()).toBe(0);
    });

    it('should clear collision detector if initialized', () => {
      const detector = manager.collisionDetector;
      detector.register('id-1');
      detector.register('id-2');
      expect(detector.size).toBe(2);

      manager.reset();
      expect(detector.size).toBe(0);
    });

    it('should not fail if collision detector was never accessed', () => {
      manager.nextAutomationCounter();
      expect(() => manager.reset()).not.toThrow();
    });
  });
});

describe('createIdManager', () => {
  it('should return a new IdManager instance', () => {
    const m = createIdManager();
    expect(m).toBeInstanceOf(IdManager);
  });

  it('should pass options through', () => {
    const m = createIdManager({ automationStart: 5, strategyStart: 10 });
    expect(m.getAutomationCounter()).toBe(5);
    expect(m.getStrategyCounter()).toBe(10);
  });

  it('should create independent instances', () => {
    const m1 = createIdManager();
    const m2 = createIdManager();
    m1.nextAutomationCounter();
    m1.nextAutomationCounter();
    expect(m1.getAutomationCounter()).toBe(2);
    expect(m2.getAutomationCounter()).toBe(0);
  });
});
