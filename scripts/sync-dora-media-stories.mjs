import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(
  projectRoot,
  'client',
  'src',
  'data',
  'dora-media-stories.json'
);

const defaultManifestUrl =
  'https://media.internetinterns.com/audio/stories-manifest.json';
const manifestUrl =
  process.env.DORA_MEDIA_STORIES_MANIFEST_URL || defaultManifestUrl;

const CITY_FOLDER_PATTERN = /^([a-z0-9]+(?:_[a-z0-9]+)*)_([a-z]{2})$/i;

const fail = (message) => {
  throw new Error(`dora-media stories: ${message}`);
};

const response = await fetch(manifestUrl, {
  headers: { accept: 'application/json' },
});

if (!response.ok) {
  fail(`could not fetch manifest (${response.status}) from ${manifestUrl}`);
}

const manifest = await response.json();
if (!manifest || typeof manifest !== 'object') {
  fail('manifest must be a JSON object.');
}

const mediaBaseUrl = String(manifest.mediaBaseUrl || '')
  .trim()
  .replace(/\/+$/, '');
if (!mediaBaseUrl) {
  fail('manifest.mediaBaseUrl is required.');
}

if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
  fail('manifest.files must be a non-empty array.');
}

const files = [];
for (const entry of manifest.files) {
  if (typeof entry !== 'string') continue;
  const relative = entry.trim().replace(/^\/+/, '').replace(/^audio\//, '');
  if (!relative.toLowerCase().endsWith('.mp3')) continue;
  const parts = relative.split('/').filter(Boolean);
  if (parts.length !== 2) continue;
  const [cityFolder, filename] = parts;
  if (!CITY_FOLDER_PATTERN.test(cityFolder)) continue;
  files.push(`${cityFolder}/${filename}`);
}

if (files.length === 0) {
  fail('no valid city-folder mp3 files found in manifest.');
}

files.sort((a, b) => a.localeCompare(b));

const output = {
  mediaBaseUrl,
  generatedAt:
    typeof manifest.generatedAt === 'string' && manifest.generatedAt.trim()
      ? manifest.generatedAt.trim()
      : new Date().toISOString(),
  source: manifestUrl,
  files,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Wrote ${files.length} dora-media stories to ${outputPath}`);
