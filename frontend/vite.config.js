import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', 
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5005', // change port to whatever the server is running on
        changeOrigin: true,
        secure: false,
      },
    },
  },
})