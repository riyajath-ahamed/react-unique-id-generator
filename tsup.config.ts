import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index':       'lib/index.ts',
    'automation':  'lib/automation.ts',
    'selector':    'lib/selector.ts',
    'collision':   'lib/collision.ts',
    'strategy':    'lib/strategy.ts',
    'core/index':  'lib/core/index.ts',
    'react/index': 'lib/react/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  cjsInterop: true,
  external: ['react'],
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
    };
  },
});
