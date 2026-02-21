import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    include: ['@reduxjs/toolkit'],
  },
  build: {
    sourcemap: false, // Disable sourcemaps for production builds to reduce size
    reportCompressedSize: true, // Report gzip/brotli size of the bundle
    rollupOptions: {
      output: {
        // Manual chunking for vendor libraries
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom', 'redux', '@reduxjs/toolkit'],
          // Optionally, create more chunks for other large libraries
        },
      },
    },
  },
})
