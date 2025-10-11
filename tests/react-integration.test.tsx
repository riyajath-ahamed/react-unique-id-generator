import React from 'react';
import { render } from '@testing-library/react';
import nextId, { resetId, setGlobalPrefix, setGlobalSuffix } from '../lib/index';

// Mock React components for testing
const TestComponent: React.FC<{ prefix?: string }> = ({ prefix }) => {
  return <div data-testid="test-component">{nextId(prefix)}</div>;
};

const MultipleIdComponent: React.FC = () => {
  return (
    <div>
      <div data-testid="id1">{nextId()}</div>
      <div data-testid="id2">{nextId()}</div>
      <div data-testid="id3">{nextId()}</div>
    </div>
  );
};

const GlobalConfigComponent: React.FC = () => {
  setGlobalPrefix('global-');
  setGlobalSuffix('-test');
  return <div data-testid="global-component">{nextId()}</div>;
};

describe('React Integration Tests', () => {
  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
  });

  describe('Basic React component integration', () => {
    test('should generate IDs in React components', () => {
      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('test-component')).toHaveTextContent('1');
    });

    test('should generate sequential IDs across multiple renders', () => {
      const { rerender, getByTestId } = render(<TestComponent />);
      expect(getByTestId('test-component')).toHaveTextContent('1');
      
      rerender(<TestComponent />);
      expect(getByTestId('test-component')).toHaveTextContent('2');
    });

    test('should handle local prefix in React components', () => {
      const { getByTestId } = render(<TestComponent prefix="local-" />);
      expect(getByTestId('test-component')).toHaveTextContent('local-1');
    });
  });

  describe('Multiple ID generation in single component', () => {
    test('should generate unique IDs for multiple elements', () => {
      const { getByTestId } = render(<MultipleIdComponent />);
      
      expect(getByTestId('id1')).toHaveTextContent('1');
      expect(getByTestId('id2')).toHaveTextContent('2');
      expect(getByTestId('id3')).toHaveTextContent('3');
    });
  });

  describe('Global configuration in React components', () => {
    test('should apply global prefix and suffix', () => {
      const { getByTestId } = render(<GlobalConfigComponent />);
      expect(getByTestId('global-component')).toHaveTextContent('global-1-test');
    });

    test('should maintain global configuration across components', () => {
      setGlobalPrefix('app-');
      setGlobalSuffix('-id');
      
      const { getByTestId: getByTestId1, unmount: unmount1 } = render(<TestComponent />);
      expect(getByTestId1('test-component')).toHaveTextContent('app-1-id');
      unmount1();
      
      const { getByTestId: getByTestId2 } = render(<TestComponent />);
      expect(getByTestId2('test-component')).toHaveTextContent('app-2-id');
    });
  });

  describe('Component lifecycle and ID management', () => {
    test('should handle component unmounting and remounting', () => {
      const { unmount, getByTestId } = render(<TestComponent />);
      expect(getByTestId('test-component')).toHaveTextContent('1');
      
      unmount();
      
      const { getByTestId: getByTestId2 } = render(<TestComponent />);
      expect(getByTestId2('test-component')).toHaveTextContent('2');
    });

    test('should reset IDs when resetId is called', () => {
      const { getByTestId, unmount } = render(<TestComponent />);
      expect(getByTestId('test-component')).toHaveTextContent('1');
      unmount();
      
      resetId();
      
      const { getByTestId: getByTestId2 } = render(<TestComponent />);
      expect(getByTestId2('test-component')).toHaveTextContent('1');
    });
  });

  describe('Complex React scenarios', () => {
    test('should work with conditional rendering', () => {
      const ConditionalComponent: React.FC<{ show: boolean }> = ({ show }) => {
        return (
          <div>
            {show && <div data-testid="conditional">{nextId()}</div>}
            <div data-testid="always">{nextId()}</div>
          </div>
        );
      };

      const { rerender, getByTestId } = render(<ConditionalComponent show={false} />);
      expect(getByTestId('always')).toHaveTextContent('1');
      
      rerender(<ConditionalComponent show={true} />);
      expect(getByTestId('conditional')).toHaveTextContent('2');
      expect(getByTestId('always')).toHaveTextContent('3');
    });

    test('should work with React fragments', () => {
      const FragmentComponent: React.FC = () => {
        return (
          <>
            <div data-testid="fragment1">{nextId()}</div>
            <div data-testid="fragment2">{nextId()}</div>
          </>
        );
      };

      const { getByTestId } = render(<FragmentComponent />);
      expect(getByTestId('fragment1')).toHaveTextContent('1');
      expect(getByTestId('fragment2')).toHaveTextContent('2');
    });

    test('should work with React.memo components', () => {
      const MemoComponent = React.memo(() => {
        return <div data-testid="memo">{nextId()}</div>;
      });

      const { getByTestId } = render(<MemoComponent />);
      expect(getByTestId('memo')).toHaveTextContent('1');
    });
  });

  describe('Performance and scalability', () => {
    test('should handle rapid ID generation', () => {
      const RapidComponent: React.FC = () => {
        const ids = Array.from({ length: 100 }, () => nextId());
        return (
          <div>
            {ids.map((id, index) => (
              <div key={index} data-testid={`rapid-${index}`}>
                {id}
              </div>
            ))}
          </div>
        );
      };

      const { getByTestId } = render(<RapidComponent />);
      
      // Check first and last few IDs
      expect(getByTestId('rapid-0')).toHaveTextContent('1');
      expect(getByTestId('rapid-1')).toHaveTextContent('2');
      expect(getByTestId('rapid-99')).toHaveTextContent('100');
    });
  });
});
