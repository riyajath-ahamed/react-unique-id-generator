import React from 'react';
import { render } from '@testing-library/react';
import {
  generateDelimitedId,
  useDelimitedId,
  resetDelimiterCounter,
  getDelimiterCounter,
} from '../lib/delimiter';
import { IdProvider } from '../lib/context';

describe('generateDelimitedId', () => {
  beforeEach(() => {
    resetDelimiterCounter();
  });

  test('should generate IDs with default delimiter', () => {
    expect(generateDelimitedId({ prefix: 'btn' })).toBe('btn-1');
    expect(generateDelimitedId({ prefix: 'btn' })).toBe('btn-2');
  });

  test('should generate IDs with custom delimiter', () => {
    expect(generateDelimitedId({ prefix: 'field', delimiter: '_' })).toBe('field_1');
    expect(generateDelimitedId({ prefix: 'field', delimiter: '__' })).toBe('field__2');
  });

  test('should generate IDs with prefix and suffix', () => {
    expect(generateDelimitedId({ prefix: 'app', suffix: 'input', delimiter: '::' }))
      .toBe('app::1::input');
  });

  test('should generate IDs without prefix or suffix', () => {
    expect(generateDelimitedId()).toBe('1');
    expect(generateDelimitedId({})).toBe('2');
  });

  test('should generate IDs with only suffix', () => {
    expect(generateDelimitedId({ suffix: 'end' })).toBe('1-end');
  });

  test('should generate IDs with dot delimiter', () => {
    expect(generateDelimitedId({ prefix: 'com', suffix: 'widget', delimiter: '.' }))
      .toBe('com.1.widget');
  });

  test('should generate IDs with slash delimiter', () => {
    expect(generateDelimitedId({ prefix: 'path', suffix: 'item', delimiter: '/' }))
      .toBe('path/1/item');
  });

  test('should increment counter', () => {
    generateDelimitedId();
    generateDelimitedId();
    generateDelimitedId();
    expect(getDelimiterCounter()).toBe(3);
  });
});

describe('useDelimitedId', () => {
  beforeEach(() => {
    resetDelimiterCounter();
  });

  test('should generate a delimited ID with default delimiter', () => {
    const Component: React.FC = () => {
      const id = useDelimitedId('section');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('section-1')).toBeInTheDocument();
  });

  test('should generate a delimited ID with custom delimiter', () => {
    const Component: React.FC = () => {
      const id = useDelimitedId('module', '.');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('module.1')).toBeInTheDocument();
  });

  test('should generate a delimited ID with prefix, delimiter, and suffix', () => {
    const Component: React.FC = () => {
      const id = useDelimitedId('form', '__', 'field');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('form__1__field')).toBeInTheDocument();
  });

  test('should generate stable ID across rerenders', () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const id = useDelimitedId('item', '-');
      return <div data-testid={id}>{value}</div>;
    };

    const { getByTestId, rerender } = render(<Component value={1} />);
    expect(getByTestId('item-1')).toBeInTheDocument();

    rerender(<Component value={2} />);
    expect(getByTestId('item-1')).toBeInTheDocument();
  });

  test('should generate unique IDs for different components', () => {
    const CompA: React.FC = () => {
      const id = useDelimitedId('a', '.');
      return <span data-testid={id}>A</span>;
    };
    const CompB: React.FC = () => {
      const id = useDelimitedId('b', '.');
      return <span data-testid={id}>B</span>;
    };

    const { getByTestId } = render(
      <div>
        <CompA />
        <CompB />
      </div>
    );

    expect(getByTestId('a.1')).toBeInTheDocument();
    expect(getByTestId('b.2')).toBeInTheDocument();
  });

  test('should work without prefix', () => {
    const Component: React.FC = () => {
      const id = useDelimitedId('', '-', 'end');
      return <div data-testid={id}>content</div>;
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('1-end')).toBeInTheDocument();
  });

  test('should work with IdProvider', () => {
    const Component: React.FC = () => {
      const id = useDelimitedId('ctx', '::');
      return <div data-testid={id}>content</div>;
    };

    const { container } = render(
      <IdProvider prefix="provided-">
        <Component />
      </IdProvider>
    );

    const div = container.querySelector('div[data-testid]')!;
    expect(div.getAttribute('data-testid')).toMatch(/ctx::\d+/);
  });
});

describe('resetDelimiterCounter', () => {
  test('should reset the counter', () => {
    generateDelimitedId();
    generateDelimitedId();
    expect(getDelimiterCounter()).toBe(2);

    resetDelimiterCounter();
    expect(getDelimiterCounter()).toBe(0);

    expect(generateDelimitedId({ prefix: 'reset' })).toBe('reset-1');
  });
});
