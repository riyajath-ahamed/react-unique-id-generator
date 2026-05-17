import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  IdManager,
  createIdManager,
  IdManagerProvider,
  useAutomationId,
  useIdWithStrategy,
  generateAutomationId,
  generateIdWithStrategy,
  numericStrategy,
  zeroPaddedStrategy,
  CollisionDetector,
  generateSelector,
} from '../lib/index';
import { _resetFallbackManager as resetAutoFallback } from '../lib/react/use-automation-id';
import { _resetFallbackManager as resetStratFallback } from '../lib/react/use-id-with-strategy';

afterEach(() => {
  resetAutoFallback();
  resetStratFallback();
});

describe('Integration: IdManagerProvider with hooks', () => {
  it('should share state across hooks via provider', () => {
    function AutoComp() {
      const id = useAutomationId('Auto');
      return <span data-testid="auto">{id}</span>;
    }

    function StratComp() {
      const id = useIdWithStrategy(numericStrategy, 'strat-');
      return <span data-testid="strat">{id}</span>;
    }

    render(
      <IdManagerProvider>
        <AutoComp />
        <StratComp />
      </IdManagerProvider>
    );

    expect(screen.getByTestId('auto').textContent).toBe('Auto-1');
    expect(screen.getByTestId('strat').textContent).toBe('strat-1');
  });

  it('should isolate state between separate providers', () => {
    function AutoComp() {
      const id = useAutomationId('Btn');
      return <span data-testid={id}>{id}</span>;
    }

    const { container } = render(
      <div>
        <IdManagerProvider>
          <AutoComp />
        </IdManagerProvider>
        <IdManagerProvider>
          <AutoComp />
        </IdManagerProvider>
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans[0].textContent).toBe('Btn-1');
    expect(spans[1].textContent).toBe('Btn-1');
  });

  it('should allow injecting a pre-configured manager', () => {
    const manager = new IdManager({ automationStart: 99 });

    function Comp() {
      const id = useAutomationId('Item');
      return <span data-testid="item">{id}</span>;
    }

    render(
      <IdManagerProvider manager={manager}>
        <Comp />
      </IdManagerProvider>
    );

    expect(screen.getByTestId('item').textContent).toBe('Item-100');
  });
});

describe('Integration: standalone usage (no React)', () => {
  it('should work with createIdManager for automation IDs', () => {
    const manager = createIdManager();
    expect(generateAutomationId(manager, 'Button')).toBe('Button-1');
    expect(generateAutomationId(manager, 'Input')).toBe('Input-2');
    manager.resetAutomationCounter();
    expect(generateAutomationId(manager, 'Reset')).toBe('Reset-1');
  });

  it('should work with createIdManager for strategy IDs', () => {
    const manager = createIdManager();
    expect(generateIdWithStrategy(manager, numericStrategy, 'a-')).toBe('a-1');
    expect(generateIdWithStrategy(manager, zeroPaddedStrategy(4), 'b-')).toBe('b-0002');
  });

  it('should support collision detection via manager', () => {
    const manager = createIdManager({ collision: { action: 'throw' } });
    const detector = manager.collisionDetector;
    detector.register('unique-1');
    expect(() => detector.register('unique-1')).toThrow('collision detected');
  });

  it('should reset all state at once', () => {
    const manager = createIdManager();
    manager.nextAutomationCounter();
    manager.nextStrategyCounter();
    manager.collisionDetector.register('id-1');

    manager.reset();

    expect(manager.getAutomationCounter()).toBe(0);
    expect(manager.getStrategyCounter()).toBe(0);
    expect(manager.collisionDetector.size).toBe(0);
  });
});

describe('Integration: generateSelector with DOM', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should generate selectors for elements in a React-rendered tree', () => {
    function App() {
      return (
        <div id="app-root">
          <button data-testid="action-btn">Click me</button>
        </div>
      );
    }

    render(<App />);
    const btn = document.querySelector('[data-testid="action-btn"]')!;
    expect(generateSelector(btn)).toBe('[data-testid="action-btn"]');
  });
});

describe('Integration: CollisionDetector standalone', () => {
  it('should work independently of IdManager', () => {
    const detector = new CollisionDetector({ action: 'skip' });
    expect(detector.register('a')).toBe(true);
    expect(detector.register('b')).toBe(true);
    expect(detector.register('a')).toBe(false);
    expect(detector.collisions).toBe(1);
  });
});

describe('Integration: main barrel exports', () => {
  it('should export all expected items', () => {
    expect(IdManager).toBeDefined();
    expect(createIdManager).toBeDefined();
    expect(IdManagerProvider).toBeDefined();
    expect(useAutomationId).toBeDefined();
    expect(useIdWithStrategy).toBeDefined();
    expect(generateAutomationId).toBeDefined();
    expect(generateIdWithStrategy).toBeDefined();
    expect(numericStrategy).toBeDefined();
    expect(zeroPaddedStrategy).toBeDefined();
    expect(CollisionDetector).toBeDefined();
    expect(generateSelector).toBeDefined();
  });
});
