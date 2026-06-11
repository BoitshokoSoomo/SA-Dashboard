import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@reduxjs\/toolkit$/,
        replacement: fileURLToPath(new URL('./node_modules/@reduxjs/toolkit/dist/redux-toolkit.legacy-esm.js', import.meta.url)),
      },
    ],
    dedupe: ['@reduxjs/toolkit'],
    conditions: ['import', 'module', 'browser', 'default'],
  },
  optimizeDeps: {
    include: ['recharts', '@reduxjs/toolkit'],
  },
  build: {
    rollupOptions: {
      external: ['@reduxjs/toolkit', 'redux', 'redux-thunk', 'react-redux'],
      output: {
        globals: {
          '@reduxjs/toolkit': 'ReduxToolkit',
          'redux': 'Redux',
          'redux-thunk': 'ReduxThunk',
          'react-redux': 'ReactRedux',
        },
      },
    },
  },
});
