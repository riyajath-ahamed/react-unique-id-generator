import React from 'react';
import { render } from '@testing-library/react';
import {
  generateIdWithStrategy,
  numericStrategy,
  zeroPaddedStrategy,
  timestampStrategy,
  hashStrategy,
} from '../lib/strategy';
import type { IdStrategy } from '../lib/core/types';
import { useIdWithStrategy, _resetFallbackManager } from '../lib/react/use-id-with-strategy';
import { IdManagerProvider } from '../lib/react/context';
import { IdManager, createIdManager } from '../lib/core/id-manager';

afterEach(() => {
  _resetFallbackManager();
});

describe('numericStrategy', () => {
  test('should generate numeric IDs', () => {
    expect(numericStrategy.generate('btn-', '', 1)).toBe('btn-1');
    expect(numericStrategy.generate('', '-end', 5)).toBe('5-end');
    expect(numericStrategy.generate('', '', 42)).toBe('42');
  });
});

describe('zeroPaddedStrategy', () => {
  test('should generate zero-padded IDs with default width', () => {
    const strategy = zeroPaddedStrategy();
    expect(strategy.generate('id-', '', 1)).toBe('id-0001');
    expect(strategy.generate('id-', '', 42)).toBe('id-0042');
    expect(strategy.generate('id-', '', 9999)).toBe('id-9999');
  });

  test('should support custom width', () => {
    const strategy = zeroPaddedStrategy(6);
    expect(strategy.generate('', '', 1)).toBe('000001');
    expect(strategy.generate('item-', '', 123)).toBe('item-000123');
  });

  test('should not truncate numbers wider than padding', () => {
    const strategy = zeroPaddedStrategy(2);
    expect(strategy.generate('', '', 999)).toBe('999');
  });
});

describe('timestampStrategy', () => {
  test('should include timestamp and counter', () => {
    const before = Date.now();
    const result = timestampStrategy.generate('ts-', '', 1);
    const after = Date.now();

    expect(result).toMatch(/^ts-\d+-1$/);
    const timestamp = parseInt(result.replace('ts-', '').split('-')[0], 10);
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});

describe('hashStrategy', () => {
  test('should generate hex hash IDs', () => {
    const result = hashStrategy.generate('h-', '', 1);
    expect(result).toMatch(/^h-[0-9a-f]{8}$/);
  });

  test('should produce different hashes for different counters', () => {
    const a = hashStrategy.generate('', '', 1);
    const b = hashStrategy.generate('', '', 2);
    expect(a).not.toBe(b);
  });

  test('should produce consistent hash for the same counter', () => {
    const a = hashStrategy.generate('', '', 42);
    const b = hashStrategy.generate('', '', 42);
    expect(a).toBe(b);
  });
});

describe('generateIdWithStrategy', () => {
  let manager: IdManager;

  beforeEach(() => {
    manager = createIdManager();
  });

  test('should use the given strategy', () => {
    const result = generateIdWithStrategy(manager, numericStrategy, 'item-', '-v1');
    expect(result).toBe('item-1-v1');
  });

  test('should increment the strategy counter', () => {
    generateIdWithStrategy(manager, numericStrategy);
    generateIdWithStrategy(manager, numericStrategy);
    expect(manager.getStrategyCounter()).toBe(2);
  });

  test('should work with custom strategies', () => {
    const custom: IdStrategy = {
      generate(prefix, suffix, counter) {
        return `${prefix}CUSTOM${counter}${suffix}`;
      },
    };
    expect(generateIdWithStrategy(manager, custom, 'x-', '!')).toBe('x-CUSTOM1!');
    expect(generateIdWithStrategy(manager, custom, '', '')).toBe('CUSTOM2');
  });

  test('should default prefix and suffix to empty strings', () => {
    expect(generateIdWithStrategy(manager, numericStrategy)).toBe('1');
  });

  test('should use separate counters per manager', () => {
    const m1 = createIdManager();
    const m2 = createIdManager();
    expect(generateIdWithStrategy(m1, numericStrategy)).toBe('1');
    expect(generateIdWithStrategy(m2, numericStrategy)).toBe('1');
    expect(generateIdWithStrategy(m1, numericStrategy)).toBe('2');
  });
});

describe('useIdWithStrategy', () => {
  test('should generate a stable ID with a strategy', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const id = useIdWithStrategy(numericStrategy, 'field-');
      return <input id={id} value={value} readOnly />;
    };

    const { container, rerender } = render(
      <IdManagerProvider>
        <Component value={1} />
      </IdManagerProvider>
    );
    const input = container.querySelector('input')!;
    expect(input.id).toBe('field-1');

    rerender(
      <IdManagerProvider>
        <Component value={2} />
      </IdManagerProvider>
    );
    expect(container.querySelector('input')!.id).toBe('field-1');
  });

  test('should generate unique IDs across components', () => {
    const ComponentA: React.FC = () => {
      const id = useIdWithStrategy(numericStrategy, 'a-');
      return <span data-testid={id}>A</span>;
    };
    const ComponentB: React.FC = () => {
      const id = useIdWithStrategy(numericStrategy, 'b-');
      return <span data-testid={id}>B</span>;
    };

    const { getByTestId } = render(
      <IdManagerProvider>
        <ComponentA />
        <ComponentB />
      </IdManagerProvider>
    );

    expect(getByTestId('a-1')).toBeInTheDocument();
    expect(getByTestId('b-2')).toBeInTheDocument();
  });

  test('should work with zero-padded strategy', () => {
    const Component: React.FC = () => {
      const id = useIdWithStrategy(zeroPaddedStrategy(4), 'id-');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <IdManagerProvider>
        <Component />
      </IdManagerProvider>
    );
    expect(getByTestId('id-0001')).toBeInTheDocument();
  });

  test('should work with IdManagerProvider context', () => {
    const Component: React.FC = () => {
      const id = useIdWithStrategy(zeroPaddedStrategy(3), 'ctx-');
      return <div data-testid={id}>content</div>;
    };

    const manager = new IdManager();
    const { container } = render(
      <IdManagerProvider manager={manager}>
        <Component />
      </IdManagerProvider>
    );

    const div = container.querySelector('div[data-testid]')!;
    expect(div.getAttribute('data-testid')).toBe('ctx-001');
  });

  test('should work without provider (fallback)', () => {
    const Component: React.FC = () => {
      const id = useIdWithStrategy(numericStrategy, 'fb-');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('fb-1')).toBeInTheDocument();
  });

  test('should accept reactId as counter seed', () => {
    const Component: React.FC = () => {
      const id = useIdWithStrategy(numericStrategy, 'r-', '', ':r10:');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <IdManagerProvider>
        <Component />
      </IdManagerProvider>
    );
    expect(getByTestId('r-10')).toBeInTheDocument();
  });
});
