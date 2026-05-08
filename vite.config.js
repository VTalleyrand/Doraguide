import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['local.doraguide.com'],
  },
  esbuild: {
    jsx: 'automatic',
  },
});
