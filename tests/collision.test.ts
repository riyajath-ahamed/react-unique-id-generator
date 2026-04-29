import {
  CollisionDetector,
  getGlobalCollisionDetector,
  resetGlobalCollisionDetector,
  checkCollision,
} from '../lib/collision';

describe('CollisionDetector', () => {
  test('should register new IDs successfully', () => {
    const detector = new CollisionDetector();
    expect(detector.register('id-1')).toBe(true);
    expect(detector.register('id-2')).toBe(true);
    expect(detector.size).toBe(2);
  });

  test('should detect collisions and return false', () => {
    const detector = new CollisionDetector({ action: 'skip' });
    detector.register('id-1');
    expect(detector.register('id-1')).toBe(false);
  });

  test('should count collisions', () => {
    const detector = new CollisionDetector({ action: 'skip' });
    detector.register('id-1');
    detector.register('id-1');
    detector.register('id-1');
    expect(detector.collisions).toBe(2);
  });

  test('should throw on collision when action is throw', () => {
    const detector = new CollisionDetector({ action: 'throw' });
    detector.register('id-1');
    expect(() => detector.register('id-1')).toThrow('ID collision detected');
  });

  test('should warn on collision when action is warn', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const detector = new CollisionDetector({ action: 'warn' });
    detector.register('id-1');
    detector.register('id-1');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('ID collision detected: "id-1"')
    );
    warnSpy.mockRestore();
  });

  test('should check if ID exists with has()', () => {
    const detector = new CollisionDetector();
    detector.register('id-1');
    expect(detector.has('id-1')).toBe(true);
    expect(detector.has('id-2')).toBe(false);
  });

  test('should unregister IDs', () => {
    const detector = new CollisionDetector();
    detector.register('id-1');
    expect(detector.unregister('id-1')).toBe(true);
    expect(detector.has('id-1')).toBe(false);
    expect(detector.size).toBe(0);
  });

  test('should return false when unregistering non-existent ID', () => {
    const detector = new CollisionDetector();
    expect(detector.unregister('id-1')).toBe(false);
  });

  test('should clear all registrations', () => {
    const detector = new CollisionDetector({ action: 'skip' });
    detector.register('id-1');
    detector.register('id-2');
    detector.register('id-1');
    detector.clear();
    expect(detector.size).toBe(0);
    expect(detector.collisions).toBe(0);
  });

  test('should return registered IDs', () => {
    const detector = new CollisionDetector();
    detector.register('alpha');
    detector.register('beta');
    detector.register('gamma');
    expect(detector.getRegisteredIds()).toEqual(['alpha', 'beta', 'gamma']);
  });

  test('should warn when maxSize is reached', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const detector = new CollisionDetector({ maxSize: 3 });
    detector.register('id-1');
    detector.register('id-2');
    detector.register('id-3');
    detector.register('id-4');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('registry has reached maxSize')
    );
    warnSpy.mockRestore();
  });

  test('should allow re-registration after unregister', () => {
    const detector = new CollisionDetector({ action: 'throw' });
    detector.register('id-1');
    detector.unregister('id-1');
    expect(detector.register('id-1')).toBe(true);
  });
});

describe('Global collision detector', () => {
  beforeEach(() => {
    resetGlobalCollisionDetector();
  });

  test('should return a singleton instance', () => {
    const a = getGlobalCollisionDetector();
    const b = getGlobalCollisionDetector();
    expect(a).toBe(b);
  });

  test('should reset the global detector', () => {
    const detector = getGlobalCollisionDetector();
    detector.register('id-1');
    resetGlobalCollisionDetector();
    const newDetector = getGlobalCollisionDetector();
    expect(newDetector).not.toBe(detector);
    expect(newDetector.size).toBe(0);
  });
});

describe('checkCollision', () => {
  beforeEach(() => {
    resetGlobalCollisionDetector();
  });

  test('should register new IDs and return true', () => {
    expect(checkCollision('unique-1')).toBe(true);
    expect(checkCollision('unique-2')).toBe(true);
  });

  test('should detect collisions and return false', () => {
    checkCollision('dup-1', 'skip');
    expect(checkCollision('dup-1', 'skip')).toBe(false);
  });

  test('should throw when action is throw', () => {
    checkCollision('dup-1', 'throw');
    expect(() => checkCollision('dup-1', 'throw')).toThrow('ID collision detected');
  });
});
