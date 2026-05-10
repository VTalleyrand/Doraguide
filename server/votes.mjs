import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const dbPath =
  process.env.VOTES_DB_PATH || path.join(projectRoot, 'data', 'dora-votes.sqlite');
const ipSalt = process.env.VOTE_IP_SALT || 'dora-vote-ip-salt';

const validCities = new Set([
  'London',
  'Rome',
  'Madrid',
  'Lisbon',
  'Berlin',
  'Florence',
  'Venice',
  'Athens',
  'Prague',
  'Istanbul',
  'Mexico City',
  'Tokyo',
]);

const sqlString = (value) => `'${String(value).replaceAll("'", "''")}'`;

const runSql = (sql) =>
  new Promise((resolve, reject) => {
    execFile('sqlite3', ['-json', dbPath, sql], (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }

      try {
        resolve(stdout.trim() ? JSON.parse(stdout) : []);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });

const initDb = async () => {
  await mkdir(path.dirname(dbPath), { recursive: true });
  await runSql(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      vote_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(ip_hash, vote_date)
    );
    CREATE INDEX IF NOT EXISTS idx_votes_city ON votes(city);
    CREATE INDEX IF NOT EXISTS idx_votes_date ON votes(vote_date);
  `);
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
};

const readJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10_000) {
        reject(new Error('Request body too large'));
        request.destroy();
      }
    });

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });

const todayUtc = () => new Date().toISOString().slice(0, 10);

const getClientIp = (request) => {
  const forwardedFor = request.headers['x-forwarded-for'];
  const realIp = request.headers['x-real-ip'];
  const rawIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0] || realIp || request.socket.remoteAddress || '';

  return String(rawIp).trim().replace(/^::ffff:/, '');
};

const hashIp = (ip) =>
  createHash('sha256').update(`${ipSalt}:${ip}`).digest('hex');

const getTotals = async () => {
  const rows = await runSql(`
    SELECT city, COUNT(*) AS votes
    FROM votes
    GROUP BY city
    ORDER BY votes DESC, city ASC;
  `);

  return rows.reduce((totals, row) => {
    totals[row.city] = Number(row.votes);
    return totals;
  }, {});
};

const getExistingVote = async (ipHash, voteDate) => {
  const rows = await runSql(`
    SELECT city
    FROM votes
    WHERE ip_hash = ${sqlString(ipHash)}
      AND vote_date = ${sqlString(voteDate)}
    LIMIT 1;
  `);

  return rows[0]?.city || '';
};

const handleVoteStatus = async (request, response) => {
  const voteDate = todayUtc();
  const ipHash = hashIp(getClientIp(request));
  const city = await getExistingVote(ipHash, voteDate);

  sendJson(response, 200, {
    votedToday: Boolean(city),
    city,
    voteDate,
    totals: await getTotals(),
  });
};

const handleVoteSubmit = async (request, response) => {
  const payload = await readJsonBody(request);
  const city = String(payload.city || '').trim();

  if (!validCities.has(city)) {
    sendJson(response, 400, {
      error: 'invalid_city',
      message: 'Choose a city from the voting list.',
    });
    return;
  }

  const voteDate = todayUtc();
  const ipHash = hashIp(getClientIp(request));
  const existingCity = await getExistingVote(ipHash, voteDate);

  if (existingCity) {
    sendJson(response, 409, {
      error: 'already_voted',
      message: 'This IP address has already voted today.',
      city: existingCity,
      voteDate,
      totals: await getTotals(),
    });
    return;
  }

  await runSql(`
    INSERT INTO votes (city, ip_hash, vote_date)
    VALUES (${sqlString(city)}, ${sqlString(ipHash)}, ${sqlString(voteDate)});
  `);

  sendJson(response, 201, {
    ok: true,
    city,
    voteDate,
    totals: await getTotals(),
  });
};

const handleDevVoteReset = async (request, response) => {
  const voteDate = todayUtc();
  const ipHash = hashIp(getClientIp(request));

  await runSql(`
    DELETE FROM votes
    WHERE ip_hash = ${sqlString(ipHash)}
      AND vote_date = ${sqlString(voteDate)};
  `);

  sendJson(response, 200, {
    ok: true,
    votedToday: false,
    city: '',
    voteDate,
    totals: await getTotals(),
  });
};

export const createVoteApiHandler = async ({ allowDevTools = false } = {}) => {
  await initDb();

  return async (request, response) => {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);

    if (
      allowDevTools &&
      request.method === 'POST' &&
      url.pathname === '/api/votes/dev-reset'
    ) {
      await handleDevVoteReset(request, response);
      return true;
    }

    if (request.method === 'GET' && url.pathname === '/api/votes/status') {
      await handleVoteStatus(request, response);
      return true;
    }

    if (request.method === 'POST' && url.pathname === '/api/votes') {
      await handleVoteSubmit(request, response);
      return true;
    }

    if (url.pathname.startsWith('/api/')) {
      sendJson(response, 404, { error: 'not_found' });
      return true;
    }

    return false;
  };
};
