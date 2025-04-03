// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Optional: Define the root directory if your index.html isn't in the project root
  // root: '.',
  build: {
    // Output directory for the production build (default is 'dist')
    outDir: 'dist',
    // Optional: If you want to manage index.html manually, you might need library mode
    // but for a simple app integration, letting Vite manage index.html is often easier.
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
     // Optional: Define port if needed, default is 5173
     // port: 3000,
     // Make sure CORS is handled by your backend or configure proxy if needed
  },
  base: '/JulienSerbanescu/',
});