const { build } = require('esbuild');
const { rmSync } = require('fs');
const path = require('path');


rmSync(path.resolve('dist'), { recursive: true, force: true });

const shared = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    sourcemap: false,
    minify: false,
    splitting: false,
    tsconfig: './tsconfig.json',
};


async function buildAll() {
    try {
        await Promise.all([
            build({
                ...shared,
                format: 'cjs',
                outdir: 'dist/cjs',
            }),
            build({
                ...shared,
                format: 'esm',
                outdir: 'dist/esm',
            }),
        ]);
        console.log('Build completed for CJS and ESM');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

buildAll();