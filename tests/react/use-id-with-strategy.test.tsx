import React from 'react';
import { renderHook } from '@testing-library/react';
import { useIdWithStrategy, _resetFallbackManager } from '../../lib/react/use-id-with-strategy';
import { IdManagerProvider } from '../../lib/react/context';
import { IdManager } from '../../lib/core/id-manager';
import type { IdStrategy } from '../../lib/core/types';

const numericStrategy: IdStrategy = {
  generate(prefix, suffix, counter) { return `${prefix}${counter}${suffix}`; },
};

const zeroPaddedStrategy = (width: number = 4): IdStrategy => ({
  generate(prefix, suffix, counter) {
    return `${prefix}${String(counter).padStart(width, '0')}${suffix}`;
  },
});

const hashStrategy: IdStrategy = {
  generate(prefix, suffix, counter) {
    let hash = counter;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = (hash >> 16) ^ hash;
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `${prefix}${hex}${suffix}`;
  },
};

afterEach(() => {
  _resetFallbackManager();
});

describe('useIdWithStrategy', () => {
  describe('with IdManagerProvider', () => {
    it('should generate an ID with numeric strategy', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'btn-'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('btn-1');
    });

    it('should generate stable IDs across re-renders', () => {
      const { result, rerender } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'id-'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      const first = result.current;
      rerender();
      expect(result.current).toBe(first);
    });

    it('should work with zero-padded strategy', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(zeroPaddedStrategy(6), 'item-', '-end'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('item-000001-end');
    });

    it('should work with hash strategy', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(hashStrategy, 'h-'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toMatch(/^h-[0-9a-f]{8}$/);
    });

    it('should increment counter across multiple hooks', () => {
      const manager = new IdManager();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <IdManagerProvider manager={manager}>{children}</IdManagerProvider>
      );

      const { result: r1 } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'a-'),
        { wrapper }
      );
      const { result: r2 } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'b-'),
        { wrapper }
      );

      expect(r1.current).toBe('a-1');
      expect(r2.current).toBe('b-2');
    });
  });

  describe('with reactId', () => {
    it('should use reactId as counter seed', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'btn-', '', ':r7:'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('btn-7');
    });

    it('should work with zero-padded strategy and reactId', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(zeroPaddedStrategy(4), 'item-', '', ':r3:'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('item-0003');
    });

    it('should fall back to manager counter for unparseable reactId', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'x-', '', 'abc'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('x-1');
    });
  });

  describe('without IdManagerProvider', () => {
    it('should use fallback manager', () => {
      const { result } = renderHook(
        () => useIdWithStrategy(numericStrategy, 'standalone-')
      );
      expect(result.current).toBe('standalone-1');
    });
  });

  describe('custom strategy', () => {
    it('should accept any object implementing IdStrategy', () => {
      const custom: IdStrategy = {
        generate(prefix, suffix, counter) {
          return `${prefix}custom_${counter}_${suffix}`;
        },
      };
      const { result } = renderHook(
        () => useIdWithStrategy(custom, 'pre-', 'suf'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('pre-custom_1_suf');
    });
  });
});
