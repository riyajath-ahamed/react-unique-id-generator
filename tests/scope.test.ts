import {
  nextIdForScope,
  resetIdForScope,
  resetAllScopes,
  getScopeCounter,
  getActiveScopes,
} from '../lib/scope';

describe('Scoped ID management', () => {
  beforeEach(() => {
    resetAllScopes();
  });

  describe('nextIdForScope', () => {
    test('should generate sequential IDs within a scope', () => {
      expect(nextIdForScope('form')).toBe('1');
      expect(nextIdForScope('form')).toBe('2');
      expect(nextIdForScope('form')).toBe('3');
    });

    test('should apply prefix to scoped IDs', () => {
      expect(nextIdForScope('modal', 'modal-')).toBe('modal-1');
      expect(nextIdForScope('modal', 'modal-')).toBe('modal-2');
    });

    test('should maintain independent counters per scope', () => {
      expect(nextIdForScope('form')).toBe('1');
      expect(nextIdForScope('modal')).toBe('1');
      expect(nextIdForScope('form')).toBe('2');
      expect(nextIdForScope('modal')).toBe('2');
    });

    test('should handle empty scope name', () => {
      expect(nextIdForScope('')).toBe('1');
      expect(nextIdForScope('')).toBe('2');
    });
  });

  describe('resetIdForScope', () => {
    test('should reset counter for a specific scope', () => {
      nextIdForScope('form');
      nextIdForScope('form');
      expect(getScopeCounter('form')).toBe(2);

      resetIdForScope('form');
      expect(getScopeCounter('form')).toBe(0);
      expect(nextIdForScope('form')).toBe('1');
    });

    test('should not affect other scopes', () => {
      nextIdForScope('form');
      nextIdForScope('form');
      nextIdForScope('modal');

      resetIdForScope('form');

      expect(getScopeCounter('form')).toBe(0);
      expect(getScopeCounter('modal')).toBe(1);
    });

    test('should handle resetting non-existent scope', () => {
      expect(() => resetIdForScope('nonexistent')).not.toThrow();
    });
  });

  describe('resetAllScopes', () => {
    test('should reset all scope counters', () => {
      nextIdForScope('form');
      nextIdForScope('modal');
      nextIdForScope('sidebar');

      resetAllScopes();

      expect(getScopeCounter('form')).toBe(0);
      expect(getScopeCounter('modal')).toBe(0);
      expect(getScopeCounter('sidebar')).toBe(0);
    });

    test('should clear active scopes list', () => {
      nextIdForScope('form');
      nextIdForScope('modal');

      resetAllScopes();
      expect(getActiveScopes()).toEqual([]);
    });
  });

  describe('getScopeCounter', () => {
    test('should return 0 for unused scope', () => {
      expect(getScopeCounter('unused')).toBe(0);
    });

    test('should return current counter value', () => {
      nextIdForScope('counter-test');
      nextIdForScope('counter-test');
      nextIdForScope('counter-test');
      expect(getScopeCounter('counter-test')).toBe(3);
    });
  });

  describe('getActiveScopes', () => {
    test('should return empty array initially', () => {
      expect(getActiveScopes()).toEqual([]);
    });

    test('should return all active scope names', () => {
      nextIdForScope('form');
      nextIdForScope('modal');
      nextIdForScope('sidebar');

      const scopes = getActiveScopes();
      expect(scopes).toContain('form');
      expect(scopes).toContain('modal');
      expect(scopes).toContain('sidebar');
      expect(scopes.length).toBe(3);
    });

    test('should not include reset scopes', () => {
      nextIdForScope('form');
      nextIdForScope('modal');
      resetIdForScope('form');

      const scopes = getActiveScopes();
      expect(scopes).not.toContain('form');
      expect(scopes).toContain('modal');
    });
  });

  describe('Edge cases', () => {
    test('should handle many concurrent scopes', () => {
      for (let i = 0; i < 100; i++) {
        nextIdForScope(`scope-${i}`);
      }
      expect(getActiveScopes().length).toBe(100);

      resetAllScopes();
      expect(getActiveScopes().length).toBe(0);
    });

    test('should handle rapid ID generation in a single scope', () => {
      for (let i = 0; i < 1000; i++) {
        nextIdForScope('rapid');
      }
      expect(getScopeCounter('rapid')).toBe(1000);
    });

    test('should handle special characters in scope names', () => {
      nextIdForScope('form/login');
      nextIdForScope('modal:confirm');
      expect(getScopeCounter('form/login')).toBe(1);
      expect(getScopeCounter('modal:confirm')).toBe(1);
    });
  });
});
