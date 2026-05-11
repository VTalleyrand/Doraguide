import { createServer } from 'node:http';
import { createVoteApiHandler } from './votes.mjs';

const port = Number(process.env.PORT || 3001);

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
};

const handleVoteApi = await createVoteApiHandler();

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);

    if (await handleVoteApi(request, response)) {
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }

    sendJson(response, 404, { error: 'not_found' });
  } catch (error) {
    sendJson(response, 500, {
      error: 'server_error',
      message: error.message,
    });
  }
});

server.listen(port, () => {
  console.log(`Dora server listening on ${port}`);
});
