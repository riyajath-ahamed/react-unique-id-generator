import React, { useState } from 'react';
import { render, act } from '@testing-library/react';
import nextId, { resetId, setId, generateId } from '../lib/nextId';
import { useUniqueId, useUniqueIds } from '../lib/hooks';
import { IdProvider } from '../lib/context';
import { useTrackedUniqueId, getActiveIdCount, cleanupInactiveIds, resetIdMetrics } from '../lib/performance';

describe('Edge cases', () => {
  beforeEach(() => {
    resetId();
    cleanupInactiveIds();
    resetIdMetrics();
  });

  describe('Rapid mount/unmount cycles', () => {
    test('should handle rapid mount/unmount without leaking IDs', () => {
      const Component: React.FC = () => {
        const id = useTrackedUniqueId('rapid-');
        return <div>{id}</div>;
      };

      for (let i = 0; i < 50; i++) {
        const { unmount } = render(<Component />);
        unmount();
      }

      expect(getActiveIdCount()).toBe(0);
    });

    test('should generate unique IDs across rapid mount/unmount', () => {
      const ids = new Set<string>();

      const Component: React.FC<{ onId: (id: string) => void }> = ({ onId }) => {
        const id = useUniqueId('cycle-');
        onId(id);
        return <div>{id}</div>;
      };

      for (let i = 0; i < 100; i++) {
        let capturedId = '';
        const { unmount } = render(
          <Component onId={(id) => { capturedId = id; }} />
        );
        ids.add(capturedId);
        unmount();
      }

      expect(ids.size).toBe(100);
    });
  });

  describe('Large number of IDs', () => {
    test('should handle generating 10,000 sequential IDs', () => {
      const count = 10_000;
      const ids = new Set<string>();

      for (let i = 0; i < count; i++) {
        ids.add(nextId());
      }

      expect(ids.size).toBe(count);
    });

    test('should handle 1,000 concurrent tracked components', () => {
      const Components: React.FC = () => {
        return (
          <div>
            {Array.from({ length: 1000 }, (_, i) => (
              <TrackedChild key={i} />
            ))}
          </div>
        );
      };

      const TrackedChild: React.FC = () => {
        const id = useTrackedUniqueId();
        return <span>{id}</span>;
      };

      const { unmount } = render(<Components />);
      expect(getActiveIdCount()).toBe(1000);

      unmount();
      expect(getActiveIdCount()).toBe(0);
    });

    test('should handle large batch of useUniqueIds', () => {
      const Component: React.FC = () => {
        const ids = useUniqueIds(500, 'batch-');
        return <div data-testid="count">{ids.length}</div>;
      };

      const { getByTestId } = render(<Component />);
      expect(getByTestId('count')).toHaveTextContent('500');
    });
  });

  describe('Counter boundary values', () => {
    test('should handle counter at Number.MAX_SAFE_INTEGER', () => {
      setId(Number.MAX_SAFE_INTEGER - 1);
      const id = nextId();
      expect(id).toBe(`${Number.MAX_SAFE_INTEGER}`);
    });

    test('should handle setId with 0', () => {
      setId(0);
      expect(nextId()).toBe('1');
    });

    test('should handle setId with very large decimal', () => {
      setId(999.999);
      expect(nextId()).toBe('1000');
    });

    test('should clamp negative infinity to 0', () => {
      setId(-Infinity);
      expect(nextId()).toBe('1');
    });
  });

  describe('Concurrent component trees', () => {
    test('should isolate IDs between separate IdProvider trees', () => {
      const Component: React.FC<{ testId: string }> = ({ testId }) => {
        const id = useUniqueId('item-');
        return <div data-testid={testId}>{id}</div>;
      };

      const { getByTestId } = render(
        <div>
          <IdProvider prefix="tree1-">
            <Component testId="a1" />
            <Component testId="a2" />
          </IdProvider>
          <IdProvider prefix="tree2-">
            <Component testId="b1" />
            <Component testId="b2" />
          </IdProvider>
        </div>
      );

      expect(getByTestId('a1')).toHaveTextContent('item-1');
      expect(getByTestId('a2')).toHaveTextContent('item-2');
      expect(getByTestId('b1')).toHaveTextContent('item-1');
      expect(getByTestId('b2')).toHaveTextContent('item-2');
    });
  });

  describe('Dynamic component lists', () => {
    test('should handle adding and removing items from a list', () => {
      const ListItem: React.FC<{ testId: string }> = ({ testId }) => {
        const id = useTrackedUniqueId('item-');
        return <li data-testid={testId}>{id}</li>;
      };

      const DynamicList: React.FC<{ count: number }> = ({ count }) => {
        return (
          <ul>
            {Array.from({ length: count }, (_, i) => (
              <ListItem key={i} testId={`item-${i}`} />
            ))}
          </ul>
        );
      };

      const { rerender } = render(<DynamicList count={5} />);
      expect(getActiveIdCount()).toBe(5);

      rerender(<DynamicList count={3} />);
      expect(getActiveIdCount()).toBe(3);

      rerender(<DynamicList count={0} />);
      expect(getActiveIdCount()).toBe(0);
    });
  });

  describe('generateId edge cases', () => {
    test('should handle empty string prefix and suffix', () => {
      expect(generateId('', '')).toBe('1');
    });

    test('should handle prefix with numbers', () => {
      expect(generateId('123-', '')).toBe('123-1');
    });

    test('should handle very long prefix and suffix simultaneously', () => {
      const prefix = 'x'.repeat(500);
      const suffix = 'y'.repeat(500);
      const id = generateId(prefix, suffix);
      expect(id.length).toBe(1001);
    });
  });
});
