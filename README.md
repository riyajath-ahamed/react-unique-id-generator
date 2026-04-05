# react-unique-id-generator

[![npm version](https://img.shields.io/npm/v/react-unique-id-generator.svg)](https://www.npmjs.com/package/react-unique-id-generator)
<!-- [![npm downloads](https://img.shields.io/npm/dm/react-unique-id-generator.svg)](https://www.npmjs.com/package/react-unique-id-generator) -->
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-unique-id-generator)](https://bundlephobia.com/package/react-unique-id-generator)
[![license](https://img.shields.io/npm/l/react-unique-id-generator.svg)](https://github.com/riyajath-ahamed/react-unique-id-generator/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)

A lightweight, zero-dependency library for generating unique, sequential IDs in React applications. Built for accessibility, form labeling, and any scenario that requires stable, unique element identifiers — with full control over prefixes, suffixes, and counter state.

## Why react-unique-id-generator?

React 18 ships a built-in `useId()` hook, but it has limitations:

| Feature | `react-unique-id-generator` | React `useId` |
|---|---|---|
| Custom prefix/suffix | Yes | No |
| Global prefix/suffix | Yes | No |
| Counter reset | Yes | No |
| Works in React 16+ | Yes | React 18+ only |
| Non-component usage | Yes | Hooks only |
| Predictable format | Yes (`prefix-1`) | Opaque (`:r0:`) |
| Zero runtime deps | Yes | Built-in |

Use this library when you need readable, predictable IDs with flexible formatting across any version of React.

## Features

- **Lightweight** — Minified bundles with zero runtime dependencies
- **Flexible** — Global and local prefix/suffix support for fine-grained ID control
- **React-friendly** — Works in components, utilities, and outside of hooks
- **TypeScript** — Fully typed with declaration files and source maps included
- **Well-tested** — Comprehensive test suite with 100% coverage
- **SSR-safe** — Compatible with both client-side and server-side rendering
- **Tree-shakeable** — ESM build with `sideEffects: false`; only ship what you use
- **Dual package** — Ships CommonJS (`require`) and ES module (`import`) builds

## Installation

```bash
npm install react-unique-id-generator
```

```bash
yarn add react-unique-id-generator
```

```bash
pnpm add react-unique-id-generator
```

## Quick Start

```tsx
import nextId from 'react-unique-id-generator';

function Field({ label }: { label: string }) {
  const id = nextId('field-');

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}
```

The same `id` value is used for both the `label` and the `input`, ensuring correct accessibility linkage every time.

## API Reference

### `nextId(localPrefix?: string | null): string`

Generates the next unique ID. Accepts an optional prefix that overrides the global prefix for that call only.

```tsx
nextId()           // "1"
nextId()           // "2"
nextId('input-')   // "input-3"
nextId('input-')   // "input-4"
```

### `generateId(prefix?: string, suffix?: string): string`

Generates the next ID with an explicit prefix and suffix, ignoring the global prefix/suffix.

```tsx
generateId('btn-', '-primary') // "btn-1-primary"
generateId('icon-')            // "icon-2"
generateId()                   // "3"
```

### `setGlobalPrefix(prefix: string): void`

Sets a prefix applied to every subsequent `nextId()` call (unless overridden locally).

```tsx
setGlobalPrefix('app-');
nextId(); // "app-1"
nextId(); // "app-2"
```

### `setGlobalSuffix(suffix: string): void`

Sets a suffix appended to every subsequent `nextId()` call.

```tsx
setGlobalSuffix('-id');
nextId(); // "1-id"
nextId(); // "2-id"
```

### `resetId(): void`

Resets the counter back to 0.

```tsx
nextId();   // "1"
nextId();   // "2"
resetId();
nextId();   // "1"
```

### `getCurrentId(): number`

Returns the current counter value without incrementing it.

```tsx
nextId();         // "1"
getCurrentId();   // 1
nextId();         // "2"
getCurrentId();   // 2
```

### `setId(id: number): void`

Sets the counter to a specific value. Negative values are clamped to 0; decimals are floored.

```tsx
setId(10);
nextId(); // "11"
```

## Usage Examples

### Accessible Form Fields

Linking a `<label>` to an `<input>` via `htmlFor` / `id` is critical for screen readers. Generate both from the same ID:

```tsx
import nextId from 'react-unique-id-generator';

function TextField({ label, type = 'text' }: { label: string; type?: string }) {
  const id = nextId('field-');

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

// Each instance gets its own unique ID
<TextField label="Email" type="email" />   // id="field-1"
<TextField label="Password" type="password" /> // id="field-2"
```

### Checkbox and Radio Groups

```tsx
import nextId from 'react-unique-id-generator';

function Checkbox({ label }: { label: string }) {
  const id = nextId('checkbox-');

  return (
    <div>
      <input type="checkbox" id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function RadioGroup({ name, options }: { name: string; options: string[] }) {
  return (
    <fieldset>
      {options.map((option) => {
        const id = nextId('radio-');
        return (
          <div key={id}>
            <input type="radio" id={id} name={name} value={option} />
            <label htmlFor={id}>{option}</label>
          </div>
        );
      })}
    </fieldset>
  );
}
```

### Full Form with Global Prefix

```tsx
import nextId, { setGlobalPrefix } from 'react-unique-id-generator';

function ContactForm() {
  setGlobalPrefix('contact-');

  const emailId   = nextId(); // "contact-1"
  const messageId = nextId(); // "contact-2"

  return (
    <form>
      <div>
        <label htmlFor={emailId}>Email</label>
        <input id={emailId} type="email" />
      </div>
      <div>
        <label htmlFor={messageId}>Message</label>
        <textarea id={messageId} />
      </div>
    </form>
  );
}
```

### Dynamic Lists

```tsx
import nextId from 'react-unique-id-generator';

function TodoList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => {
        const id = nextId('todo-');
        return (
          <li key={id}>
            <input type="checkbox" id={id} />
            <label htmlFor={id}>{item}</label>
          </li>
        );
      })}
    </ul>
  );
}
```

### ARIA Attributes

```tsx
import nextId from 'react-unique-id-generator';

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  const titleId       = nextId('modal-title-');
  const descriptionId = nextId('modal-desc-');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{children}</p>
    </div>
  );
}
```

### Section-Scoped IDs

Use `generateId` to generate IDs with a local prefix and suffix without affecting the global configuration:

```tsx
import { generateId } from 'react-unique-id-generator';

function Sidebar() {
  return (
    <nav>
      <a href="#" id={generateId('nav-', '-link')}>Home</a>
      <a href="#" id={generateId('nav-', '-link')}>About</a>
      <a href="#" id={generateId('nav-', '-link')}>Contact</a>
    </nav>
  );
}
```

## Framework Support

### Next.js (App Router / Pages Router)

Works in both server components (for ID generation) and client components:

```tsx
// app/components/Field.tsx
'use client';
import nextId from 'react-unique-id-generator';

export function Field({ label }: { label: string }) {
  const id = nextId('field-');
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
```

### Vite + React

No configuration needed — the ESM build is picked up automatically:

```tsx
import nextId from 'react-unique-id-generator';
```

### Create React App

```tsx
import nextId from 'react-unique-id-generator';
```

## TypeScript Support

The library is written in TypeScript and ships declaration files for all exports:

```tsx
import nextId, {
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId
} from 'react-unique-id-generator';

const id: string        = nextId();
const current: number   = getCurrentId();
```

No additional `@types` package is required.

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Building

```bash
npm run build
```

Produces:

```
dist/
├── index.cjs.js      # CommonJS bundle (minified)
├── index.cjs.js.map  # CJS source map
├── index.esm.js      # ES module bundle (minified, tree-shakeable)
├── index.esm.js.map  # ESM source map
├── index.d.ts        # Type declarations
└── index.d.ts.map    # Declaration source map
```

Watch mode for development:

```bash
npm run build:watch
```

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes and add tests for new functionality
4. Ensure all tests pass (`npm test`)
5. Submit a pull request

Bug reports and feature requests can be filed at the [issue tracker](https://github.com/riyajath-ahamed/react-unique-id-generator/issues).

## License

MIT License — see [LICENSE](LICENSE) for details.

## Changelog

### v1.3.0
- Migrated build toolchain from Webpack to `tsup` (esbuild-based)
- Added proper CommonJS build (`dist/index.cjs.js`)
- Added proper ES module build (`dist/index.esm.js`)
- Added minified production output for both formats
- Added `sideEffects: false` for tree-shaking support in consumer bundlers
- Added `build:watch` script for development
- Fixed `exports` map to correctly resolve CJS vs ESM per environment
- Updated CI to Node.js 18/20 (Node 14/16 are EOL)

### v1.2.1
- ESM support improvements
- TypeScript and Webpack configuration enhancements

### v1.1.1
- Added comprehensive test suite
- Improved TypeScript definitions
- Added new utility functions (`getCurrentId`, `setId`, `generateId`)
- Fixed build configuration
- Added proper npm package configuration
- Improved documentation and examples
