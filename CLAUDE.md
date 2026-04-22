# react-unique-id-generator

Zero-dependency React library for generating unique, sequential, human-readable IDs. SSR-safe via provider-scoped counters.

## Build & Test

```bash
npm run build          # tsup + tsc declarations
npm test               # jest
npm run test:coverage  # jest --coverage
```

## Architecture

- `lib/` - Source (TypeScript)
  - `context.tsx` - `<IdProvider>` and `useIdContext` (React context, scoped counter via `useRef`)
  - `hooks.ts` - `useUniqueId`, `useUniqueIds` (auto-detect provider, fallback to global)
  - `server.ts` - `createServerIdManager` (isolated per-request ID manager for SSR)
  - `automation.ts` - `generateAutomationId`, `useAutomationId`, `AutomationIdPool` (test ID generation with naming strategies)
  - `nextId.ts` - Legacy global counter API (`nextId`, `resetId`, `setGlobalPrefix`, etc.)
  - `index.ts` - Re-exports everything
- `tests/` - Jest tests with `@testing-library/react`
- `dist/` - Built output (CJS + ESM + declarations)
- `example/` - Next.js example app
- `docs/` - Static documentation site

## Key Design Decisions

- Provider pattern (`<IdProvider>`) scopes counters to subtrees, preventing SSR cross-request leaks
- Hooks use `useRef` for stability across re-renders (ID generated once on mount)
- Legacy global API still works but emits deprecation warnings in dev mode
- `createServerIdManager` returns a plain object (no React dependency) for server-side use
- Automation IDs support 4 naming strategies: sequential, kebab-case, camelCase, custom

## Conventions

- Peer dependency: React >=16.8.0
- Build: tsup (esbuild) for bundling, tsc for declarations
- Tests: Jest + jsdom + @testing-library/react
- No runtime dependencies
