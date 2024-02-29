/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["json", "html"],
    },
  },
});
