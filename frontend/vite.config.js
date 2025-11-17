import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration for JobPortal AI frontend
 * Configures React plugin and development server settings
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8081, // Frontend runs on port 8082
    strictPort: false,
    proxy: {
      // Proxy API requests to backend server (running on port 8081)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

