import React, { useRef } from 'react';
import { render, waitFor } from '@testing-library/react';
import { generateSelector } from '../lib/selector';
import { useStableSelector } from '../lib/react/use-stable-selector';

function createDOM(html: string): { container: HTMLDivElement; cleanup: () => void } {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return {
    container,
    cleanup: () => document.body.removeChild(container),
  };
}

describe('generateSelector', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('ID selectors', () => {
    test('should select by id', () => {
      const { container, cleanup } = createDOM(
        '<button id="login-button">Login</button>'
      );
      const el = container.querySelector('#login-button')!;
      expect(generateSelector(el)).toBe('#login-button');
      cleanup();
    });

    test('should skip auto-generated IDs starting with colon', () => {
      const { container, cleanup } = createDOM(
        '<div id=":r0:">content</div>'
      );
      const el = container.querySelector('[id=":r0:"]')!;
      const selector = generateSelector(el);
      expect(selector).not.toContain(':r0:');
      cleanup();
    });

    test('should skip auto-generated IDs starting with digit', () => {
      const { container, cleanup } = createDOM(
        '<div id="123abc">content</div>'
      );
      const el = container.querySelector('[id="123abc"]')!;
      const selector = generateSelector(el);
      expect(selector).not.toBe('#123abc');
      cleanup();
    });

    test('should respect custom ignoreIdPattern', () => {
      const { container, cleanup } = createDOM(
        '<div id="ember-123">content</div>'
      );
      const el = container.querySelector('#ember-123')!;
      const selector = generateSelector(el, {
        ignoreIdPattern: /^ember-/,
      });
      expect(selector).not.toBe('#ember-123');
      cleanup();
    });
  });

  describe('data attribute selectors', () => {
    test('should select by data-testid', () => {
      const { container, cleanup } = createDOM(
        '<button data-testid="submit-btn">Submit</button>'
      );
      const el = container.querySelector('[data-testid="submit-btn"]')!;
      expect(generateSelector(el)).toBe('[data-testid="submit-btn"]');
      cleanup();
    });

    test('should select by data-cy', () => {
      const { container, cleanup } = createDOM(
        '<input data-cy="email-input" />'
      );
      const el = container.querySelector('[data-cy="email-input"]')!;
      expect(generateSelector(el)).toBe('[data-cy="email-input"]');
      cleanup();
    });

    test('should select by data-test-id', () => {
      const { container, cleanup } = createDOM(
        '<div data-test-id="card">content</div>'
      );
      const el = container.querySelector('[data-test-id="card"]')!;
      expect(generateSelector(el)).toBe('[data-test-id="card"]');
      cleanup();
    });

    test('should support custom dataAttributes', () => {
      const { container, cleanup } = createDOM(
        '<div data-qa="hero-section">content</div>'
      );
      const el = container.querySelector('[data-qa="hero-section"]')!;
      expect(
        generateSelector(el, { dataAttributes: ['data-qa'] })
      ).toBe('[data-qa="hero-section"]');
      cleanup();
    });

    test('should prefer id over data-testid', () => {
      const { container, cleanup } = createDOM(
        '<button id="submit" data-testid="submit-btn">Submit</button>'
      );
      const el = container.querySelector('#submit')!;
      expect(generateSelector(el)).toBe('#submit');
      cleanup();
    });
  });

  describe('role and aria selectors', () => {
    test('should select by role and aria-label', () => {
      const { container, cleanup } = createDOM(
        '<div role="button" aria-label="Close dialog">X</div>'
      );
      const el = container.querySelector('[role="button"]')!;
      expect(generateSelector(el)).toBe(
        '[role="button"][aria-label="Close dialog"]'
      );
      cleanup();
    });

    test('should select by role alone if unique', () => {
      const { container, cleanup } = createDOM(
        '<div role="navigation">nav</div>'
      );
      const el = container.querySelector('[role="navigation"]')!;
      expect(generateSelector(el)).toBe('[role="navigation"]');
      cleanup();
    });

    test('should distinguish multiple elements with same role via aria-label', () => {
      const { container, cleanup } = createDOM(`
        <div role="button" aria-label="Save">Save</div>
        <div role="button" aria-label="Cancel">Cancel</div>
      `);
      const el = container.querySelector('[aria-label="Save"]')!;
      expect(generateSelector(el)).toBe(
        '[role="button"][aria-label="Save"]'
      );
      cleanup();
    });
  });

  describe('tag + semantic attribute selectors', () => {
    test('should select input by name', () => {
      const { container, cleanup } = createDOM(
        '<form><input name="email" /><input name="password" /></form>'
      );
      const el = container.querySelector('input[name="email"]')!;
      expect(generateSelector(el)).toBe('input[name="email"]');
      cleanup();
    });

    test('should select link by href', () => {
      const { container, cleanup } = createDOM(
        '<a href="/about">About</a><a href="/contact">Contact</a>'
      );
      const el = container.querySelector('a[href="/about"]')!;
      expect(generateSelector(el)).toBe('a[href="/about"]');
      cleanup();
    });

    test('should select button by type', () => {
      const { container, cleanup } = createDOM(
        '<button type="submit">Go</button>'
      );
      const el = container.querySelector('button[type="submit"]')!;
      expect(generateSelector(el)).toBe('button[type="submit"]');
      cleanup();
    });

    test('should select image by alt', () => {
      const { container, cleanup } = createDOM(
        '<img alt="Logo" src="logo.png" />'
      );
      const el = container.querySelector('img[alt="Logo"]')!;
      expect(generateSelector(el)).toBe('img[alt="Logo"]');
      cleanup();
    });
  });

  describe('tag + class selectors', () => {
    test('should select by unique class', () => {
      const { container, cleanup } = createDOM(
        '<button class="submit-btn primary">Submit</button>'
      );
      const el = container.querySelector('.submit-btn')!;
      expect(generateSelector(el)).toBe('button.submit-btn');
      cleanup();
    });

    test('should use class pair when single class is not unique', () => {
      const { container, cleanup } = createDOM(`
        <button class="btn primary">Primary</button>
        <button class="primary">Other</button>
        <button class="btn secondary">Secondary</button>
      `);
      const primaryBtn = container.querySelector('button.btn.primary')!;
      const selector = generateSelector(primaryBtn);
      expect(selector).toBe('button.btn.primary');
      cleanup();
    });

    test('should filter classes matching ignoreClassPattern', () => {
      const { container, cleanup } = createDOM(
        '<div class="css-1a2b3c login-form">content</div>'
      );
      const el = container.querySelector('.login-form')!;
      const selector = generateSelector(el, {
        ignoreClassPattern: /^css-/,
      });
      expect(selector).toBe('div.login-form');
      cleanup();
    });
  });

  describe('landmark tag selectors', () => {
    test('should select unique nav element', () => {
      const { container, cleanup } = createDOM(
        '<nav><a href="/">Home</a></nav>'
      );
      const el = container.querySelector('nav')!;
      expect(generateSelector(el)).toBe('nav');
      cleanup();
    });

    test('should select unique main element', () => {
      const { container, cleanup } = createDOM(
        '<main>Main content</main>'
      );
      const el = container.querySelector('main')!;
      expect(generateSelector(el)).toBe('main');
      cleanup();
    });

    test('should select unique footer element', () => {
      const { container, cleanup } = createDOM(
        '<footer>Footer content</footer>'
      );
      const el = container.querySelector('footer')!;
      expect(generateSelector(el)).toBe('footer');
      cleanup();
    });
  });

  describe('ancestor scoping', () => {
    test('should scope with ancestor when element alone is not unique', () => {
      const { container, cleanup } = createDOM(`
        <div data-testid="login-form">
          <input type="text" />
          <button type="submit">Login</button>
        </div>
        <div data-testid="signup-form">
          <input type="text" />
          <button type="submit">Signup</button>
        </div>
      `);
      const loginInput = container.querySelector('[data-testid="login-form"] input')!;
      const selector = generateSelector(loginInput);
      expect(selector).toBe('[data-testid="login-form"] input[type="text"]');
      cleanup();
    });

    test('should use id ancestor for scoping', () => {
      const { container, cleanup } = createDOM(`
        <div id="sidebar"><span>info</span></div>
        <div id="content"><span>info</span></div>
      `);
      const el = container.querySelector('#sidebar span')!;
      const selector = generateSelector(el);
      expect(selector).toBe('#sidebar span');
      cleanup();
    });

    test('should respect maxDepth option', () => {
      const { container, cleanup } = createDOM(`
        <div id="deep">
          <div><div><div><div><span>target</span></div></div></div></div>
        </div>
      `);
      const el = container.querySelector('span')!;
      const selector = generateSelector(el, { maxDepth: 1 });
      expect(selector).not.toContain('#deep');
      cleanup();
    });
  });

  describe('best-effort fallback', () => {
    test('should return best-effort chain for deeply nested generic divs', () => {
      const { container, cleanup } = createDOM(`
        <div><div><div><div><div class="target">A</div></div></div></div></div>
        <div><div><div><div><div class="target">B</div></div></div></div></div>
      `);
      const el = container.querySelectorAll('.target')[0]!;
      const selector = generateSelector(el);
      expect(selector).toBeTruthy();
      expect(selector).not.toContain(':nth-child');
      expect(selector).not.toContain(':nth-of-type');
      cleanup();
    });

    test('should never produce nth-child selectors', () => {
      const { container, cleanup } = createDOM(`
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      `);
      const el = container.querySelectorAll('li')[1]!;
      const selector = generateSelector(el);
      expect(selector).not.toContain(':nth-child');
      expect(selector).not.toContain(':nth-of-type');
      cleanup();
    });
  });

  describe('root option', () => {
    test('should scope uniqueness checks to root element', () => {
      const { container, cleanup } = createDOM(`
        <div id="scope">
          <button class="action">Click</button>
        </div>
        <button class="action">Click</button>
      `);
      const scope = container.querySelector('#scope')!;
      const el = scope.querySelector('.action')!;
      const selector = generateSelector(el, { root: scope });
      expect(selector).toBe('button.action');
      cleanup();
    });
  });

  describe('special characters', () => {
    test('should escape special characters in attribute values', () => {
      const { container, cleanup } = createDOM(
        '<div data-testid="item[0]">content</div>'
      );
      const el = container.querySelector('[data-testid="item[0]"]')!;
      const selector = generateSelector(el);
      expect(selector).toContain('data-testid');
      expect(document.querySelectorAll(selector).length).toBe(1);
      cleanup();
    });

    test('should escape special characters in IDs', () => {
      const { container, cleanup } = createDOM(
        '<div id="my.component">content</div>'
      );
      const el = container.querySelector('[id="my.component"]')!;
      const selector = generateSelector(el);
      expect(selector).toBe('#my\\.component');
      expect(document.querySelectorAll(selector).length).toBe(1);
      cleanup();
    });
  });
});

describe('useStableSelector', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should return a selector after mount', async () => {
    const Component: React.FC = () => {
      const ref = useRef<HTMLButtonElement>(null);
      const selector = useStableSelector(ref);
      return (
        <div>
          <button ref={ref} data-testid="hook-btn">Click</button>
          <span data-testid="selector-output">{selector ?? ''}</span>
        </div>
      );
    };

    const { getByTestId } = render(<Component />);
    await waitFor(() => {
      expect(getByTestId('selector-output').textContent).toBe(
        '[data-testid="hook-btn"]'
      );
    });
  });

  test('should return stable selector across re-renders', async () => {
    const Component: React.FC<{ value: number }> = ({ value }) => {
      const ref = useRef<HTMLButtonElement>(null);
      const selector = useStableSelector(ref);
      return (
        <div>
          <button ref={ref} id="stable-btn">{value}</button>
          <span data-testid="selector-output">{selector ?? ''}</span>
        </div>
      );
    };

    const { getByTestId, rerender } = render(<Component value={1} />);
    await waitFor(() => {
      expect(getByTestId('selector-output').textContent).toBe('#stable-btn');
    });

    rerender(<Component value={2} />);
    expect(getByTestId('selector-output').textContent).toBe('#stable-btn');

    rerender(<Component value={3} />);
    expect(getByTestId('selector-output').textContent).toBe('#stable-btn');
  });

  test('should return null when ref is not set', () => {
    const Component: React.FC = () => {
      const ref = useRef<HTMLDivElement>(null);
      const selector = useStableSelector(ref);
      return (
        <div>
          <span data-testid="no-ref">no ref target</span>
          <span data-testid="selector-output">{selector ?? 'null'}</span>
        </div>
      );
    };

    const { getByTestId } = render(<Component />);
    expect(getByTestId('selector-output').textContent).toBe('null');
  });
});
