import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: "src/index.ts",
  sourcemap: true,
  minify: !options.watch,
  dts: true,
  clean: true,
  format: ["esm", "cjs"],
  loader: {
    ".js": "jsx",
  },
}));
