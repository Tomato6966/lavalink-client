import { cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsdown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    sourcemap: false,
    minify: false,
    dts: true,
    clean: true,
    outExtensions: ({ format }: { format: string }) => ({
        js: format === "cjs" ? ".cjs" : ".mjs",
    }),
    onSuccess: () => {
        const esmPath = join(__dirname, "dist", "index.mjs");
        const jsPath = join(__dirname, "dist", "index.js");
        const dmtsPath = join(__dirname, "dist", "index.d.mts");
        const dtsPath = join(__dirname, "dist", "index.d.ts");

        try {
            cpSync(esmPath, jsPath);
        } catch {
            // ignore if build output is missing
        }
        try {
            cpSync(dmtsPath, dtsPath);
        } catch {
            // ignore if build output is missing
        }
    },
});
