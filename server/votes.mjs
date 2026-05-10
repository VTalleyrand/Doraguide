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
const voteDateUtc = () => new Date().toISOString().slice(0, 10);

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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const voteIndexes = await runSql('PRAGMA index_list(votes);');
  const hasLegacyVoteDateUnique = voteIndexes.some(
    (index) => index.unique === 1 && index.origin === 'u',
  );

  if (hasLegacyVoteDateUnique) {
    await runSql(`
      ALTER TABLE votes RENAME TO votes_legacy_unique;

      CREATE TABLE votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        vote_date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      INSERT INTO votes (id, city, ip_hash, vote_date, created_at)
      SELECT id, city, ip_hash, vote_date, created_at
      FROM votes_legacy_unique;

      DROP TABLE votes_legacy_unique;
    `);
  }

  await runSql(`
    CREATE INDEX IF NOT EXISTS idx_votes_city ON votes(city);
    CREATE INDEX IF NOT EXISTS idx_votes_date ON votes(vote_date);

    CREATE TABLE IF NOT EXISTS vote_limits (
      ip_hash TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      voted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_vote_limits_voted_at ON vote_limits(voted_at);

    INSERT OR IGNORE INTO vote_limits (ip_hash, city, voted_at)
    SELECT recent.ip_hash, votes.city, recent.voted_at
    FROM (
      SELECT ip_hash, MAX(created_at) AS voted_at
      FROM votes
      WHERE datetime(created_at) > datetime('now', '-24 hours')
      GROUP BY ip_hash
    ) AS recent
    INNER JOIN votes
      ON votes.ip_hash = recent.ip_hash
      AND votes.created_at = recent.voted_at;
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

const cleanupExpiredVoteLimits = async () => {
  await runSql(`
    DELETE FROM vote_limits
    WHERE datetime(voted_at) <= datetime('now', '-24 hours');
  `);
};

const getExistingVote = async (ipHash) => {
  const rows = await runSql(`
    SELECT city, voted_at, datetime(voted_at, '+24 hours') AS reset_at
    FROM vote_limits
    WHERE ip_hash = ${sqlString(ipHash)}
    LIMIT 1;
  `);

  return rows[0] || null;
};

const handleVoteStatus = async (request, response) => {
  await cleanupExpiredVoteLimits();

  const ipHash = hashIp(getClientIp(request));
  const existingVote = await getExistingVote(ipHash);

  sendJson(response, 200, {
    votedToday: Boolean(existingVote),
    city: existingVote?.city || '',
    votedAt: existingVote?.voted_at || '',
    resetAt: existingVote?.reset_at || '',
    totals: await getTotals(),
  });
};

const handleVoteSubmit = async (request, response) => {
  await cleanupExpiredVoteLimits();

  const payload = await readJsonBody(request);
  const city = String(payload.city || '').trim();

  if (!validCities.has(city)) {
    sendJson(response, 400, {
      error: 'invalid_city',
      message: 'Choose a city from the voting list.',
    });
    return;
  }

  const voteDate = voteDateUtc();
  const votedAt = new Date().toISOString();
  const ipHash = hashIp(getClientIp(request));
  const existingVote = await getExistingVote(ipHash);

  if (existingVote) {
    sendJson(response, 409, {
      error: 'already_voted',
      message: 'This IP address has already voted in the last 24 hours.',
      city: existingVote.city,
      votedAt: existingVote.voted_at,
      resetAt: existingVote.reset_at,
      totals: await getTotals(),
    });
    return;
  }

  await runSql(`
    INSERT INTO votes (city, ip_hash, vote_date, created_at)
    VALUES (
      ${sqlString(city)},
      ${sqlString(ipHash)},
      ${sqlString(voteDate)},
      ${sqlString(votedAt)}
    );

    INSERT INTO vote_limits (ip_hash, city, voted_at)
    VALUES (${sqlString(ipHash)}, ${sqlString(city)}, ${sqlString(votedAt)})
    ON CONFLICT(ip_hash) DO UPDATE SET
      city = excluded.city,
      voted_at = excluded.voted_at;
  `);

  sendJson(response, 201, {
    ok: true,
    city,
    voteDate,
    votedAt,
    totals: await getTotals(),
  });
};

const handleDevVoteReset = async (request, response) => {
  const ipHash = hashIp(getClientIp(request));

  await runSql(`
    DELETE FROM vote_limits
    WHERE ip_hash = ${sqlString(ipHash)};

    DELETE FROM votes
    WHERE id IN (
      SELECT id
      FROM votes
      WHERE ip_hash = ${sqlString(ipHash)}
      ORDER BY datetime(created_at) DESC
      LIMIT 1
    );
  `);

  sendJson(response, 200, {
    ok: true,
    votedToday: false,
    city: '',
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
