import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), 
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      '#': '/src',
    },
  },
  server: {
    // allow SharedArrayBuffer is required for using three-usdz-loader
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
