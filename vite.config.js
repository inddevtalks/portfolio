import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // the FastAPI backend runs on 8000 during development.
    // this lets the frontend call plain "/api/..." paths in both dev and prod.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Keep the animation library in its own long-lived chunk so repeat
        // visits skip re-parsing it. lucide-react deliberately stays in the
        // main chunk — isolating it would defeat tree-shaking.
        manualChunks: {
          motion: ['framer-motion'],
        },
      },
    },
  },
})
