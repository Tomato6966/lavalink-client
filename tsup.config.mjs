import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    sourcemap: false,
    minify: false,
    splitting: false,
    dts: true,
    clean: true,
    bundle: true,
});