import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    chunkSizeWarningLimit: 1000
  },
  server: {
    // ✅ Enable React Router fallback for dev
    historyApiFallback: true
  },
  // ✅ Important for static deployment like Render
  preview: {
    historyApiFallback: true
  }
});
