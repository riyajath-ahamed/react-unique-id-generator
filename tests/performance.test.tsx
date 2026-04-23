import React from 'react';
import { render, act } from '@testing-library/react';
import {
  useTrackedUniqueId,
  useTrackedUniqueIds,
  useIdMetrics,
  getIdMetrics,
  resetIdMetrics,
  getActiveIdCount,
  cleanupInactiveIds,
} from '../lib/performance';
import { resetId } from '../lib/nextId';

describe('Memory-efficient ID cleanup', () => {
  beforeEach(() => {
    resetId();
    cleanupInactiveIds();
    resetIdMetrics();
  });

  describe('useTrackedUniqueId', () => {
    test('should generate and track an ID', () => {
      const Component: React.FC = () => {
        const id = useTrackedUniqueId('track-');
        return <div data-testid="tracked">{id}</div>;
      };

      const { getByTestId } = render(<Component />);
      expect(getByTestId('tracked')).toHaveTextContent('track-1');
      expect(getActiveIdCount()).toBe(1);
    });

    test('should untrack ID on unmount', () => {
      const Component: React.FC = () => {
        const id = useTrackedUniqueId('track-');
        return <div data-testid="tracked">{id}</div>;
      };

      const { unmount } = render(<Component />);
      expect(getActiveIdCount()).toBe(1);

      unmount();
      expect(getActiveIdCount()).toBe(0);
    });

    test('should maintain stable ID across re-renders', () => {
      const Component: React.FC<{ value: number }> = ({ value }) => {
        const id = useTrackedUniqueId('stable-');
        return <div data-testid="tracked">{id}-{value}</div>;
      };

      const { getByTestId, rerender } = render(<Component value={1} />);
      expect(getByTestId('tracked')).toHaveTextContent('stable-1-1');

      rerender(<Component value={2} />);
      expect(getByTestId('tracked')).toHaveTextContent('stable-1-2');
      expect(getActiveIdCount()).toBe(1);
    });

    test('should track multiple component instances', () => {
      const Component: React.FC<{ testId: string }> = ({ testId }) => {
        const id = useTrackedUniqueId('multi-');
        return <div data-testid={testId}>{id}</div>;
      };

      const { unmount } = render(
        <div>
          <Component testId="a" />
          <Component testId="b" />
          <Component testId="c" />
        </div>
      );

      expect(getActiveIdCount()).toBe(3);

      unmount();
      expect(getActiveIdCount()).toBe(0);
    });
  });

  describe('useTrackedUniqueIds', () => {
    test('should generate and track multiple IDs', () => {
      const Component: React.FC = () => {
        const ids = useTrackedUniqueIds(3, 'batch-');
        return (
          <div>
            {ids.map((id, i) => (
              <span key={id} data-testid={`id-${i}`}>{id}</span>
            ))}
          </div>
        );
      };

      const { getByTestId } = render(<Component />);
      expect(getByTestId('id-0')).toHaveTextContent('batch-1');
      expect(getByTestId('id-1')).toHaveTextContent('batch-2');
      expect(getByTestId('id-2')).toHaveTextContent('batch-3');
      expect(getActiveIdCount()).toBe(3);
    });

    test('should untrack all IDs on unmount', () => {
      const Component: React.FC = () => {
        const ids = useTrackedUniqueIds(3, 'batch-');
        return <div>{ids.join(',')}</div>;
      };

      const { unmount } = render(<Component />);
      expect(getActiveIdCount()).toBe(3);

      unmount();
      expect(getActiveIdCount()).toBe(0);
    });

    test('should maintain stable IDs across re-renders', () => {
      const Component: React.FC<{ value: number }> = ({ value }) => {
        const [id1, id2] = useTrackedUniqueIds(2, 'stable-');
        return (
          <div>
            <span data-testid="first">{id1}</span>
            <span data-testid="second">{id2}</span>
            <span data-testid="value">{value}</span>
          </div>
        );
      };

      const { getByTestId, rerender } = render(<Component value={1} />);
      expect(getByTestId('first')).toHaveTextContent('stable-1');
      expect(getByTestId('second')).toHaveTextContent('stable-2');

      rerender(<Component value={2} />);
      expect(getByTestId('first')).toHaveTextContent('stable-1');
      expect(getByTestId('second')).toHaveTextContent('stable-2');
    });
  });
});

describe('Performance monitoring', () => {
  beforeEach(() => {
    resetId();
    cleanupInactiveIds();
    resetIdMetrics();
  });

  describe('getIdMetrics', () => {
    test('should return initial metrics', () => {
      const metrics = getIdMetrics();
      expect(metrics.totalGenerated).toBe(0);
      expect(metrics.activeCount).toBe(0);
      expect(metrics.peakActiveCount).toBe(0);
    });

    test('should track total generated count', () => {
      const Component: React.FC = () => {
        useTrackedUniqueId();
        return null;
      };

      render(<Component />);
      render(<Component />);

      const metrics = getIdMetrics();
      expect(metrics.totalGenerated).toBe(2);
    });

    test('should track active count correctly with mount/unmount', () => {
      const Component: React.FC = () => {
        useTrackedUniqueId();
        return null;
      };

      const { unmount: unmount1 } = render(<Component />);
      const { unmount: unmount2 } = render(<Component />);

      expect(getIdMetrics().activeCount).toBe(2);

      unmount1();
      expect(getIdMetrics().activeCount).toBe(1);

      unmount2();
      expect(getIdMetrics().activeCount).toBe(0);
    });

    test('should track peak active count', () => {
      const Component: React.FC = () => {
        useTrackedUniqueId();
        return null;
      };

      const { unmount: unmount1 } = render(<Component />);
      const { unmount: unmount2 } = render(<Component />);
      const { unmount: unmount3 } = render(<Component />);

      expect(getIdMetrics().peakActiveCount).toBe(3);

      unmount1();
      unmount2();
      unmount3();

      expect(getIdMetrics().peakActiveCount).toBe(3);
      expect(getIdMetrics().activeCount).toBe(0);
    });
  });

  describe('resetIdMetrics', () => {
    test('should reset totalGenerated to 0', () => {
      const Component: React.FC = () => {
        useTrackedUniqueId();
        return null;
      };

      render(<Component />);
      render(<Component />);
      expect(getIdMetrics().totalGenerated).toBe(2);

      resetIdMetrics();
      expect(getIdMetrics().totalGenerated).toBe(0);
    });
  });

  describe('useIdMetrics hook', () => {
    test('should return current metrics', () => {
      let capturedMetrics: ReturnType<typeof getIdMetrics> | null = null;

      const MetricsDisplay: React.FC = () => {
        const metrics = useIdMetrics();
        capturedMetrics = metrics;
        return <div data-testid="metrics">{metrics.activeCount}</div>;
      };

      render(<MetricsDisplay />);
      expect(capturedMetrics).not.toBeNull();
      expect(capturedMetrics!.activeCount).toBe(0);
    });
  });

  describe('cleanupInactiveIds', () => {
    test('should clear all tracked IDs', () => {
      const Component: React.FC = () => {
        useTrackedUniqueId();
        return null;
      };

      render(<Component />);
      render(<Component />);
      expect(getActiveIdCount()).toBe(2);

      cleanupInactiveIds();
      expect(getActiveIdCount()).toBe(0);
    });
  });
});
