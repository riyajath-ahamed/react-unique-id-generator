import { useState, useEffect, useRef as useReactRef } from 'react';

export interface SelectorOptions {
  root?: Element;
  dataAttributes?: string[];
  maxDepth?: number;
  ignoreIdPattern?: RegExp;
  ignoreClassPattern?: RegExp;
}

type RefObject<T> = { readonly current: T | null };

const DEFAULT_DATA_ATTRIBUTES = ['data-testid', 'data-test-id', 'data-cy'];
const DEFAULT_IGNORE_ID_PATTERN = /^[:.]|^\d/;
const DEFAULT_MAX_DEPTH = 5;
const SEMANTIC_ATTRIBUTES = ['name', 'type', 'href', 'for', 'aria-label', 'placeholder', 'alt', 'title'];
const LANDMARK_TAGS = new Set(['header', 'main', 'nav', 'footer', 'aside', 'article', 'section']);

function escapeCSS(value: string): string {
  return value.replace(/([\\!"#$%&'()*+,.:;<=>?@[\]^`{|}~])/g, '\\$1');
}

function isUnique(selector: string, root: Element | Document): boolean {
  try {
    return root.querySelectorAll(selector).length === 1;
  } catch {
    return false;
  }
}

function getRoot(options: SelectorOptions): Element | Document {
  return options.root ?? document;
}

function tryIdSelector(
  element: Element,
  root: Element | Document,
  ignorePattern: RegExp,
): string | null {
  const id = element.id;
  if (!id || ignorePattern.test(id)) return null;
  const selector = `#${escapeCSS(id)}`;
  if (isUnique(selector, root)) return selector;
  return null;
}

function tryDataAttributeSelectors(
  element: Element,
  root: Element | Document,
  dataAttributes: string[],
): string | null {
  for (const attr of dataAttributes) {
    const value = element.getAttribute(attr);
    if (!value) continue;
    const selector = `[${attr}="${escapeCSS(value)}"]`;
    if (isUnique(selector, root)) return selector;
  }
  return null;
}

function tryRoleSelector(
  element: Element,
  root: Element | Document,
): string | null {
  const role = element.getAttribute('role');
  if (!role) return null;

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    const selector = `[role="${escapeCSS(role)}"][aria-label="${escapeCSS(ariaLabel)}"]`;
    if (isUnique(selector, root)) return selector;
  }

  const selector = `[role="${escapeCSS(role)}"]`;
  if (isUnique(selector, root)) return selector;

  return null;
}

function trySemanticAttributeSelectors(
  element: Element,
  root: Element | Document,
): string | null {
  const tag = element.tagName.toLowerCase();

  for (const attr of SEMANTIC_ATTRIBUTES) {
    const value = element.getAttribute(attr);
    if (!value) continue;
    const selector = `${tag}[${attr}="${escapeCSS(value)}"]`;
    if (isUnique(selector, root)) return selector;
  }

  return null;
}

function tryClassSelectors(
  element: Element,
  root: Element | Document,
  ignorePattern?: RegExp,
): string | null {
  const classes = Array.from(element.classList).filter(
    (c) => !ignorePattern || !ignorePattern.test(c),
  );
  if (classes.length === 0) return null;

  const tag = element.tagName.toLowerCase();

  for (const cls of classes) {
    const selector = `${tag}.${escapeCSS(cls)}`;
    if (isUnique(selector, root)) return selector;
  }

  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const selector = `${tag}.${escapeCSS(classes[i])}.${escapeCSS(classes[j])}`;
      if (isUnique(selector, root)) return selector;
    }
  }

  return null;
}

function tryLandmarkSelector(
  element: Element,
  root: Element | Document,
): string | null {
  const tag = element.tagName.toLowerCase();
  if (!LANDMARK_TAGS.has(tag)) return null;
  if (isUnique(tag, root)) return tag;
  return null;
}

function getBestSelectorForElement(
  element: Element,
  root: Element | Document,
  options: SelectorOptions,
): string | null {
  const ignoreId = options.ignoreIdPattern ?? DEFAULT_IGNORE_ID_PATTERN;
  const dataAttrs = options.dataAttributes ?? DEFAULT_DATA_ATTRIBUTES;

  return (
    tryIdSelector(element, root, ignoreId) ??
    tryDataAttributeSelectors(element, root, dataAttrs) ??
    tryRoleSelector(element, root) ??
    trySemanticAttributeSelectors(element, root) ??
    tryClassSelectors(element, root, options.ignoreClassPattern) ??
    tryLandmarkSelector(element, root)
  );
}

function getPartialSelector(
  element: Element,
  options: SelectorOptions,
): string {
  const ignoreId = options.ignoreIdPattern ?? DEFAULT_IGNORE_ID_PATTERN;
  const dataAttrs = options.dataAttributes ?? DEFAULT_DATA_ATTRIBUTES;

  if (element.id && !ignoreId.test(element.id)) {
    return `#${escapeCSS(element.id)}`;
  }

  for (const attr of dataAttrs) {
    const value = element.getAttribute(attr);
    if (value) return `[${attr}="${escapeCSS(value)}"]`;
  }

  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  if (role && ariaLabel) {
    return `[role="${escapeCSS(role)}"][aria-label="${escapeCSS(ariaLabel)}"]`;
  }
  if (role) return `[role="${escapeCSS(role)}"]`;

  const tag = element.tagName.toLowerCase();

  for (const attr of SEMANTIC_ATTRIBUTES) {
    const value = element.getAttribute(attr);
    if (value) return `${tag}[${attr}="${escapeCSS(value)}"]`;
  }

  const classes = Array.from(element.classList).filter(
    (c) => !options.ignoreClassPattern || !options.ignoreClassPattern.test(c),
  );
  if (classes.length > 0) {
    return `${tag}.${classes.map(escapeCSS).join('.')}`;
  }

  return tag;
}

export function generateSelector(
  element: Element,
  options: SelectorOptions = {},
): string {
  const root = getRoot(options);
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;

  const direct = getBestSelectorForElement(element, root, options);
  if (direct) return direct;

  let current: Element | null = element.parentElement;
  let depth = 0;
  const targetPartial = getPartialSelector(element, options);

  while (current && current !== root && depth < maxDepth) {
    const ancestorUnique = getBestSelectorForElement(current, root, options);
    if (ancestorUnique) {
      const combined = `${ancestorUnique} ${targetPartial}`;
      if (isUnique(combined, root)) return combined;
    }

    const ancestorPartial = getPartialSelector(current, options);
    const combined = `${ancestorPartial} ${targetPartial}`;
    if (isUnique(combined, root)) return combined;

    current = current.parentElement;
    depth++;
  }

  current = element.parentElement;
  depth = 0;
  const chain: string[] = [targetPartial];

  while (current && current !== root && depth < maxDepth) {
    const part = getPartialSelector(current, options);
    chain.unshift(part);
    const combined = chain.join(' ');
    if (isUnique(combined, root)) return combined;
    current = current.parentElement;
    depth++;
  }

  return chain.join(' ');
}

export function useStableSelector(
  ref: RefObject<Element | null>,
  options: SelectorOptions = {},
): string | null {
  const [selector, setSelector] = useState<string | null>(null);
  const computedRef = useReactRef(false);

  useEffect(() => {
    if (ref.current && !computedRef.current) {
      computedRef.current = true;
      setSelector(generateSelector(ref.current, options));
    }
  });

  return selector;
}

export function resetSelectorCache(): void {
  // No module-level state to reset — included for API consistency.
}
