import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2022',
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  report: false,
  deps: {
    // Types-only devDependency: `avsc`'s .d.ts declares its `schema` namespace
    // without an explicit `export`, which tsc accepts but rolldown's dts
    // bundler rejects — keep the import unresolved in the emitted output.
    neverBundle: ['avsc'],
  },
})
