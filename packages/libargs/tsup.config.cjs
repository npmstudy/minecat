import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: "src/index.ts",
    sourcemap: true,
    minify: !options.watch,
    dts: true,
    clean: true,
    format: ["esm", "cjs"],
    loader: {
      ".js": "jsx",
    },
  };
});
