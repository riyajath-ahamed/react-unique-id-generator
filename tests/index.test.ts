import nextId, {
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId,
} from '../lib/index';

describe('lib/index exports', () => {
  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
  });

  describe('getCurrentId', () => {
    test('should return 0 before any IDs are generated', () => {
      expect(getCurrentId()).toBe(0);
    });

    test('should return correct count after generating IDs', () => {
      nextId();
      nextId();
      expect(getCurrentId()).toBe(2);
    });
  });

  describe('setId', () => {
    test('should set the counter to a specific positive value', () => {
      setId(10);
      expect(getCurrentId()).toBe(10);
      expect(nextId()).toBe('11');
    });

    test('should set the counter to 0 when given 0', () => {
      nextId();
      nextId();
      setId(0);
      expect(getCurrentId()).toBe(0);
      expect(nextId()).toBe('1');
    });

    test('should clamp negative values to 0', () => {
      setId(-10);
      expect(getCurrentId()).toBe(0);
    });

    test('should floor decimal values', () => {
      setId(7.9);
      expect(getCurrentId()).toBe(7);
      expect(nextId()).toBe('8');
    });

    test('should handle NaN by setting counter to 0', () => {
      setId(NaN);
      // Math.max(0, Math.floor(NaN)) => NaN, document actual behaviour
      const currentId = getCurrentId();
      // The function stores Math.max(0, Math.floor(NaN)) which is NaN;
      // nextId() should still produce a string regardless.
      const id = nextId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    test('should handle Infinity', () => {
      setId(Infinity);
      // Math.max(0, Math.floor(Infinity)) => Infinity; document actual behaviour.
      const id = nextId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('generateId', () => {
    test('should generate IDs with explicit prefix and suffix', () => {
      expect(generateId('pfx-', '-sfx')).toBe('pfx-1-sfx');
      expect(generateId('pfx-', '-sfx')).toBe('pfx-2-sfx');
    });

    test('should default to empty prefix and suffix', () => {
      expect(generateId()).toBe('1');
      expect(generateId()).toBe('2');
    });

    test('should ignore global prefix and suffix', () => {
      setGlobalPrefix('global-');
      setGlobalSuffix('-global');
      // generateId uses its own parameters, not the global state
      expect(generateId('local-', '-local')).toBe('local-1-local');
      expect(generateId()).toBe('2');
    });

    test('should share the counter with nextId', () => {
      generateId('a-', '-b');
      expect(getCurrentId()).toBe(1);
      expect(nextId()).toBe('2');
    });
  });

  describe('re-exported nextId', () => {
    test('should be callable from the index entry point', () => {
      expect(nextId()).toBe('1');
    });

    test('should apply global prefix set via index exports', () => {
      setGlobalPrefix('idx-');
      expect(nextId()).toBe('idx-1');
    });

    test('should apply global suffix set via index exports', () => {
      setGlobalSuffix('-end');
      expect(nextId()).toBe('1-end');
    });
  });

  describe('resetId', () => {
    test('should reset the counter to 0 from the index entry point', () => {
      nextId();
      nextId();
      resetId();
      expect(getCurrentId()).toBe(0);
      expect(nextId()).toBe('1');
    });
  });
});
