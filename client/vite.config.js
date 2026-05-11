import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: import.meta.dirname,
  envDir: '..',
  plugins: [
    react(),
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
    allowedHosts: ['local.doraguide.com'],
  }
});
