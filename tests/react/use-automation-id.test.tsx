import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useAutomationId, _resetFallbackManager } from '../../lib/react/use-automation-id';
import { IdManagerProvider } from '../../lib/react/context';
import { IdManager } from '../../lib/core/id-manager';

afterEach(() => {
  _resetFallbackManager();
});

describe('useAutomationId', () => {
  describe('with IdManagerProvider', () => {
    it('should generate a sequential automation ID', () => {
      const { result } = renderHook(
        () => useAutomationId('LoginButton'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('LoginButton-1');
    });

    it('should generate stable IDs across re-renders', () => {
      const { result, rerender } = renderHook(
        () => useAutomationId('LoginButton'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      const firstId = result.current;
      rerender();
      expect(result.current).toBe(firstId);
    });

    it('should increment counter for multiple components', () => {
      const manager = new IdManager();
      function TestComponent({ name }: { name: string }) {
        const id = useAutomationId(name);
        return <div data-testid={id}>{name}</div>;
      }

      render(
        <IdManagerProvider manager={manager}>
          <TestComponent name="Button" />
          <TestComponent name="Input" />
        </IdManagerProvider>
      );

      expect(screen.getByText('Button').getAttribute('data-testid')).toBe('Button-1');
      expect(screen.getByText('Input').getAttribute('data-testid')).toBe('Input-2');
    });

    it('should support kebab-case strategy', () => {
      const { result } = renderHook(
        () => useAutomationId('LoginButton', { strategy: 'kebab-case' }),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('login-button-1');
    });

    it('should support camelCase strategy', () => {
      const { result } = renderHook(
        () => useAutomationId('login-button', { strategy: 'camelCase' }),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('loginButton-1');
    });

    it('should support custom prefix and separator', () => {
      const { result } = renderHook(
        () => useAutomationId('Button', { prefix: 'qa_', separator: '__' }),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('qa_Button__1');
    });

    it('should support custom function strategy', () => {
      const customFn = (name: string, index: number) => `custom-${name}-${index}`;
      const { result } = renderHook(
        () => useAutomationId('Widget', { strategy: 'custom', customFn }),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('custom-Widget-1');
    });
  });

  describe('with reactId', () => {
    it('should use reactId as counter seed', () => {
      const { result } = renderHook(
        () => useAutomationId('Button', {}, ':r5:'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('Button-5');
    });

    it('should fall back to manager counter for unparseable reactId', () => {
      const { result } = renderHook(
        () => useAutomationId('Button', {}, 'not-a-number'),
        {
          wrapper: ({ children }) => (
            <IdManagerProvider>{children}</IdManagerProvider>
          ),
        }
      );
      expect(result.current).toBe('Button-1');
    });
  });

  describe('without IdManagerProvider', () => {
    it('should use fallback manager', () => {
      const { result } = renderHook(() => useAutomationId('Button'));
      expect(result.current).toBe('Button-1');
    });

    it('should share fallback manager across hooks', () => {
      const { result: r1 } = renderHook(() => useAutomationId('A'));
      const { result: r2 } = renderHook(() => useAutomationId('B'));
      expect(r1.current).toBe('A-1');
      expect(r2.current).toBe('B-2');
    });
  });
});
