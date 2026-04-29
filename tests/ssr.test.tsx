import React from 'react';
import { render } from '@testing-library/react';
import {
  SSRProvider,
  useSSRContext,
  useSSRSafeId,
  createSSRIdFactory,
} from '../lib/ssr';

describe('SSRProvider', () => {
  test('should provide scoped IDs to children', () => {
    const Component: React.FC = () => {
      const ctx = useSSRContext();
      const id = ctx!.nextId('field-');
      return <input id={id} readOnly />;
    };

    const { container } = render(
      <SSRProvider prefix="ssr-">
        <Component />
      </SSRProvider>
    );

    expect(container.querySelector('input')!.id).toBe('field-1');
  });

  test('should scope IDs per request with requestId', () => {
    const Component: React.FC = () => {
      const ctx = useSSRContext();
      const id = ctx!.nextId('item-');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <SSRProvider requestId="req-abc">
        <Component />
      </SSRProvider>
    );

    expect(getByTestId('item-req-abc-1')).toBeInTheDocument();
  });

  test('should use provider prefix when no local prefix given', () => {
    const Component: React.FC = () => {
      const ctx = useSSRContext();
      const id = ctx!.nextId();
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <SSRProvider prefix="app-">
        <Component />
      </SSRProvider>
    );

    expect(getByTestId('app-1')).toBeInTheDocument();
  });

  test('should support suffix', () => {
    const Component: React.FC = () => {
      const ctx = useSSRContext();
      const id = ctx!.nextId('x-');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <SSRProvider suffix="-end">
        <Component />
      </SSRProvider>
    );

    expect(getByTestId('x-1-end')).toBeInTheDocument();
  });

  test('should increment counter across multiple calls', () => {
    const Component: React.FC = () => {
      const ctx = useSSRContext();
      const id1 = ctx!.nextId();
      const id2 = ctx!.nextId();
      const id3 = ctx!.nextId();
      return (
        <div>
          <span data-testid={id1}>1</span>
          <span data-testid={id2}>2</span>
          <span data-testid={id3}>3</span>
        </div>
      );
    };

    const { getByTestId } = render(
      <SSRProvider>
        <Component />
      </SSRProvider>
    );

    expect(getByTestId('1')).toBeInTheDocument();
    expect(getByTestId('2')).toBeInTheDocument();
    expect(getByTestId('3')).toBeInTheDocument();
  });

  test('should isolate counters between providers', () => {
    const Component: React.FC<{ testPrefix: string }> = ({ testPrefix }) => {
      const ctx = useSSRContext();
      const id = ctx!.nextId(testPrefix);
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <div>
        <SSRProvider>
          <Component testPrefix="a-" />
        </SSRProvider>
        <SSRProvider>
          <Component testPrefix="b-" />
        </SSRProvider>
      </div>
    );

    expect(getByTestId('a-1')).toBeInTheDocument();
    expect(getByTestId('b-1')).toBeInTheDocument();
  });
});

describe('useSSRSafeId', () => {
  test('should generate an ID within SSRProvider', () => {
    const Component: React.FC = () => {
      const id = useSSRSafeId('safe-');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <SSRProvider>
        <Component />
      </SSRProvider>
    );

    expect(getByTestId('safe-1')).toBeInTheDocument();
  });

  test('should generate a stable ID across rerenders', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const id = useSSRSafeId('stable-');
      return <div data-testid={id}>{value}</div>;
    };

    const { getByTestId, rerender } = render(
      <SSRProvider>
        <Component value={1} />
      </SSRProvider>
    );

    expect(getByTestId('stable-1')).toBeInTheDocument();

    rerender(
      <SSRProvider>
        <Component value={2} />
      </SSRProvider>
    );

    expect(getByTestId('stable-1')).toBeInTheDocument();
  });

  test('should generate fallback ID without SSRProvider', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const Component: React.FC = () => {
      const id = useSSRSafeId('fallback-');
      return <div data-testid="test">{id}</div>;
    };

    const { getByTestId } = render(<Component />);
    const id = getByTestId('test').textContent!;
    expect(id).toMatch(/^fallback-\d+-\d+$/);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('useSSRSafeId() called without <SSRProvider>')
    );

    warnSpy.mockRestore();
  });

  test('should work with requestId for deterministic IDs', () => {
    const Component: React.FC = () => {
      const id = useSSRSafeId('f-');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(
      <SSRProvider requestId="r1">
        <Component />
      </SSRProvider>
    );

    expect(getByTestId('f-r1-1')).toBeInTheDocument();
  });
});

describe('createSSRIdFactory', () => {
  test('should create a factory with request-scoped IDs', () => {
    const factory = createSSRIdFactory('req-123', 'app-');
    expect(factory.nextId()).toBe('app-req-123-1');
    expect(factory.nextId()).toBe('app-req-123-2');
  });

  test('should support local prefix override', () => {
    const factory = createSSRIdFactory('req-1', 'default-');
    expect(factory.nextId('custom-')).toBe('custom-req-1-1');
  });

  test('should support suffix', () => {
    const factory = createSSRIdFactory('req-1', '', '-end');
    expect(factory.nextId()).toBe('req-1-1-end');
  });

  test('should reset counter', () => {
    const factory = createSSRIdFactory('req-1');
    factory.nextId();
    factory.nextId();
    expect(factory.getCurrentId()).toBe(2);

    factory.resetId();
    expect(factory.getCurrentId()).toBe(0);
    expect(factory.nextId()).toBe('req-1-1');
  });

  test('should track current ID', () => {
    const factory = createSSRIdFactory('req-1');
    expect(factory.getCurrentId()).toBe(0);
    factory.nextId();
    expect(factory.getCurrentId()).toBe(1);
    factory.nextId();
    expect(factory.getCurrentId()).toBe(2);
  });

  test('should isolate counters between factories', () => {
    const factoryA = createSSRIdFactory('a');
    const factoryB = createSSRIdFactory('b');

    factoryA.nextId();
    factoryA.nextId();
    factoryB.nextId();

    expect(factoryA.getCurrentId()).toBe(2);
    expect(factoryB.getCurrentId()).toBe(1);
  });
});
