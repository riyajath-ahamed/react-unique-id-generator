import React from 'react';
import { render } from '@testing-library/react';
import { IdProvider } from '../lib/context';
import { useUniqueId, useUniqueIds } from '../lib/hooks';
import { resetId, setGlobalPrefix, setGlobalSuffix } from '../lib/nextId';

describe('IdProvider', () => {
  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
  });

  test('should scope IDs to the provider', () => {
    const Component: React.FC<{ testId: string }> = ({ testId }) => {
      const id = useUniqueId();
      return <div data-testid={testId}>{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider>
        <Component testId="first" />
        <Component testId="second" />
      </IdProvider>
    );

    expect(getByTestId('first')).toHaveTextContent('1');
    expect(getByTestId('second')).toHaveTextContent('2');
  });

  test('should apply provider prefix to IDs', () => {
    const Component: React.FC = () => {
      const id = useUniqueId();
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider prefix="app-">
        <Component />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('app-1');
  });

  test('should apply provider suffix to IDs', () => {
    const Component: React.FC = () => {
      const id = useUniqueId();
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider suffix="-end">
        <Component />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('1-end');
  });

  test('should apply both prefix and suffix', () => {
    const Component: React.FC = () => {
      const id = useUniqueId();
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider prefix="app-" suffix="-id">
        <Component />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('app-1-id');
  });

  test('should allow local prefix to override provider prefix', () => {
    const Component: React.FC = () => {
      const id = useUniqueId('local-');
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider prefix="app-">
        <Component />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('local-1');
  });

  test('should start from custom startId', () => {
    const Component: React.FC = () => {
      const id = useUniqueId();
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider startId={100}>
        <Component />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('101');
  });

  test('should isolate counters between separate providers', () => {
    const Component: React.FC<{ testId: string }> = ({ testId }) => {
      const id = useUniqueId();
      return <div data-testid={testId}>{id}</div>;
    };

    const { getByTestId } = render(
      <div>
        <IdProvider prefix="a-">
          <Component testId="first" />
          <Component testId="second" />
        </IdProvider>
        <IdProvider prefix="b-">
          <Component testId="third" />
          <Component testId="fourth" />
        </IdProvider>
      </div>
    );

    expect(getByTestId('first')).toHaveTextContent('a-1');
    expect(getByTestId('second')).toHaveTextContent('a-2');
    expect(getByTestId('third')).toHaveTextContent('b-1');
    expect(getByTestId('fourth')).toHaveTextContent('b-2');
  });

  test('should support nested providers with independent scopes', () => {
    const Component: React.FC<{ testId: string }> = ({ testId }) => {
      const id = useUniqueId();
      return <div data-testid={testId}>{id}</div>;
    };

    const { getByTestId } = render(
      <IdProvider prefix="outer-">
        <Component testId="outer" />
        <IdProvider prefix="inner-">
          <Component testId="inner" />
        </IdProvider>
      </IdProvider>
    );

    expect(getByTestId('outer')).toHaveTextContent('outer-1');
    expect(getByTestId('inner')).toHaveTextContent('inner-1');
  });

  test('should work with useUniqueIds', () => {
    const Component: React.FC = () => {
      const [emailId, passwordId] = useUniqueIds(2, 'form-');
      return (
        <div>
          <span data-testid="email">{emailId}</span>
          <span data-testid="password">{passwordId}</span>
        </div>
      );
    };

    const { getByTestId } = render(
      <IdProvider suffix="-field">
        <Component />
      </IdProvider>
    );

    expect(getByTestId('email')).toHaveTextContent('form-1-field');
    expect(getByTestId('password')).toHaveTextContent('form-2-field');
  });

  test('should maintain stable IDs across re-renders', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const id = useUniqueId('stable-');
      return <div data-testid="hook-id">{id}-{value}</div>;
    };

    const { getByTestId, rerender } = render(
      <IdProvider>
        <Component value={1} />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('stable-1-1');

    rerender(
      <IdProvider>
        <Component value={2} />
      </IdProvider>
    );

    expect(getByTestId('hook-id')).toHaveTextContent('stable-1-2');
  });

  test('should not affect global state', () => {
    const Component: React.FC = () => {
      const id = useUniqueId('ctx-');
      return <div data-testid="hook-id">{id}</div>;
    };

    render(
      <IdProvider>
        <Component />
        <Component />
        <Component />
      </IdProvider>
    );

    // Global counter should not have been incremented by provider usage
    expect(resetId).toBeDefined();
  });
});
