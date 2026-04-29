<p align="center">
 <img src="assets\icon\id-button_1f194.png" width="120" />
 </p>
 
<h1 align="center">react-unique-id-generator</h1>

<p align="center">
  <strong>Unique IDs for React. Readable. Predictable. SSR-safe.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-unique-id-generator"><img src="https://img.shields.io/npm/v/react-unique-id-generator.svg" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/react-unique-id-generator"><img src="https://img.shields.io/bundlephobia/minzip/react-unique-id-generator" alt="bundle size"></a>
  <a href="https://github.com/riyajath-ahamed/react-unique-id-generator/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/react-unique-id-generator.svg" alt="license"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-ready-blue.svg" alt="TypeScript"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#provider-api">Provider</a> &bull;
  <a href="#hooks">Hooks</a> &bull;
  <a href="#server-side-rendering">SSR</a> &bull;
  <a href="#automation-testing">Automation</a> &bull;
  <a href="#custom-id-strategies">Strategies</a> &bull;
  <a href="#collision-detection">Collision Detection</a> &bull;
  <a href="#id-pool-management">Pools</a> &bull;
  <a href="#custom-delimiters">Delimiters</a> &bull;
  <a href="#migration-guide-v1x-to-v20">Migration</a>
</p>

---

A lightweight, zero-dependency library for generating unique, sequential IDs in React applications. Built for accessibility, form labeling, SSR hydration, and automated testing - with full control over prefixes, suffixes, and counter state. Works with React 16.8+ and supports both client-side and server-side rendering out of the box.

## The Problem

React 18's `useId()` gives you opaque IDs like `:r0:`, `:r1:`. You can't customize them, can't scope them, and can't use them outside components. On the server, global counters leak between requests.

**This library fixes all of that.**

## Before / After

<table>
<tr>
<td width="50%">

### React useId

```tsx
function Form() {
  const id = useId();          // ":r0:" - what?
  return <input id={id} />;   // no prefix, no control
}
```

</td>
<td width="50%">

### react-unique-id-generator

```tsx
function Form() {
  const id = useUniqueId('email-');  // "email-1" - readable
  return <input id={id} />;         // full control
}
```

</td>
</tr>
<tr>
<td>

### Global state (v1.x)

```tsx
// Leaks across SSR requests
setGlobalPrefix('app-');
nextId(); // "app-1"
// Another request sees "app-2" ...
```

</td>
<td>

### Provider-scoped (v2.0)

```tsx
// Each provider = isolated counter
<IdProvider prefix="app-">
  <Component />  {/* "app-1" */}
</IdProvider>
// Clean. No leaks. SSR-safe.
```

</td>
</tr>
</table>

```
+---------------------------------------------+
|  ZERO DEPENDENCIES          ============ 0  |
|  SSR-SAFE ISOLATION         ======== Yes    |
|  REACT VERSION SUPPORT      ======== 16.8+  |
|  AUTOMATION STRATEGIES      ======== 4      |
|  ID GENERATION STRATEGIES   ======== 4      |
|  COLLISION DETECTION        ======== Yes    |
|  ID POOL MANAGEMENT         ======== Yes    |
|  CUSTOM DELIMITERS          ======== Yes    |
|  TEST COVERAGE              ======== 100%   |
|  BUNDLE SIZE                ======== Tiny   |
+---------------------------------------------+
```

## Why react-unique-id-generator?

| Feature | `react-unique-id-generator` | React `useId` |
|---|---|---|
| Custom prefix/suffix | Yes | No |
| Provider-scoped IDs | Yes (v2.0) | No |
| SSR-safe with isolation | Yes (v2.0) | Partial |
| Automation test IDs | Yes (v2.0) | No |
| Server ID manager | Yes (v2.0) | No |
| Custom generation strategies | Yes (v2.2) | No |
| Collision detection | Yes (v2.2) | No |
| ID pool management | Yes (v2.2) | No |
| Custom delimiters | Yes (v2.2) | No |
| SSR request-scoped provider | Yes (v2.2) | No |
| Counter reset | Yes | No |
| Works in React 16+ | Yes | React 18+ only |
| Non-component usage | Yes | Hooks only |
| Predictable format | Yes (`prefix-1`) | Opaque (`:r0:`) |
| Zero runtime deps | Yes | Built-in |

## Features

- **Provider-scoped** - Isolate ID counters per subtree with `<IdProvider>` for SSR safety
- **SSR-safe** - Dedicated server ID manager and `<SSRProvider>` prevent cross-request state leaks
- **Custom strategies** - Plug in your own ID format with the `IdStrategy` interface, or use built-in numeric, zero-padded, timestamp, and hash strategies
- **Collision detection** - Track generated IDs and detect duplicates with configurable warn/throw/skip actions
- **ID pools** - Pre-allocate IDs for high-throughput scenarios with acquire/release semantics
- **Custom delimiters** - Join prefix, counter, and suffix with any delimiter (`.`, `::`, `__`, etc.)
- **Automation-ready** - Generate deterministic `data-testid` values with multiple naming strategies
- **Lightweight** - Minified bundles with zero runtime dependencies
- **Flexible** - Global and local prefix/suffix support for fine-grained ID control
- **React-friendly** - Works in components, utilities, and outside of hooks
- **TypeScript** - Fully typed with declaration files and source maps included
- **Well-tested** - Comprehensive test suite with 100% coverage
- **Tree-shakeable** - ESM build with `sideEffects: false`; only ship what you use
- **Dual package** - Ships CommonJS (`require`) and ES module (`import`) builds

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

---

## Quick Start

### Provider-based approach (recommended)

Wrap your app (or a subtree) in `<IdProvider>` for scoped, SSR-safe ID generation:

```tsx
import { IdProvider, useUniqueId } from 'react-unique-id-generator';

function App() {
  return (
    <IdProvider prefix="app-">
      <Form />
    </IdProvider>
  );
}

function Form() {
  const emailId = useUniqueId('email-');
  const passwordId = useUniqueId('password-');

  return (
    <form>
      <label htmlFor={emailId}>Email</label>
      <input id={emailId} type="email" />
      <label htmlFor={passwordId}>Password</label>
      <input id={passwordId} type="password" />
    </form>
  );
}
```

### Simple approach (legacy)

For quick, non-SSR usage you can still call `nextId` directly:

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

---

## API Reference

### Provider API

#### `<IdProvider>`

React context provider that scopes ID state (counter, prefix, suffix) to its subtree. Each provider maintains an independent counter, preventing ID collisions between different parts of your app or across SSR requests.

```tsx
import { IdProvider } from 'react-unique-id-generator';
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `prefix` | `string` | `""` | Prefix applied to all IDs generated within the provider |
| `suffix` | `string` | `""` | Suffix appended to all IDs generated within the provider |
| `startId` | `number` | `0` | Initial counter value (the first ID will be `startId + 1`) |
| `children` | `ReactNode` | - | Child components that can consume the provider |

**Basic usage:**

```tsx
<IdProvider prefix="app-" suffix="-id">
  <YourComponent />
</IdProvider>
```

**Nested providers** create independent scopes - each maintains its own counter:

```tsx
<IdProvider prefix="page-">
  <Header />          {/* useUniqueId() => "page-1" */}
  <IdProvider prefix="modal-">
    <ModalContent />  {/* useUniqueId() => "modal-1" */}
  </IdProvider>
  <Footer />          {/* useUniqueId() => "page-2" */}
</IdProvider>
```

**Parallel providers** are fully isolated from each other:

```tsx
<div>
  <IdProvider prefix="sidebar-">
    <NavItem />   {/* "sidebar-1" */}
    <NavItem />   {/* "sidebar-2" */}
  </IdProvider>
  <IdProvider prefix="main-">
    <Card />      {/* "main-1" */}
    <Card />      {/* "main-2" */}
  </IdProvider>
</div>
```

#### `useIdContext(): IdContextValue | null`

Access the current provider's context value. Returns `null` when called outside a provider.

```tsx
import { useIdContext } from 'react-unique-id-generator';

function DebugIds() {
  const ctx = useIdContext();
  if (!ctx) return <p>No provider found</p>;
  return <p>Current prefix: {ctx.prefix}</p>;
}
```

---

### Hooks

#### `useUniqueId(localPrefix?: string): string`

Generates a **stable** unique ID for a component instance. The ID is created once on mount and remains the same across re-renders. When used inside an `<IdProvider>`, the ID is scoped to that provider. When used outside a provider, it falls back to global state.

```tsx
import { useUniqueId } from 'react-unique-id-generator';

function MyComponent() {
  const id = useUniqueId('my-input-');
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <input id={id} />
    </div>
  );
}
```

The `localPrefix` argument overrides the provider's prefix for that hook call:

```tsx
<IdProvider prefix="form-">
  <Input />  {/* useUniqueId()         => "form-1" */}
  <Input />  {/* useUniqueId('email-') => "email-2" */}
</IdProvider>
```

#### `useUniqueIds(count: number, localPrefix?: string): string[]`

Generates multiple stable unique IDs at once. Useful for forms with several labeled elements.

```tsx
import { useUniqueIds } from 'react-unique-id-generator';

function LoginForm() {
  const [emailId, passwordId] = useUniqueIds(2, 'login-');
  return (
    <form>
      <label htmlFor={emailId}>Email</label>
      <input id={emailId} type="email" />
      <label htmlFor={passwordId}>Password</label>
      <input id={passwordId} type="password" />
    </form>
  );
}
```

---

### Server-Side Rendering

#### `createServerIdManager(options?): ServerIdManager`

Creates an isolated ID manager for server-side rendering. Each request should create its own manager to prevent ID leaks between concurrent requests.

```tsx
import { createServerIdManager } from 'react-unique-id-generator';
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `prefix` | `string` | `""` | Default prefix for generated IDs |
| `suffix` | `string` | `""` | Default suffix for generated IDs |
| `startId` | `number` | `0` | Initial counter value |

**ServerIdManager methods:**

| Method | Returns | Description |
|---|---|---|
| `nextId(localPrefix?)` | `string` | Generate the next ID, optionally overriding the prefix |
| `resetId()` | `void` | Reset the counter to 0 |
| `getCurrentId()` | `number` | Get the current counter value |
| `setId(id)` | `void` | Set the counter to a specific value |

**Example - Express middleware:**

```ts
import { createServerIdManager } from 'react-unique-id-generator';

app.get('*', (req, res) => {
  const idManager = createServerIdManager({ prefix: 'ssr-' });

  const id1 = idManager.nextId();         // "ssr-1"
  const id2 = idManager.nextId();         // "ssr-2"
  const id3 = idManager.nextId('nav-');   // "nav-3"

  // Render your app using the manager...
});
```

**Example - Next.js API route / server action:**

```ts
import { createServerIdManager } from 'react-unique-id-generator';

export async function generatePageIds() {
  const ids = createServerIdManager({ prefix: 'page-', suffix: '-el' });

  return {
    heroId: ids.nextId(),      // "page-1-el"
    contentId: ids.nextId(),   // "page-2-el"
    footerId: ids.nextId(),    // "page-3-el"
  };
}
```

Each call to `createServerIdManager` produces a fully independent instance - no shared state, no cross-request collisions.

---

### Automation Testing

Tools for generating deterministic, human-readable IDs for `data-testid` attributes and other testing scenarios.

**Pick your naming strategy:**

<table>
<tr>
<td width="25%">

#### sequential

```ts
"Button-1"
"Button-2"
```

</td>
<td width="25%">

#### kebab-case

```ts
"user-profile-1"
"user-profile-2"
```

</td>
<td width="25%">

#### camelCase

```ts
"myButton-1"
"myButton-2"
```

</td>
<td width="25%">

#### custom

```ts
"e2e__Btn__1"
"e2e__Btn__2"
```

</td>
</tr>
</table>

#### `generateAutomationId(componentName, options?): string`

Generate a single automation ID with a naming strategy.

```tsx
import { generateAutomationId } from 'react-unique-id-generator';

generateAutomationId('Button')                                    // "Button-1"
generateAutomationId('UserProfile', { strategy: 'kebab-case' })   // "user-profile-2"
generateAutomationId('myButton', { strategy: 'camelCase' })       // "myButton-3"
generateAutomationId('Btn', { prefix: 'qa-', separator: '_' })   // "qa-Btn_4"
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `strategy` | `'sequential' \| 'kebab-case' \| 'camelCase' \| 'custom'` | `'sequential'` | Naming strategy for the component name |
| `prefix` | `string` | `""` | Prefix prepended to the ID |
| `separator` | `string` | `"-"` | Separator between the name and counter |
| `customFn` | `(name: string, index: number) => string` | - | Custom ID generator (required for `'custom'` strategy) |

**Custom strategy example:**

```ts
generateAutomationId('LoginForm', {
  strategy: 'custom',
  customFn: (name, index) => `e2e__${name}__${index}`,
});
// => "e2e__LoginForm__1"
```

#### `useAutomationId(componentName, options?): string`

React hook version of `generateAutomationId`. Returns a stable automation ID that persists across re-renders.

```tsx
import { useAutomationId } from 'react-unique-id-generator';

function SubmitButton() {
  const testId = useAutomationId('SubmitButton', { strategy: 'kebab-case' });
  return <button data-testid={testId}>Submit</button>;
  // => <button data-testid="submit-button-1">Submit</button>
}
```

#### `AutomationIdPool`

Pre-allocates a pool of automation IDs for better performance in large applications with many test IDs.

```ts
import { AutomationIdPool } from 'react-unique-id-generator';

const pool = new AutomationIdPool(100, 'component', {
  strategy: 'kebab-case',
  prefix: 'test-',
});

const id1 = pool.acquire();   // "test-component-1"
const id2 = pool.acquire();   // "test-component-2"

pool.release(id1);             // Return id1 to the pool for reuse
const id3 = pool.acquire();   // "test-component-1" (reused)
```

**Constructor:**

```ts
new AutomationIdPool(poolSize: number, componentName?: string, options?: AutomationIdOptions)
```

**Methods:**

| Method | Returns | Description |
|---|---|---|
| `acquire()` | `string` | Get the next available ID (auto-expands if exhausted) |
| `release(id)` | `void` | Return an ID to the pool for reuse |
| `drain()` | `void` | Clear all available and released IDs |
| `size` | `number` | Number of available + released IDs in the pool |

#### `resetAutomationCounter(): void`

Resets the global automation counter to 0. Useful in test setup.

```ts
import { resetAutomationCounter } from 'react-unique-id-generator';

beforeEach(() => {
  resetAutomationCounter();
});
```

---

### Custom ID Strategies

Define how IDs are formatted using the `IdStrategy` interface. Swap strategies without changing your component code.

#### `IdStrategy` interface

```ts
interface IdStrategy {
  generate(prefix: string, suffix: string, counter: number): string;
}
```

#### Built-in strategies

<table>
<tr>
<td width="25%">

**numericStrategy**

```ts
"btn-1"
"btn-2"
```

</td>
<td width="25%">

**zeroPaddedStrategy(4)**

```ts
"btn-0001"
"btn-0002"
```

</td>
<td width="25%">

**timestampStrategy**

```ts
"ts-1714300000000-1"
"ts-1714300000001-2"
```

</td>
<td width="25%">

**hashStrategy**

```ts
"h-a3f2b1c0"
"h-7e4d9f12"
```

</td>
</tr>
</table>

#### `generateIdWithStrategy(strategy, prefix?, suffix?): string`

Generate an ID using a strategy outside of React components.

```ts
import {
  generateIdWithStrategy,
  numericStrategy,
  zeroPaddedStrategy,
  hashStrategy,
} from 'react-unique-id-generator';

generateIdWithStrategy(numericStrategy, 'item-')        // "item-1"
generateIdWithStrategy(zeroPaddedStrategy(4), 'id-')    // "id-0002"
generateIdWithStrategy(hashStrategy, 'h-')              // "h-a3f2b1c0"
```

#### `useIdWithStrategy(strategy, prefix?, suffix?): string`

React hook that generates a stable ID using the given strategy. The ID persists across re-renders.

```tsx
import { useIdWithStrategy, zeroPaddedStrategy } from 'react-unique-id-generator';

function OrderItem() {
  const id = useIdWithStrategy(zeroPaddedStrategy(6), 'order-');
  return <div id={id}>...</div>;
  // => <div id="order-000001">...</div>
}
```

#### Writing a custom strategy

```ts
import { generateIdWithStrategy } from 'react-unique-id-generator';
import type { IdStrategy } from 'react-unique-id-generator';

const base36Strategy: IdStrategy = {
  generate(prefix, suffix, counter) {
    return `${prefix}${counter.toString(36)}${suffix}`;
  },
};

generateIdWithStrategy(base36Strategy, 'x-')  // "x-1", "x-2", ... "x-a", "x-b"
```

#### `resetStrategyCounter(): void`

Resets the strategy counter to 0. Useful in test setup.

---

### Collision Detection

Track generated IDs and detect duplicates. Useful for debugging, testing, or enforcing ID uniqueness across your app.

#### `CollisionDetector`

```ts
import { CollisionDetector } from 'react-unique-id-generator';

const detector = new CollisionDetector({ action: 'throw' });

detector.register('input-1');  // true - registered
detector.register('input-2');  // true - registered
detector.register('input-1');  // throws Error: ID collision detected
```

**Constructor options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `action` | `'warn' \| 'throw' \| 'skip'` | `'warn'` | What to do when a collision is detected |
| `maxSize` | `number` | `100000` | Maximum registry size before warning |

**Methods:**

| Method | Returns | Description |
|---|---|---|
| `register(id)` | `boolean` | Register an ID. Returns `false` on collision |
| `has(id)` | `boolean` | Check if an ID is registered |
| `unregister(id)` | `boolean` | Remove an ID from the registry |
| `clear()` | `void` | Clear all registrations and reset collision count |
| `getRegisteredIds()` | `string[]` | Get all registered IDs |
| `size` | `number` | Number of registered IDs |
| `collisions` | `number` | Total number of collisions detected |

#### `checkCollision(id, action?): boolean`

Convenience function using a global singleton detector. Returns `true` if the ID was registered successfully, `false` on collision.

```ts
import { checkCollision, resetGlobalCollisionDetector } from 'react-unique-id-generator';

checkCollision('field-1');          // true
checkCollision('field-1', 'skip');  // false (duplicate)
checkCollision('field-1', 'throw'); // throws Error

// Reset between tests
resetGlobalCollisionDetector();
```

---

### ID Pool Management

Pre-allocate IDs for high-throughput scenarios. The `IdPool` class is a generic pool (distinct from `AutomationIdPool` which is automation-specific).

#### `IdPool`

```ts
import { IdPool } from 'react-unique-id-generator';

const pool = new IdPool(100, { prefix: 'widget-', suffix: '-el' });

const id1 = pool.acquire();  // "widget-1-el"
const id2 = pool.acquire();  // "widget-2-el"

pool.release(id1);           // Return to pool for reuse
pool.acquire();              // "widget-1-el" (reused)
```

**Constructor:**

```ts
new IdPool(size: number, options?: IdPoolOptions)
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `prefix` | `string` | `""` | Prefix for generated IDs |
| `suffix` | `string` | `""` | Suffix for generated IDs |
| `autoRefill` | `boolean` | `true` | Auto-generate new IDs when pool is exhausted |
| `generator` | `(index: number) => string` | - | Custom ID generator function |

**Methods:**

| Method | Returns | Description |
|---|---|---|
| `acquire()` | `string` | Get the next available ID (reuses released IDs first) |
| `release(id)` | `void` | Return an ID to the pool for reuse |
| `drain()` | `void` | Clear all available and released IDs |
| `refill(count)` | `void` | Add more pre-generated IDs to the pool |
| `size` | `number` | Number of available + released IDs |
| `totalGenerated` | `number` | Total IDs ever generated by this pool |

**Custom generator example:**

```ts
const pool = new IdPool(50, {
  generator: (i) => `session-${Date.now()}-${i}`,
});
```

#### `useIdPool(size, prefix?): () => string`

React hook that pre-generates a pool of IDs and returns an `acquire` function. The pool is stable across re-renders.

```tsx
import { useIdPool } from 'react-unique-id-generator';

function DynamicList() {
  const acquireId = useIdPool(20, 'item-');

  return items.map((item) => (
    <li key={acquireId()} id={acquireId()}>
      {item.name}
    </li>
  ));
}
```

---

### SSR Utilities

Enhanced server-side rendering support beyond `createServerIdManager`. These utilities provide React context-based isolation and request-scoped ID namespacing.

#### `<SSRProvider>`

A React context provider that scopes IDs per server request. Use the `requestId` prop to namespace IDs for deterministic, collision-free SSR output.

```tsx
import { SSRProvider, useSSRSafeId } from 'react-unique-id-generator';

// Server render (e.g., Next.js, Remix)
function App({ requestId }: { requestId: string }) {
  return (
    <SSRProvider requestId={requestId} prefix="app-" suffix="-el">
      <Form />
    </SSRProvider>
  );
}

function Form() {
  const emailId = useSSRSafeId('email-');
  const passId = useSSRSafeId('pass-');
  return (
    <form>
      <label htmlFor={emailId}>Email</label>
      <input id={emailId} />
      <label htmlFor={passId}>Password</label>
      <input id={passId} />
    </form>
  );
  // emailId => "email-req123-1-el"
  // passId  => "pass-req123-2-el"
}
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `prefix` | `string` | `""` | Default prefix for IDs |
| `suffix` | `string` | `""` | Suffix appended to all IDs |
| `requestId` | `string` | - | Request identifier for namespacing (e.g., a short UUID) |
| `children` | `ReactNode` | - | Child components |

#### `useSSRSafeId(prefix?): string`

React hook for generating IDs inside an `<SSRProvider>`. Falls back to a timestamp-based ID outside a provider (with a dev warning).

#### `useSSRContext(): SSRContextValue | null`

Access the SSR provider context directly. Returns `null` outside an `<SSRProvider>`.

#### `createSSRIdFactory(requestId, prefix?, suffix?)`

Non-React factory for server-side ID generation with request scoping. Each factory is fully independent.

```ts
import { createSSRIdFactory } from 'react-unique-id-generator';

app.get('*', (req, res) => {
  const ids = createSSRIdFactory(req.id, 'ssr-');

  const headerId = ids.nextId();     // "ssr-abc123-1"
  const contentId = ids.nextId();    // "ssr-abc123-2"

  ids.resetId();                     // Reset for reuse
  ids.getCurrentId();                // 0
});
```

---

### Custom Delimiters

Control how prefix, counter, and suffix are joined. By default, the library concatenates parts directly (`prefix + counter + suffix`). The delimiter API lets you specify any separator.

#### `generateDelimitedId(options?): string`

Generate an ID with parts joined by a custom delimiter.

```ts
import { generateDelimitedId } from 'react-unique-id-generator';

generateDelimitedId({ prefix: 'app', delimiter: '.' })
// "app.1"

generateDelimitedId({ prefix: 'com', suffix: 'widget', delimiter: '.' })
// "com.2.widget"

generateDelimitedId({ prefix: 'ns', suffix: 'item', delimiter: '::' })
// "ns::3::item"

generateDelimitedId({ prefix: 'path', suffix: 'el', delimiter: '/' })
// "path/4/el"
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `prefix` | `string` | `""` | Prefix part (omitted from output if empty) |
| `suffix` | `string` | `""` | Suffix part (omitted from output if empty) |
| `delimiter` | `string` | `"-"` | Separator between parts |

#### `useDelimitedId(prefix?, delimiter?, suffix?): string`

React hook version. Returns a stable delimited ID across re-renders.

```tsx
import { useDelimitedId } from 'react-unique-id-generator';

function Widget() {
  const id = useDelimitedId('widget', '.', 'container');
  return <div id={id}>...</div>;
  // => <div id="widget.1.container">...</div>
}
```

#### `resetDelimiterCounter(): void`

Resets the delimiter counter to 0. Useful in test setup.

---

### Legacy Functions

> These functions use global state and are still fully functional. In v2.0, they emit a one-time deprecation warning in development mode, recommending migration to `<IdProvider>` for SSR safety.

#### `nextId(localPrefix?: string | null): string`

Generates the next unique ID. Accepts an optional prefix that overrides the global prefix for that call only.

```tsx
nextId()           // "1"
nextId()           // "2"
nextId('input-')   // "input-3"
nextId('input-')   // "input-4"
```

#### `generateId(prefix?: string, suffix?: string): string`

Generates the next ID with an explicit prefix and suffix, ignoring the global prefix/suffix.

```tsx
generateId('btn-', '-primary') // "btn-1-primary"
generateId('icon-')            // "icon-2"
generateId()                   // "3"
```

#### `setGlobalPrefix(prefix: string): void`

Sets a prefix applied to every subsequent `nextId()` call (unless overridden locally).

```tsx
setGlobalPrefix('app-');
nextId(); // "app-1"
nextId(); // "app-2"
```

> **Deprecated in v2.0** - Use `<IdProvider prefix="app-">` instead.

#### `setGlobalSuffix(suffix: string): void`

Sets a suffix appended to every subsequent `nextId()` call.

```tsx
setGlobalSuffix('-id');
nextId(); // "1-id"
nextId(); // "2-id"
```

> **Deprecated in v2.0** - Use `<IdProvider suffix="-id">` instead.

#### `resetId(): void`

Resets the counter back to 0.

```tsx
nextId();   // "1"
nextId();   // "2"
resetId();
nextId();   // "1"
```

#### `getCurrentId(): number`

Returns the current counter value without incrementing it.

```tsx
nextId();         // "1"
getCurrentId();   // 1
```

#### `setId(id: number): void`

Sets the counter to a specific value. Negative values are clamped to 0; decimals are floored.

```tsx
setId(10);
nextId(); // "11"
```

---

## Usage Examples

### Accessible Form Fields

Linking a `<label>` to an `<input>` via `htmlFor` / `id` is critical for screen readers. Use the provider for SSR-safe ID generation:

```tsx
import { IdProvider, useUniqueId } from 'react-unique-id-generator';

function TextField({ label, type = 'text' }: { label: string; type?: string }) {
  const id = useUniqueId('field-');
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

function App() {
  return (
    <IdProvider>
      <TextField label="Email" type="email" />       {/* id="field-1" */}
      <TextField label="Password" type="password" /> {/* id="field-2" */}
    </IdProvider>
  );
}
```

### Checkbox and Radio Groups

```tsx
import { IdProvider, useUniqueId } from 'react-unique-id-generator';

function Checkbox({ label }: { label: string }) {
  const id = useUniqueId('checkbox-');
  return (
    <div>
      <input type="checkbox" id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function RadioGroup({ name, options }: { name: string; options: string[] }) {
  return (
    <IdProvider prefix="radio-">
      <fieldset>
        {options.map((option) => (
          <RadioOption key={option} name={name} option={option} />
        ))}
      </fieldset>
    </IdProvider>
  );
}

function RadioOption({ name, option }: { name: string; option: string }) {
  const id = useUniqueId();
  return (
    <div>
      <input type="radio" id={id} name={name} value={option} />
      <label htmlFor={id}>{option}</label>
    </div>
  );
}
```

### ARIA Attributes

```tsx
import { useUniqueIds } from 'react-unique-id-generator';

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  const [titleId, descriptionId] = useUniqueIds(2, 'modal-');

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

### SSR with Per-Request Isolation

```ts
import { createServerIdManager } from 'react-unique-id-generator';

// Express middleware
app.get('*', (req, res) => {
  const ids = createServerIdManager({ prefix: 'ssr-' });

  // Each request gets its own counter - no cross-request leaks
  const headerId = ids.nextId();    // "ssr-1"
  const contentId = ids.nextId();   // "ssr-2"

  const html = renderToString(
    <Layout headerId={headerId} contentId={contentId} />
  );

  res.send(html);
});
```

### Automation Testing with data-testid

```tsx
import { useAutomationId } from 'react-unique-id-generator';

function LoginPage() {
  const formId = useAutomationId('LoginForm', { strategy: 'kebab-case' });
  const submitId = useAutomationId('SubmitButton', { strategy: 'kebab-case' });

  return (
    <form data-testid={formId}>
      {/* ... */}
      <button data-testid={submitId} type="submit">Log in</button>
    </form>
  );
  // => data-testid="login-form-1"
  // => data-testid="submit-button-2"
}
```

### Pre-Allocated ID Pool for Large Apps

```ts
import { AutomationIdPool } from 'react-unique-id-generator';

// Pre-allocate 500 IDs at startup
const testIdPool = new AutomationIdPool(500, 'widget', {
  strategy: 'kebab-case',
  prefix: 'e2e-',
});

// Acquire IDs as components mount
function Widget() {
  const testId = testIdPool.acquire();
  return <div data-testid={testId}>...</div>;
}
```

### Custom Strategy for Structured IDs

```tsx
import { useIdWithStrategy } from 'react-unique-id-generator';
import type { IdStrategy } from 'react-unique-id-generator';

const bemStrategy: IdStrategy = {
  generate(prefix, suffix, counter) {
    return `${prefix}__element-${counter}${suffix ? `--${suffix}` : ''}`;
  },
};

function Card() {
  const id = useIdWithStrategy(bemStrategy, 'card', 'active');
  return <div id={id}>...</div>;
  // => <div id="card__element-1--active">...</div>
}
```

### Collision-Safe ID Generation

```ts
import { CollisionDetector, generateIdWithStrategy, numericStrategy } from 'react-unique-id-generator';

const detector = new CollisionDetector({ action: 'throw' });

function safeGenerateId(prefix: string): string {
  const id = generateIdWithStrategy(numericStrategy, prefix);
  detector.register(id);  // Throws if duplicate
  return id;
}
```

### Dynamic List with ID Pool

```tsx
import { useIdPool } from 'react-unique-id-generator';

function TodoList({ items }: { items: string[] }) {
  const acquireId = useIdPool(items.length, 'todo-');

  return (
    <ul>
      {items.map((item) => {
        const id = acquireId();
        return (
          <li key={id}>
            <label htmlFor={id}>{item}</label>
            <input id={id} type="checkbox" />
          </li>
        );
      })}
    </ul>
  );
}
```

### SSR with Request-Scoped IDs

```tsx
import { SSRProvider, useSSRSafeId } from 'react-unique-id-generator';

// Server handler (e.g., Next.js, Express)
function handleRequest(requestId: string) {
  return renderToString(
    <SSRProvider requestId={requestId} prefix="app-">
      <Page />
    </SSRProvider>
  );
  // IDs: "app-abc123-1", "app-abc123-2", ...
  // Each request gets unique, deterministic IDs
}

function Page() {
  const headerId = useSSRSafeId('header-');
  const contentId = useSSRSafeId('content-');
  return (
    <div>
      <header id={headerId}>...</header>
      <main id={contentId}>...</main>
    </div>
  );
}
```

### Dot-Delimited Namespace IDs

```tsx
import { useDelimitedId } from 'react-unique-id-generator';

function Widget({ section }: { section: string }) {
  const id = useDelimitedId(section, '.', 'widget');
  return <div id={id}>...</div>;
  // useDelimitedId('sidebar', '.', 'widget') => "sidebar.1.widget"
  // useDelimitedId('header', '.', 'widget')  => "header.2.widget"
}
```

---

## Migration Guide (v1.x to v2.0)

<table>
<tr>
<td width="50%">

### Before (v1.x)

```tsx
import nextId, {
  setGlobalPrefix,
  setGlobalSuffix
} from 'react-unique-id-generator';

setGlobalPrefix('app-');
setGlobalSuffix('-id');

function MyComponent() {
  const id = nextId();
  return <input id={id} />;
}
```

</td>
<td width="50%">

### After (v2.0)

```tsx
import {
  IdProvider,
  useUniqueId
} from 'react-unique-id-generator';

function App() {
  return (
    <IdProvider prefix="app-" suffix="-id">
      <MyComponent />
    </IdProvider>
  );
}

function MyComponent() {
  const id = useUniqueId();
  return <input id={id} />;
}
```

</td>
</tr>
</table>

### Step 1: Wrap your app in `<IdProvider>`

```diff
+ import { IdProvider } from 'react-unique-id-generator';

  function App() {
    return (
+     <IdProvider>
        <YourApp />
+     </IdProvider>
    );
  }
```

### Step 2: Replace global prefix/suffix with provider props

```diff
- import { setGlobalPrefix, setGlobalSuffix } from 'react-unique-id-generator';
- setGlobalPrefix('app-');
- setGlobalSuffix('-id');

+ <IdProvider prefix="app-" suffix="-id">
+   <YourApp />
+ </IdProvider>
```

### Step 3: Use hooks inside components (already compatible)

If you are already using `useUniqueId` and `useUniqueIds`, no changes are needed - they automatically detect the provider and use its scoped state.

### What still works

All legacy functions (`nextId`, `setGlobalPrefix`, `setGlobalSuffix`, `resetId`, `getCurrentId`, `setId`, `generateId`) continue to work in v2.0. They will emit a one-time deprecation warning in development mode. The backward compatibility layer will be maintained for 6 months.

---

## Framework Support

### Next.js (App Router / Pages Router)

Use `<IdProvider>` in your root layout for SSR-safe IDs:

```tsx
// app/layout.tsx
import { IdProvider } from 'react-unique-id-generator';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <IdProvider prefix="app-">{children}</IdProvider>
      </body>
    </html>
  );
}
```

For server-side ID generation (API routes, server actions), use `createServerIdManager`:

```ts
import { createServerIdManager } from 'react-unique-id-generator';

export async function GET() {
  const ids = createServerIdManager({ prefix: 'api-' });
  // ...
}
```

### Vite + React

No configuration needed - the ESM build is picked up automatically:

```tsx
import { IdProvider, useUniqueId } from 'react-unique-id-generator';
```

### Create React App

```tsx
import { IdProvider, useUniqueId } from 'react-unique-id-generator';
```

---

## TypeScript Support

The library is written in TypeScript and ships declaration files for all exports:

```tsx
import {
  IdProvider,
  useUniqueId,
  useUniqueIds,
  useIdContext,
  createServerIdManager,
  generateAutomationId,
  useAutomationId,
  AutomationIdPool,

  // v2.2.0
  generateIdWithStrategy,
  useIdWithStrategy,
  numericStrategy,
  zeroPaddedStrategy,
  timestampStrategy,
  hashStrategy,
  CollisionDetector,
  checkCollision,
  IdPool,
  useIdPool,
  SSRProvider,
  useSSRSafeId,
  useSSRContext,
  createSSRIdFactory,
  generateDelimitedId,
  useDelimitedId,
} from 'react-unique-id-generator';

import type {
  IdProviderProps,
  IdContextValue,
  ServerIdManager,
  ServerIdManagerOptions,
  AutomationIdStrategy,
  AutomationIdOptions,

  // v2.2.0
  IdStrategy,
  CollisionAction,
  CollisionDetectorOptions,
  IdPoolOptions,
  SSRContextValue,
  SSRProviderProps,
  DelimitedIdOptions,
} from 'react-unique-id-generator';
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
  index.cjs.js      # CommonJS bundle (minified)
  index.cjs.js.map  # CJS source map
  index.esm.js      # ES module bundle (minified, tree-shakeable)
  index.esm.js.map  # ESM source map
  index.d.ts        # Type declarations
  index.d.ts.map    # Declaration source map
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

MIT License - see [LICENSE](LICENSE) for details.

---

## Changelog

### v2.2.0

**New Features:**

- **New**: Custom ID generation strategies - `IdStrategy` interface with built-in `numericStrategy`, `zeroPaddedStrategy`, `timestampStrategy`, and `hashStrategy`
- **New**: `generateIdWithStrategy()` and `useIdWithStrategy()` - Generate IDs with pluggable formatting strategies
- **New**: `CollisionDetector` class - Track generated IDs and detect duplicates with configurable actions (`warn`, `throw`, `skip`)
- **New**: `checkCollision()` - Convenience function using a global singleton collision detector
- **New**: `IdPool` class - Generic ID pool with acquire/release/drain/refill, custom generators, and auto-refill
- **New**: `useIdPool()` hook - Pre-generate a pool of IDs and return an acquire function for React components
- **New**: `<SSRProvider>` - React context provider with `requestId` prop for per-request ID namespacing
- **New**: `useSSRSafeId()` - Hook for SSR-safe IDs with fallback outside provider
- **New**: `createSSRIdFactory()` - Non-React factory for server-side request-scoped ID generation
- **New**: `generateDelimitedId()` and `useDelimitedId()` - Join prefix/counter/suffix with custom delimiters
- **Backward Compatible**: All existing APIs remain unchanged

### v2.1.0

**New Features:**

- **New**: `generateSecureId()` - Cryptographically random ID generation using `crypto.randomUUID`/`getRandomValues` with `Math.random` fallback
- **New**: Scoped ID management - `nextIdForScope`, `resetIdForScope`, `resetAllScopes`, `getScopeCounter`, `getActiveScopes`
- **New**: Performance monitoring - `useTrackedUniqueId`, `useTrackedUniqueIds`, `useIdMetrics`, `getIdMetrics`, `getActiveIdCount`
- **New**: Overflow protection - Dev-mode warnings when counters exceed 1M IDs

### v2.0.0

**Breaking Changes & New Features:**

- **New**: `<IdProvider>` - Provider-based architecture for SSR-safe, scoped ID generation
- **New**: `useIdContext()` - Access the current provider's context value
- **New**: `createServerIdManager()` - Isolated, per-request ID manager for server-side rendering
- **New**: `generateAutomationId()` - Generate deterministic automation test IDs with naming strategies (`sequential`, `kebab-case`, `camelCase`, `custom`)
- **New**: `useAutomationId()` - React hook for stable automation test IDs
- **New**: `AutomationIdPool` - Pre-allocated ID pool for large-scale automation testing
- **New**: `resetAutomationCounter()` - Reset the automation ID counter
- **Updated**: `useUniqueId()` and `useUniqueIds()` now automatically detect and use `<IdProvider>` context when available
- **Deprecated**: `setGlobalPrefix()` and `setGlobalSuffix()` - use `<IdProvider>` props instead (still functional with deprecation warnings)
- **Breaking**: Global state is now scoped to providers when using the new API

### v1.4.0
- Added `useUniqueId()` React hook for stable, component-scoped IDs
- Added `useUniqueIds()` React hook for generating multiple stable IDs at once
- Added input validation warnings in development mode (non-breaking)
- Enhanced JSDoc comments for better IDE autocomplete and IntelliSense
- Improved example app to demonstrate both imperative and hook-based usage

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
