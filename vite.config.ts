import react from '@vitejs/plugin-react';
import jsonDts from 'unplugin-json-dts/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'esbuild',

    lib: {
      entry: ['src/h5p-vocabulary-drill.tsx'],
      formats: ['iife'],
      name: 'H5PVocabularyDrill',
      fileName: () => 'h5p-vocabulary-drill.js',
    },

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // For some reason, an H5P content type's style file cannot be named `style.css`.
          // Therefore we need to change the name before saving it.
          if (assetInfo.name === 'style.css') {
            return 'h5p-vocabulary-drill.css';
          }

          return assetInfo.name ?? '';
        },
      },
    },

    target: 'ES2015',
  },

  plugins: [react(), jsonDts()],
  define: {
    'process.env': {},
  },
});
