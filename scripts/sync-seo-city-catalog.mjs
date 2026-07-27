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
  'seo-city-catalog.json'
);
const defaultCatalogUrl =
  'https://voxxxfwjtgonruixdtqv.supabase.co/functions/v1/seo-city-catalog';
const catalogUrl = process.env.DORA_SEO_CATALOG_URL || defaultCatalogUrl;

const fail = (message) => {
  throw new Error(`SEO city catalog: ${message}`);
};

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const validateCatalog = (catalog) => {
  if (!catalog || typeof catalog !== 'object' || !Array.isArray(catalog.cities)) {
    fail('response must contain a cities array.');
  }

  const cities = catalog.cities.map((city) => {
    if (!isNonEmptyString(city?.slug) || !isNonEmptyString(city?.name)) {
      fail('each city must include a slug and name.');
    }
    if (!Array.isArray(city.landmarks) || city.landmarks.length < 3) {
      fail(`${city.slug} must include at least three landmarks.`);
    }

    return {
      slug: city.slug.trim().toLowerCase(),
      name: city.name.trim(),
      countryCode: isNonEmptyString(city.countryCode)
        ? city.countryCode.trim().toUpperCase()
        : '',
      landmarks: city.landmarks
        .filter((landmark) => isNonEmptyString(landmark?.name))
        .map((landmark) => ({
          name: landmark.name.trim(),
          latitude:
            typeof landmark.latitude === 'number' && Number.isFinite(landmark.latitude)
              ? landmark.latitude
              : null,
          longitude:
            typeof landmark.longitude === 'number' && Number.isFinite(landmark.longitude)
              ? landmark.longitude
              : null,
          category: isNonEmptyString(landmark.category)
            ? landmark.category.trim()
            : 'Landmark',
          neighborhood: isNonEmptyString(landmark.neighborhood)
            ? landmark.neighborhood.trim()
            : null,
          description: isNonEmptyString(landmark.description)
            ? landmark.description.trim()
            : '',
        })),
    };
  });

  return {
    generatedAt: isNonEmptyString(catalog.generatedAt)
      ? catalog.generatedAt
      : new Date().toISOString(),
    cities,
  };
};

const response = await fetch(catalogUrl, {
  headers: { accept: 'application/json' },
});

if (!response.ok) {
  fail(`request failed with ${response.status}.`);
}

const catalog = validateCatalog(await response.json());
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);

console.log(
  `Synced ${catalog.cities.length} SEO cities and ${catalog.cities.reduce(
    (count, city) => count + city.landmarks.length,
    0
  )} landmarks.`
);
