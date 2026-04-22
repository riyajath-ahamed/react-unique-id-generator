import React from 'react';
import { render } from '@testing-library/react';
import {
  generateAutomationId,
  resetAutomationCounter,
  useAutomationId,
  AutomationIdPool,
} from '../lib/automation';

describe('generateAutomationId', () => {
  beforeEach(() => {
    resetAutomationCounter();
  });

  test('should generate sequential automation IDs', () => {
    expect(generateAutomationId('Button')).toBe('Button-1');
    expect(generateAutomationId('Button')).toBe('Button-2');
    expect(generateAutomationId('Input')).toBe('Input-3');
  });

  test('should apply prefix', () => {
    expect(generateAutomationId('Button', { prefix: 'test-' })).toBe('test-Button-1');
  });

  test('should use custom separator', () => {
    expect(generateAutomationId('Button', { separator: '_' })).toBe('Button_1');
  });

  test('should convert to kebab-case', () => {
    expect(generateAutomationId('MyButton', { strategy: 'kebab-case' })).toBe('my-button-1');
    expect(generateAutomationId('UserProfileCard', { strategy: 'kebab-case' })).toBe('user-profile-card-2');
  });

  test('should convert to camelCase', () => {
    expect(generateAutomationId('my-button', { strategy: 'camelCase' })).toBe('myButton-1');
    expect(generateAutomationId('user_profile_card', { strategy: 'camelCase' })).toBe('userProfileCard-2');
  });

  test('should use custom function', () => {
    const customFn = (name: string, index: number) => `custom_${name}_${index}`;
    expect(generateAutomationId('Button', { strategy: 'custom', customFn })).toBe('custom_Button_1');
  });

  test('should throw when custom strategy has no customFn', () => {
    expect(() => generateAutomationId('Button', { strategy: 'custom' })).toThrow(
      'customFn is required'
    );
  });

  test('should combine prefix with kebab-case', () => {
    expect(
      generateAutomationId('MyComponent', {
        strategy: 'kebab-case',
        prefix: 'qa-',
        separator: '--',
      })
    ).toBe('qa-my-component--1');
  });
});

describe('useAutomationId', () => {
  beforeEach(() => {
    resetAutomationCounter();
  });

  test('should generate a stable automation ID', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const testId = useAutomationId('LoginButton');
      return <button data-testid={testId}>{value}</button>;
    };

    const { getByTestId, rerender } = render(<Component value={1} />);
    expect(getByTestId('LoginButton-1')).toBeInTheDocument();

    rerender(<Component value={2} />);
    expect(getByTestId('LoginButton-1')).toBeInTheDocument();
  });

  test('should generate unique IDs for different components', () => {
    const ButtonA: React.FC = () => {
      const testId = useAutomationId('Submit');
      return <button data-testid={testId}>A</button>;
    };

    const ButtonB: React.FC = () => {
      const testId = useAutomationId('Cancel');
      return <button data-testid={testId}>B</button>;
    };

    const { getByTestId } = render(
      <div>
        <ButtonA />
        <ButtonB />
      </div>
    );

    expect(getByTestId('Submit-1')).toBeInTheDocument();
    expect(getByTestId('Cancel-2')).toBeInTheDocument();
  });

  test('should support kebab-case strategy', () => {
    const Component: React.FC = () => {
      const testId = useAutomationId('UserProfile', { strategy: 'kebab-case' });
      return <div data-testid={testId}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('user-profile-1')).toBeInTheDocument();
  });
});

describe('AutomationIdPool', () => {
  test('should pre-allocate IDs', () => {
    const pool = new AutomationIdPool(3, 'Button');
    expect(pool.size).toBe(3);
  });

  test('should acquire IDs in order', () => {
    const pool = new AutomationIdPool(3, 'btn');
    expect(pool.acquire()).toBe('btn-1');
    expect(pool.acquire()).toBe('btn-2');
    expect(pool.acquire()).toBe('btn-3');
  });

  test('should auto-expand when pool is exhausted', () => {
    const pool = new AutomationIdPool(2, 'item');
    pool.acquire(); // item-1
    pool.acquire(); // item-2
    expect(pool.acquire()).toBe('item-3');
  });

  test('should reuse released IDs', () => {
    const pool = new AutomationIdPool(3, 'btn');
    const id1 = pool.acquire();
    pool.acquire();
    pool.release(id1);

    expect(pool.acquire()).toBe(id1);
  });

  test('should support kebab-case strategy', () => {
    const pool = new AutomationIdPool(2, 'MyButton', { strategy: 'kebab-case' });
    expect(pool.acquire()).toBe('my-button-1');
    expect(pool.acquire()).toBe('my-button-2');
  });

  test('should support prefix option', () => {
    const pool = new AutomationIdPool(2, 'btn', { prefix: 'qa-' });
    expect(pool.acquire()).toBe('qa-btn-1');
    expect(pool.acquire()).toBe('qa-btn-2');
  });

  test('should drain all IDs', () => {
    const pool = new AutomationIdPool(5, 'item');
    pool.acquire();
    pool.drain();
    expect(pool.size).toBe(0);
  });

  test('should generate new IDs after drain', () => {
    const pool = new AutomationIdPool(2, 'item');
    pool.drain();
    expect(pool.acquire()).toBe('item-3');
  });
});
