import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  cjsInterop: true,
  external: ['react'],
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.esm.js' : '.cjs.js',
    };
  },
});
