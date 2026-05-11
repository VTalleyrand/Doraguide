import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createVoteApiHandler } from './votes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const port = Number(process.env.PORT || 80);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.riv': 'application/octet-stream',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
};

const safeStaticPath = (pathname) => {
  const decodedPath = decodeURIComponent(pathname);
  const cleanPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const resolvedPath = path.resolve(distDir, `.${cleanPath}`);

  if (!resolvedPath.startsWith(distDir)) {
    return path.join(distDir, 'index.html');
  }

  return resolvedPath;
};

const serveStatic = async (request, response, url) => {
  let filePath = safeStaticPath(url.pathname);
  let fileStat;

  try {
    fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fileStat = await stat(filePath);
    }
  } catch {
    filePath = path.join(distDir, 'index.html');
    fileStat = await stat(filePath);
  }

  const extension = path.extname(filePath);
  const contentType = contentTypes[extension] || 'application/octet-stream';
  const cacheControl = url.pathname.startsWith('/assets/')
    ? 'public, max-age=31536000, immutable'
    : 'no-cache';
  const baseHeaders = {
    'Accept-Ranges': 'bytes',
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
  };
  const range = request.headers.range;

  if (range && fileStat.size > 0) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);

    if (!match) {
      response.writeHead(416, {
        ...baseHeaders,
        'Content-Range': `bytes */${fileStat.size}`,
      });
      response.end();
      return;
    }

    const requestedStart = match[1] ? Number(match[1]) : 0;
    const requestedEnd = match[2] ? Number(match[2]) : fileStat.size - 1;
    const start = Math.max(0, requestedStart);
    const end = Math.min(requestedEnd, fileStat.size - 1);

    if (start > end || start >= fileStat.size) {
      response.writeHead(416, {
        ...baseHeaders,
        'Content-Range': `bytes */${fileStat.size}`,
      });
      response.end();
      return;
    }

    response.writeHead(206, {
      ...baseHeaders,
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
    });
    createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, {
    ...baseHeaders,
    'Content-Length': fileStat.size,
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
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

    await serveStatic(request, response, url);
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
