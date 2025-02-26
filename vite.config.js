import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './Front-End'),
      '@assets': path.resolve(__dirname, './Front-End/assets'),
      '@components': path.resolve(__dirname, './Front-End/components'),
      '@types': path.resolve(__dirname, './Front-End/types'),
    },
  },
  build: {
    outDir: 'dist', // Ensure the build output is inside `dist/`
  },
  server: {
    historyApiFallback: true, // Fix React Router navigation issues
    port: 5173, // Set Vite’s local dev port
  },
});
