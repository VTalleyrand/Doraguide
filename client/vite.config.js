import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import {
  getSmartAppBannerAppArgument,
  getSmartAppBannerTag,
} from './src/appBanner.js';

export default defineConfig(({ mode }) => {
  const projectRoot = path.resolve(import.meta.dirname, '..');
  const env = loadEnv(mode, projectRoot, '');

  return {
    root: import.meta.dirname,
    envDir: projectRoot,
    plugins: [
      react(),
      {
        name: 'dora-html-mapkit-meta',
        transformIndexHtml(html) {
          return html
            .replaceAll('%VITE_MAPKIT_TOKEN%', env.VITE_MAPKIT_TOKEN ?? '')
            .replace(
              '<!-- dora-smart-app-banner -->',
              getSmartAppBannerTag(getSmartAppBannerAppArgument('/'))
            );
        },
      },
      {
        name: 'dora-local-vote-api',
        async configureServer(server) {
          const { createVoteApiHandler } = await import('../server/votes.mjs');
          const handleVoteApi = await createVoteApiHandler({ allowDevTools: true });

          server.middlewares.use(async (request, response, next) => {
            try {
              if (await handleVoteApi(request, response)) {
                return;
              }

              next();
            } catch (error) {
              response.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store',
              });
              response.end(JSON.stringify({
                error: 'server_error',
                message: error.message,
              }));
            }
          });
        },
      },
    ],
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      // `local.doraguide.com` can be pinned to HTTPS by parent-domain HSTS in some browsers,
      // so `dora.localhost` avoids that while resolving to loopback without /etc/hosts on macOS.
      allowedHosts: ['local.doraguide.com', 'dora.localhost'],
    },
  };
});
