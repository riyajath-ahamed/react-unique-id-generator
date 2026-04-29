import React from 'react';
import { render } from '@testing-library/react';
import { IdPool, useIdPool } from '../lib/pool';
import { resetId } from '../lib/nextId';
import { IdProvider } from '../lib/context';

describe('IdPool', () => {
  test('should pre-allocate IDs', () => {
    const pool = new IdPool(5, { prefix: 'p-' });
    expect(pool.size).toBe(5);
    expect(pool.totalGenerated).toBe(5);
  });

  test('should acquire IDs in order', () => {
    const pool = new IdPool(3, { prefix: 'item-' });
    expect(pool.acquire()).toBe('item-1');
    expect(pool.acquire()).toBe('item-2');
    expect(pool.acquire()).toBe('item-3');
  });

  test('should auto-expand when pool is exhausted', () => {
    const pool = new IdPool(2, { prefix: 'x-' });
    pool.acquire();
    pool.acquire();
    expect(pool.acquire()).toBe('x-3');
  });

  test('should reuse released IDs', () => {
    const pool = new IdPool(3);
    const id1 = pool.acquire();
    pool.acquire();
    pool.release(id1);
    expect(pool.acquire()).toBe(id1);
  });

  test('should support suffix', () => {
    const pool = new IdPool(2, { prefix: 'a-', suffix: '-z' });
    expect(pool.acquire()).toBe('a-1-z');
    expect(pool.acquire()).toBe('a-2-z');
  });

  test('should support custom generator', () => {
    const pool = new IdPool(3, {
      generator: (i) => `custom-${i * 10}`,
    });
    expect(pool.acquire()).toBe('custom-10');
    expect(pool.acquire()).toBe('custom-20');
    expect(pool.acquire()).toBe('custom-30');
  });

  test('should drain all IDs', () => {
    const pool = new IdPool(5);
    pool.acquire();
    pool.drain();
    expect(pool.size).toBe(0);
  });

  test('should refill pool', () => {
    const pool = new IdPool(2);
    pool.drain();
    pool.refill(3);
    expect(pool.size).toBe(3);
  });

  test('should track total generated', () => {
    const pool = new IdPool(3);
    pool.acquire();
    pool.acquire();
    pool.acquire();
    pool.acquire(); // auto-expand
    expect(pool.totalGenerated).toBe(4);
  });

  test('should work without autoRefill disabled', () => {
    const pool = new IdPool(1, { autoRefill: false });
    pool.acquire();
    const id = pool.acquire();
    expect(id).toBeTruthy();
  });

  test('should generate IDs without prefix or suffix', () => {
    const pool = new IdPool(2);
    expect(pool.acquire()).toBe('1');
    expect(pool.acquire()).toBe('2');
  });
});

describe('useIdPool', () => {
  beforeEach(() => {
    resetId();
  });

  test('should return a function that provides IDs from the pool', () => {
    let acquireFn: (() => string) | null = null;

    const Component: React.FC = () => {
      const acquire = useIdPool(3, 'pool-');
      acquireFn = acquire;
      const id = acquire();
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('pool-1')).toBeInTheDocument();

    expect(acquireFn!()).toBe('pool-2');
    expect(acquireFn!()).toBe('pool-3');
  });

  test('should auto-expand when pool is exhausted', () => {
    let acquireFn: (() => string) | null = null;

    const Component: React.FC = () => {
      const acquire = useIdPool(2);
      acquireFn = acquire;
      acquire();
      acquire();
      return <div>content</div>;
    };

    render(<Component />);
    const id = acquireFn!();
    expect(id).toBeTruthy();
  });

  test('should work with IdProvider', () => {
    let acquireFn: (() => string) | null = null;

    const Component: React.FC = () => {
      const acquire = useIdPool(3, 'ctx-');
      acquireFn = acquire;
      return <div>{acquire()}</div>;
    };

    render(
      <IdProvider prefix="provider-">
        <Component />
      </IdProvider>
    );

    expect(acquireFn!()).toBeTruthy();
  });

  test('should maintain stable pool across rerenders', () => {
    let acquireFn: (() => string) | null = null;

    const Component: React.FC<{ value: number }> = ({ value }) => {
      const acquire = useIdPool(5, 'stable-');
      acquireFn = acquire;
      return <div>{value}</div>;
    };

    const { rerender } = render(<Component value={1} />);
    const id1 = acquireFn!();
    rerender(<Component value={2} />);
    const id2 = acquireFn!();

    expect(id1).not.toBe(id2);
    expect(id1).toBe('stable-1');
  });
});
