import nextId, { 
  resetId, 
  setGlobalPrefix, 
  setGlobalSuffix, 
  getCurrentId, 
  setId, 
  generateId 
} from '../lib/nextId';

describe('nextId', () => {
  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
  });

  describe('Basic functionality', () => {
    test('should generate sequential IDs starting from 1', () => {
      expect(nextId()).toBe('1');
      expect(nextId()).toBe('2');
      expect(nextId()).toBe('3');
    });

    test('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        const id = nextId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });

    test('should handle empty prefix and suffix', () => {
      expect(nextId()).toBe('1');
      expect(nextId()).toBe('2');
    });
  });

  describe('Local prefix functionality', () => {
    test('should use local prefix when provided', () => {
      expect(nextId('local-')).toBe('local-1');
      expect(nextId('local-')).toBe('local-2');
    });

    test('should handle null prefix', () => {
      expect(nextId(null)).toBe('1');
      expect(nextId(null)).toBe('2');
    });

    test('should handle undefined prefix', () => {
      expect(nextId(undefined)).toBe('1');
      expect(nextId(undefined)).toBe('2');
    });

    test('should handle empty string prefix', () => {
      expect(nextId('')).toBe('1');
      expect(nextId('')).toBe('2');
    });
  });

  describe('Global prefix functionality', () => {
    test('should use global prefix when no local prefix provided', () => {
      setGlobalPrefix('global-');
      expect(nextId()).toBe('global-1');
      expect(nextId()).toBe('global-2');
    });

    test('should override global prefix with local prefix', () => {
      setGlobalPrefix('global-');
      expect(nextId('local-')).toBe('local-1');
      expect(nextId()).toBe('global-2');
    });

    test('should handle empty global prefix', () => {
      setGlobalPrefix('');
      expect(nextId()).toBe('1');
    });

    test('should handle null global prefix', () => {
      setGlobalPrefix(null as any);
      expect(nextId()).toBe('1');
    });
  });

  describe('Global suffix functionality', () => {
    test('should append global suffix to all IDs', () => {
      setGlobalSuffix('-suffix');
      expect(nextId()).toBe('1-suffix');
      expect(nextId()).toBe('2-suffix');
    });

    test('should append global suffix to local prefix IDs', () => {
      setGlobalSuffix('-suffix');
      expect(nextId('local-')).toBe('local-1-suffix');
      expect(nextId('local-')).toBe('local-2-suffix');
    });

    test('should handle empty global suffix', () => {
      setGlobalSuffix('');
      expect(nextId()).toBe('1');
    });

    test('should handle null global suffix', () => {
      setGlobalSuffix(null as any);
      expect(nextId()).toBe('1');
    });
  });

  describe('Combined prefix and suffix', () => {
    test('should combine global prefix and suffix', () => {
      setGlobalPrefix('prefix-');
      setGlobalSuffix('-suffix');
      expect(nextId()).toBe('prefix-1-suffix');
      expect(nextId()).toBe('prefix-2-suffix');
    });

    test('should combine local prefix with global suffix', () => {
      setGlobalSuffix('-suffix');
      expect(nextId('local-')).toBe('local-1-suffix');
      expect(nextId('local-')).toBe('local-2-suffix');
    });
  });

  describe('resetId functionality', () => {
    test('should reset ID counter to 0', () => {
      nextId();
      nextId();
      expect(getCurrentId()).toBe(2);
      
      resetId();
      expect(getCurrentId()).toBe(0);
      expect(nextId()).toBe('1');
    });

    test('should not affect global prefix and suffix', () => {
      setGlobalPrefix('prefix-');
      setGlobalSuffix('-suffix');
      nextId();
      nextId();
      
      resetId();
      expect(nextId()).toBe('prefix-1-suffix');
    });
  });

  describe('getCurrentId functionality', () => {
    test('should return current ID counter value', () => {
      expect(getCurrentId()).toBe(0);
      nextId();
      expect(getCurrentId()).toBe(1);
      nextId();
      expect(getCurrentId()).toBe(2);
    });
  });

  describe('setId functionality', () => {
    test('should set ID counter to specific value', () => {
      setId(5);
      expect(getCurrentId()).toBe(5);
      expect(nextId()).toBe('6');
    });

    test('should handle negative values by setting to 0', () => {
      setId(-5);
      expect(getCurrentId()).toBe(0);
    });

    test('should handle 0 as an explicit reset value', () => {
      nextId();
      nextId();
      setId(0);
      expect(getCurrentId()).toBe(0);
      expect(nextId()).toBe('1');
    });

    test('should handle decimal values by flooring', () => {
      setId(5.7);
      expect(getCurrentId()).toBe(5);
    });

    test('should handle very large numbers', () => {
      setId(1000000);
      expect(getCurrentId()).toBe(1000000);
      expect(nextId()).toBe('1000001');
    });
  });

  describe('generateId functionality', () => {
    beforeEach(() => {
      resetId();
    });

    test('should generate ID with specific prefix and suffix', () => {
      expect(generateId('test-', '-id')).toBe('test-1-id');
      expect(generateId('test-', '-id')).toBe('test-2-id');
    });

    test('should use default empty strings for prefix and suffix', () => {
      expect(generateId()).toBe('1');
      expect(generateId()).toBe('2');
    });

    test('should handle empty prefix and suffix', () => {
      expect(generateId('', '')).toBe('1');
      expect(generateId('', '')).toBe('2');
    });

    test('should increment global counter', () => {
      generateId('test-', '-id');
      expect(getCurrentId()).toBe(1);
      expect(nextId()).toBe('2');
    });

    test('should ignore global prefix and suffix', () => {
      setGlobalPrefix('global-');
      setGlobalSuffix('-global');
      expect(generateId('own-', '-own')).toBe('own-1-own');
      expect(generateId()).toBe('2');
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle very long prefixes and suffixes', () => {
      const longPrefix = 'a'.repeat(1000);
      const longSuffix = 'b'.repeat(1000);
      
      setGlobalPrefix(longPrefix);
      setGlobalSuffix(longSuffix);
      
      const id = nextId();
      expect(id).toBe(`${longPrefix}1${longSuffix}`);
      expect(id.length).toBe(2001);
    });

    test('should handle special characters in prefix and suffix', () => {
      setGlobalPrefix('!@#$%^&*()');
      setGlobalSuffix('[]{}|\\:";\'<>?,./');
      
      expect(nextId()).toBe('!@#$%^&*()1[]{}|\\:";\'<>?,./');
    });

    test('should handle unicode characters', () => {
      setGlobalPrefix('🚀');
      setGlobalSuffix('🎉');
      
      expect(nextId()).toBe('🚀1🎉');
    });

    test('should maintain uniqueness across multiple calls', () => {
      const ids = new Set();
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const id = nextId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
      
      expect(ids.size).toBe(iterations);
    });
  });

  describe('Integration with React components', () => {
    test('should work with React component patterns', () => {
      // Simulate component usage
      setGlobalPrefix('component-');
      setGlobalSuffix('-id');
      
      // First component
      const id1 = nextId();
      expect(id1).toBe('component-1-id');
      
      // Second component
      const id2 = nextId();
      expect(id2).toBe('component-2-id');
      
      // Reset for new page/component tree
      resetId();
      const id3 = nextId();
      expect(id3).toBe('component-1-id');
    });
  });
});
