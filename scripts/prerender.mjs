import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getRouteMetadata,
  routeMetadata,
  siteUrl,
  socialImage,
  storyRoutePaths,
} from '../client/src/metadata.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');
const serverEntryPath = path.join(distDir, 'server', 'entry-server.js');

const template = await readFile(templatePath, 'utf8');
const { render } = await import(serverEntryPath);

const setTag = (html, pattern, replacement) => html.replace(pattern, replacement);

const applyMetadata = (html, metadata) => {
  const canonicalUrl = `${siteUrl}${metadata.canonicalPath}`;

  return [
    [
      /<title>.*?<\/title>/,
      `<title>${metadata.title}</title>`,
    ],
    [
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${metadata.description}" />`,
    ],
    [
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    ],
    [
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${metadata.socialTitle}" />`,
    ],
    [
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${metadata.description}" />`,
    ],
    [
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    ],
    [
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:image" content="${socialImage}" />`,
    ],
    [
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${metadata.socialTitle}" />`,
    ],
    [
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${metadata.description}" />`,
    ],
    [
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:image" content="${socialImage}" />`,
    ],
  ].reduce((result, [pattern, replacement]) => setTag(result, pattern, replacement), html);
};

const writeRoute = async (routePath, html) => {
  if (routePath === '/') {
    await writeFile(path.join(distDir, 'index.html'), html);
    return;
  }

  const routeDir = path.join(distDir, routePath.slice(1));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), html);
};

const prerenderRoutes = [
  ...Object.keys(routeMetadata),
  ...storyRoutePaths,
];

for (const routePath of prerenderRoutes) {
  const metadata = getRouteMetadata(routePath);
  const appHtml = render(routePath);
  const html = applyMetadata(
    template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
    metadata
  );

  await writeRoute(routePath, html);
}

await rm(path.join(distDir, 'server'), { force: true, recursive: true });
