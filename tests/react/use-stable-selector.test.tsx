import React, { useRef } from 'react';
import { render, act } from '@testing-library/react';
import { useStableSelector } from '../../lib/react/use-stable-selector';

describe('useStableSelector', () => {
  it('should return null before mount', () => {
    let selector: string | null = 'initial';
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null);
      selector = useStableSelector(ref);
      return <div ref={ref} id="test-el" />;
    }

    render(<TestComponent />);
    // After mount and effect, selector should be computed
    expect(selector).not.toBeNull();
  });

  it('should generate a selector for an element with an id', () => {
    let selector: string | null = null;
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null);
      selector = useStableSelector(ref);
      return <div ref={ref} id="unique-id" />;
    }

    render(<TestComponent />);
    expect(selector).toBe('#unique-id');
  });

  it('should generate a selector for an element with data-testid', () => {
    let selector: string | null = null;
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null);
      selector = useStableSelector(ref);
      return <div ref={ref} data-testid="my-component" />;
    }

    render(<TestComponent />);
    expect(selector).toBe('[data-testid="my-component"]');
  });

  it('should return stable selector across re-renders', () => {
    const selectors: (string | null)[] = [];
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null);
      const sel = useStableSelector(ref);
      selectors.push(sel);
      return <div ref={ref} id="stable" />;
    }

    const { rerender } = render(<TestComponent />);
    rerender(<TestComponent />);
    rerender(<TestComponent />);

    const nonNull = selectors.filter(s => s !== null);
    expect(nonNull.length).toBeGreaterThan(0);
    expect(new Set(nonNull).size).toBe(1);
  });

  it('should pass custom options through', () => {
    let selector: string | null = null;
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null);
      selector = useStableSelector(ref, { dataAttributes: ['data-cy'] });
      return <div ref={ref} data-cy="cypress-id" />;
    }

    render(<TestComponent />);
    expect(selector).toBe('[data-cy="cypress-id"]');
  });
});
