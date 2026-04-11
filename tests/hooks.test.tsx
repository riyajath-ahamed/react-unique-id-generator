import React from 'react';
import { render } from '@testing-library/react';
import { useUniqueId, useUniqueIds } from '../lib/hooks';
import { resetId, setGlobalPrefix, setGlobalSuffix } from '../lib/nextId';

describe('useUniqueId', () => {
  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
  });

  test('should generate a unique ID', () => {
    const Component: React.FC = () => {
      const id = useUniqueId();
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('hook-id')).toHaveTextContent('1');
  });

  test('should generate an ID with a local prefix', () => {
    const Component: React.FC = () => {
      const id = useUniqueId('test-');
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('hook-id')).toHaveTextContent('test-1');
  });

  test('should return the same ID across re-renders', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const id = useUniqueId('stable-');
      return <div data-testid="hook-id">{id}-{value}</div>;
    };

    const { getByTestId, rerender } = render(<Component value={1} />);
    expect(getByTestId('hook-id')).toHaveTextContent('stable-1-1');

    rerender(<Component value={2} />);
    // ID should still be "stable-1", not "stable-2"
    expect(getByTestId('hook-id')).toHaveTextContent('stable-1-2');

    rerender(<Component value={3} />);
    expect(getByTestId('hook-id')).toHaveTextContent('stable-1-3');
  });

  test('should generate unique IDs for different component instances', () => {
    const Component: React.FC<{ testId: string }> = ({ testId }) => {
      const id = useUniqueId('comp-');
      return <div data-testid={testId}>{id}</div>;
    };

    const { getByTestId } = render(
      <div>
        <Component testId="first" />
        <Component testId="second" />
        <Component testId="third" />
      </div>
    );

    expect(getByTestId('first')).toHaveTextContent('comp-1');
    expect(getByTestId('second')).toHaveTextContent('comp-2');
    expect(getByTestId('third')).toHaveTextContent('comp-3');
  });

  test('should respect global suffix', () => {
    setGlobalSuffix('-suffix');

    const Component: React.FC = () => {
      const id = useUniqueId('item-');
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('hook-id')).toHaveTextContent('item-1-suffix');
  });

  test('should use global prefix when no local prefix is provided', () => {
    setGlobalPrefix('global-');

    const Component: React.FC = () => {
      const id = useUniqueId();
      return <div data-testid="hook-id">{id}</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('hook-id')).toHaveTextContent('global-1');
  });
});

describe('useUniqueIds', () => {
  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
  });

  test('should generate the requested number of IDs', () => {
    const Component: React.FC = () => {
      const ids = useUniqueIds(3);
      return (
        <div>
          {ids.map((id, i) => (
            <span key={id} data-testid={`id-${i}`}>{id}</span>
          ))}
        </div>
      );
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('id-0')).toHaveTextContent('1');
    expect(getByTestId('id-1')).toHaveTextContent('2');
    expect(getByTestId('id-2')).toHaveTextContent('3');
  });

  test('should generate IDs with a local prefix', () => {
    const Component: React.FC = () => {
      const ids = useUniqueIds(2, 'field-');
      return (
        <div>
          {ids.map((id, i) => (
            <span key={id} data-testid={`id-${i}`}>{id}</span>
          ))}
        </div>
      );
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('id-0')).toHaveTextContent('field-1');
    expect(getByTestId('id-1')).toHaveTextContent('field-2');
  });

  test('should return the same IDs across re-renders', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const [emailId, passwordId] = useUniqueIds(2, 'login-');
      return (
        <div>
          <span data-testid="email">{emailId}</span>
          <span data-testid="password">{passwordId}</span>
          <span data-testid="value">{value}</span>
        </div>
      );
    };

    const { getByTestId, rerender } = render(<Component value={1} />);
    expect(getByTestId('email')).toHaveTextContent('login-1');
    expect(getByTestId('password')).toHaveTextContent('login-2');

    rerender(<Component value={2} />);
    // IDs should remain stable
    expect(getByTestId('email')).toHaveTextContent('login-1');
    expect(getByTestId('password')).toHaveTextContent('login-2');
  });

  test('should work with form label/input pairs', () => {
    const FormField: React.FC = () => {
      const [emailId, passwordId] = useUniqueIds(2, 'form-');
      return (
        <form>
          <label htmlFor={emailId}>Email</label>
          <input id={emailId} data-testid="email-input" type="email" />
          <label htmlFor={passwordId}>Password</label>
          <input id={passwordId} data-testid="password-input" type="password" />
        </form>
      );
    };

    const { getByTestId } = render(<FormField />);
    expect(getByTestId('email-input').getAttribute('id')).toBe('form-1');
    expect(getByTestId('password-input').getAttribute('id')).toBe('form-2');
  });
});
