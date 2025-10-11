# React Unique ID Generator

A lightweight, flexible library for generating unique IDs in React applications. Perfect for form elements, accessibility attributes, and any scenario where you need guaranteed unique identifiers.

## Features

- 🚀 **Lightweight**: Minimal bundle size with zero dependencies
- 🔧 **Flexible**: Support for global and local prefixes/suffixes
- 🎯 **React-friendly**: Designed specifically for React applications
- 📦 **TypeScript**: Full TypeScript support with type definitions
- 🧪 **Well-tested**: Comprehensive test suite with 100% coverage
- 🌐 **SSR-safe**: Works in both client and server-side rendering environments

## Installation

```bash
npm install react-unique-id-generator
```

## Basic Usage

```tsx
import nextId from 'react-unique-id-generator';

function MyComponent() {
  return (
    <div>
      <label htmlFor={nextId()}>Name:</label>
      <input id={nextId()} type="text" />
    </div>
  );
}
```

## API Reference

### `nextId(localPrefix?: string | null): string`

Generates a unique ID with an optional local prefix.

**Parameters:**
- `localPrefix` (optional): A prefix to use for this specific ID, overrides global prefix

**Returns:** A unique string ID

**Example:**
```tsx
nextId()           // "1"
nextId()           // "2"
nextId('input-')   // "input-3"
nextId('input-')   // "input-4"
```

### `setGlobalPrefix(prefix: string): void`

Sets a global prefix for all generated IDs.

**Parameters:**
- `prefix`: The prefix to use for all IDs

**Example:**
```tsx
setGlobalPrefix('app-');
nextId(); // "app-1"
nextId(); // "app-2"
```

### `setGlobalSuffix(suffix: string): void`

Sets a global suffix for all generated IDs.

**Parameters:**
- `suffix`: The suffix to use for all IDs

**Example:**
```tsx
setGlobalSuffix('-id');
nextId(); // "1-id"
nextId(); // "2-id"
```

### `resetId(): void`

Resets the ID counter to 0.

**Example:**
```tsx
nextId(); // "1"
nextId(); // "2"
resetId();
nextId(); // "1"
```

### `getCurrentId(): number`

Gets the current ID counter value.

**Returns:** The current last ID value

**Example:**
```tsx
nextId(); // "1"
getCurrentId(); // 1
nextId(); // "2"
getCurrentId(); // 2
```

### `setId(id: number): void`

Sets the ID counter to a specific value.

**Parameters:**
- `id`: The ID value to set the counter to (will be floored and clamped to 0)

**Example:**
```tsx
setId(10);
nextId(); // "11"
```

### `generateId(prefix?: string, suffix?: string): string`

Generates a unique ID with specific prefix and suffix.

**Parameters:**
- `prefix` (optional): The prefix for this ID (defaults to empty string)
- `suffix` (optional): The suffix for this ID (defaults to empty string)

**Returns:** A unique string ID

**Example:**
```tsx
generateId('btn-', '-primary'); // "btn-1-primary"
generateId('icon-');            // "icon-2"
generateId();                   // "3"
```

## Advanced Usage

### Form Components

```tsx
import nextId, { setGlobalPrefix } from 'react-unique-id-generator';

function ContactForm() {
  setGlobalPrefix('contact-');
  
  return (
    <form>
      <div>
        <label htmlFor={nextId()}>Email:</label>
        <input id={nextId()} type="email" />
      </div>
      <div>
        <label htmlFor={nextId()}>Message:</label>
        <textarea id={nextId()}></textarea>
      </div>
    </form>
  );
}
```

### Component-Specific IDs

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
```

### Multiple Components with Different Prefixes

```tsx
import nextId, { resetId } from 'react-unique-id-generator';

function Page() {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

function Header() {
  resetId(); // Start fresh for each section
  return (
    <header>
      <nav>
        <a href="#" id={nextId('nav-')}>Home</a>
        <a href="#" id={nextId('nav-')}>About</a>
      </nav>
    </header>
  );
}

function MainContent() {
  return (
    <main>
      <h1 id={nextId('main-')}>Welcome</h1>
      <p id={nextId('main-')}>Content goes here...</p>
    </main>
  );
}
```

## TypeScript Support

The library is written in TypeScript and includes full type definitions:

```tsx
import nextId, { 
  resetId, 
  setGlobalPrefix, 
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId 
} from 'react-unique-id-generator';

// All functions are fully typed
const id: string = nextId();
const currentId: number = getCurrentId();
```

## Testing

The library includes comprehensive tests. Run them with:

```bash
npm test
```

For watch mode:
```bash
npm run test:watch
```

For coverage report:
```bash
npm run test:coverage
```

## Building

Build the library:

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Generate declaration files
3. Create ES modules bundle
4. Output to the `dist` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.1.1
- Added comprehensive test suite
- Improved TypeScript definitions
- Added new utility functions (`getCurrentId`, `setId`, `generateId`)
- Fixed build configuration
- Added proper npm package configuration
- Improved documentation and examples