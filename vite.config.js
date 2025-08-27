import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/jobs': {
        target: 'http://localhost:8000', // Ensure this matches your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jobs/, ''), // Adjust if necessary
      },
    },
  },
});
