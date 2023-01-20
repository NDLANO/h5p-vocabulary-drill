import jsonDts from "unplugin-json-dts/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "esbuild",

    rollupOptions: {
      input: "src/h5p-vocabulary-drill.ts",
      output: {
        file: "dist/h5p-vocabulary-drill.js",
        dir: undefined,
        esModule: false,
        format: "iife",
      },
    },

    target: "es6",
  },

  plugins: [jsonDts()],
});
