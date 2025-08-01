import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression(), // Add compression plugin here
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning to 1MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';      // React chunk
            if (id.includes('sweetalert2')) return 'swal-vendor';  // Swal
            if (id.includes('xlsx')) return 'xlsx-vendor';         // Excel export
            if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf-vendor'; // PDF tools
            return 'vendor'; // Default vendor chunk
          }
        }
      }
    }
  }
});