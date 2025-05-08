import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [reactRouter(), tailwindcss(), svgr()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
