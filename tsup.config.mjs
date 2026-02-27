import { cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    sourcemap: false,
    minify: false,
    splitting: false,
    dts: true,
    clean: true,
    bundle: true,
    outExtension: ({ format }) => ({
        js: format === "cjs" ? ".cjs" : ".mjs",
    }),
    onSuccess: () => {
        const esmPath = join(__dirname, "dist", "index.mjs");
        const jsPath = join(__dirname, "dist", "index.js");

        try {
            cpSync(esmPath, jsPath);
        } catch {
            // ignore if build output is missing
        }
    },
});
