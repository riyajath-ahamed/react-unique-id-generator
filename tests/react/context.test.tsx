import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { IdManagerProvider, useIdManager } from '../../lib/react/context';
import { IdManager } from '../../lib/core/id-manager';

describe('IdManagerProvider', () => {
  it('should provide an auto-created IdManager to children', () => {
    const { result } = renderHook(() => useIdManager(), {
      wrapper: ({ children }) => (
        <IdManagerProvider>{children}</IdManagerProvider>
      ),
    });
    expect(result.current).toBeInstanceOf(IdManager);
  });

  it('should use the provided manager instance', () => {
    const manager = new IdManager({ automationStart: 42 });
    const { result } = renderHook(() => useIdManager(), {
      wrapper: ({ children }) => (
        <IdManagerProvider manager={manager}>{children}</IdManagerProvider>
      ),
    });
    expect(result.current).toBe(manager);
    expect(result.current!.getAutomationCounter()).toBe(42);
  });

  it('should return null without a provider', () => {
    const { result } = renderHook(() => useIdManager());
    expect(result.current).toBeNull();
  });

  it('should pass options to auto-created manager', () => {
    const { result } = renderHook(() => useIdManager(), {
      wrapper: ({ children }) => (
        <IdManagerProvider options={{ automationStart: 10 }}>
          {children}
        </IdManagerProvider>
      ),
    });
    expect(result.current!.getAutomationCounter()).toBe(10);
  });

  it('should provide independent managers for nested providers', () => {
    let outerManager: IdManager | null = null;
    let innerManager: IdManager | null = null;

    function OuterConsumer() {
      outerManager = useIdManager();
      return null;
    }

    function InnerConsumer() {
      innerManager = useIdManager();
      return null;
    }

    render(
      <IdManagerProvider>
        <OuterConsumer />
        <IdManagerProvider>
          <InnerConsumer />
        </IdManagerProvider>
      </IdManagerProvider>
    );

    expect(outerManager).toBeInstanceOf(IdManager);
    expect(innerManager).toBeInstanceOf(IdManager);
    expect(outerManager).not.toBe(innerManager);
  });

  it('should preserve the same manager across re-renders', () => {
    const managers: (IdManager | null)[] = [];
    function Consumer() {
      managers.push(useIdManager());
      return null;
    }

    const { rerender } = render(
      <IdManagerProvider>
        <Consumer />
      </IdManagerProvider>
    );

    rerender(
      <IdManagerProvider>
        <Consumer />
      </IdManagerProvider>
    );

    expect(managers[0]).toBe(managers[1]);
  });
});
