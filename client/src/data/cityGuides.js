import cityCatalog from './seo-city-catalog.json' with { type: 'json' };
import { normalizeSitePath } from './featuredLocations.js';

export const CITY_GUIDE_ROUTE_BASE = '/cities';
export const CITY_GUIDE_ROUTE_PREFIX = `${CITY_GUIDE_ROUTE_BASE}/`;
const MIN_MARKERS_PER_NEIGHBORHOOD = 2;

const routeSlugForCity = (slug) => slug.replaceAll('_', '-');
const routeSlugForNeighborhood = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const cityGuides = cityCatalog.cities.map((city) => ({
  ...city,
  routeSlug: routeSlugForCity(city.slug),
}));

const cityGuideByRouteSlug = new Map(
  cityGuides.map((city) => [city.routeSlug, city])
);

export const cityGuideRoutePaths = cityGuides.map(
  (city) => `${CITY_GUIDE_ROUTE_PREFIX}${city.routeSlug}`
);

export function getCityGuideSlugFromPath(path) {
  const normalizedPath = normalizeSitePath(path);
  if (!normalizedPath.startsWith(CITY_GUIDE_ROUTE_PREFIX)) return '';
  return decodeURIComponent(normalizedPath.slice(CITY_GUIDE_ROUTE_PREFIX.length));
}

export function isCityGuidePathCandidate(path) {
  const normalizedPath = normalizeSitePath(path);
  return (
    normalizedPath === CITY_GUIDE_ROUTE_BASE ||
    normalizedPath.startsWith(CITY_GUIDE_ROUTE_PREFIX)
  );
}

export function getCityGuideByPath(path) {
  return cityGuideByRouteSlug.get(getCityGuideSlugFromPath(path)) || null;
}

const getNeighborhoodGroups = (city) =>
  city.landmarks.reduce((groups, landmark) => {
    if (!landmark.neighborhood) return groups;
    const current = groups.get(landmark.neighborhood) || [];
    current.push(landmark);
    groups.set(landmark.neighborhood, current);
    return groups;
  }, new Map());

const selectGuideLandmarks = (landmarks, maxCount) => {
  const specificLandmarks = landmarks.filter(
    (landmark) => landmark.category !== 'City' && landmark.category !== 'Neighborhood'
  );
  const candidates = specificLandmarks.length > 0 ? specificLandmarks : landmarks;
  const selected = [];
  const selectedNames = new Set();

  for (const landmark of candidates) {
    if (
      selected.length >= maxCount ||
      selected.some((item) => item.category === landmark.category)
    ) {
      continue;
    }
    selected.push(landmark);
    selectedNames.add(landmark.name);
  }

  for (const landmark of candidates) {
    if (selected.length >= maxCount) break;
    if (!selectedNames.has(landmark.name)) {
      selected.push(landmark);
      selectedNames.add(landmark.name);
    }
  }

  return selected;
};

const getTopCategories = (landmarks) =>
  [...landmarks.reduce((counts, landmark) => {
    if (landmark.category !== 'City' && landmark.category !== 'Neighborhood') {
      counts.set(landmark.category, (counts.get(landmark.category) || 0) + 1);
    }
    return counts;
  }, new Map()).entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([category]) => category);

const joinNames = (items) => {
  if (items.length < 2) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

const getCategoryLabels = (landmarks, maxCount = 4) =>
  getTopCategories(landmarks)
    .slice(0, maxCount)
    .map((category) => category.toLowerCase());

const getCategoryDescriptors = (landmarks, maxCount = 4) => {
  const descriptors = {
    Art: 'art and design',
    Cultural: 'cultural landmarks',
    Historical: 'historic sites',
    Nature: 'parks and outdoor places',
  };

  return getTopCategories(landmarks)
    .slice(0, maxCount)
    .map((category) => descriptors[category] || `${category.toLowerCase()} places`);
};

export function getGuideNeighborhoods(city) {
  const neighborhoods = getNeighborhoodGroups(city);

  return [...neighborhoods.entries()]
    .filter(([, landmarks]) => landmarks.length >= MIN_MARKERS_PER_NEIGHBORHOOD)
    .map(([name, landmarks]) => ({
      name,
      routeSlug: routeSlugForNeighborhood(name),
      landmarkCount: landmarks.length,
      highlights: selectGuideLandmarks(landmarks, 3).map((landmark) => landmark.name),
      landmarks,
    }))
    .sort(
      (left, right) =>
        right.landmarkCount - left.landmarkCount || left.name.localeCompare(right.name)
    );
}

const neighborhoodGuideByPath = new Map(
  cityGuides.flatMap((city) =>
    getGuideNeighborhoods(city).map((neighborhood) => [
      `${city.routeSlug}/${neighborhood.routeSlug}`,
      { city, neighborhood },
    ])
  )
);

export const neighborhoodGuideRoutePaths = [...neighborhoodGuideByPath.keys()].map(
  (path) => `${CITY_GUIDE_ROUTE_PREFIX}${path}`
);

export function getNeighborhoodGuideByPath(path) {
  const normalizedPath = normalizeSitePath(path);
  if (!normalizedPath.startsWith(CITY_GUIDE_ROUTE_PREFIX)) return null;
  const routePath = normalizedPath.slice(CITY_GUIDE_ROUTE_PREFIX.length);
  return neighborhoodGuideByPath.get(routePath) || null;
}

export function getNeighborhoodGuideContent(neighborhood) {
  const landmarks = selectGuideLandmarks(
    neighborhood.landmarks,
    neighborhood.landmarks.length
  );
  const historicalLandmarks = neighborhood.landmarks
    .filter((landmark) => landmark.category === 'Historical')
    .slice(0, 2);

  return {
    landmarks,
    historicalLandmarks:
      historicalLandmarks.length > 0 ? historicalLandmarks : landmarks.slice(0, 2),
    categories: getTopCategories(neighborhood.landmarks).slice(0, 4),
  };
}

export function getCityGuideFaq(city) {
  const neighborhoods = getGuideNeighborhoods(city);
  const categories = getCategoryLabels(city.landmarks);
  const areaNames = neighborhoods.slice(0, 4).map((neighborhood) => neighborhood.name);
  const historical = city.landmarks
    .filter((landmark) => landmark.category === 'Historical')
    .slice(0, 3)
    .map((landmark) => landmark.name);

  return [
    {
      question: `What are the best places to see in ${city.name}?`,
      answer: `Dora brings together ${city.landmarks.length} places across ${neighborhoods.length} neighborhoods in ${city.name}, from landmarks and local history to ${joinNames(categories)}.`,
    },
    {
      question: `Which neighborhoods can I explore in ${city.name}?`,
      answer: `Dora currently covers ${neighborhoods.length} neighborhoods in ${city.name}, including ${joinNames(areaNames)}. Choose an area to see the places Dora has collected there.`,
    },
    {
      question: `Can I use Dora for a self-guided tour of ${city.name}?`,
      answer: `Yes. Dora works as a self-guided ${city.name} walking tour companion, but it is not a fixed route or a conventional ${city.name} tour guide. When a place catches your eye, press play in the app to hear the story behind it.`,
    },
    {
      question: `What historical places can I discover in ${city.name}?`,
      answer: `The ${city.name} guide includes historical places such as ${joinNames(historical)}. Each location in Dora has a story to help explain what makes it worth noticing.`,
    },
    {
      question: `What types of places are in the ${city.name} guide?`,
      answer: `The guide includes ${joinNames(categories)} places. Its neighborhood pages make it easier to focus on the parts of ${city.name} you plan to explore.`,
    },
    {
      question: `How many places does Dora cover in ${city.name}?`,
      answer: `Dora currently includes ${city.landmarks.length} places in ${city.name}, organized across ${neighborhoods.length} neighborhoods.`,
    },
    {
      question: `How do I use Dora to explore ${city.name}?`,
      answer: `Start with a neighborhood on this guide, then open Dora when a place catches your attention to hear the story behind it. It works as an on-demand ${city.name} tour guide for the places you choose to explore.`,
    },
  ];
}

export function getNeighborhoodGuideFaq(city, neighborhood) {
  const categories = getCategoryLabels(neighborhood.landmarks);
  const categoryDescriptors = getCategoryDescriptors(neighborhood.landmarks);
  const featured = selectGuideLandmarks(neighborhood.landmarks, 3).map(
    (landmark) => landmark.name
  );
  const historical = neighborhood.landmarks
    .filter((landmark) => landmark.category === 'Historical')
    .slice(0, 3)
    .map((landmark) => landmark.name);
  const historicalAnswer = historical.length
    ? `Dora includes historical places in ${neighborhood.name}, such as ${joinNames(historical)}. Open them in the app to hear the stories behind each location.`
    : `Dora's ${neighborhood.name} guide brings together local places and the stories behind them, giving you context as you explore the area.`;

  return [
    {
      question: `What are the best places to see in ${neighborhood.name}, ${city.name}?`,
      answer: `Dora has ${neighborhood.landmarkCount} places to discover in ${neighborhood.name}, including ${joinNames(featured)}. Beyond those, there are many other sites and things to see, including ${joinNames(categoryDescriptors)}.`,
    },
    {
      question: `Can I use Dora for a self-guided tour of ${neighborhood.name}?`,
      answer: `Yes. Dora works as a self-guided ${neighborhood.name} walking tour companion, but it is not a fixed route or a traditional ${neighborhood.name} tour guide. Use the map to find a place, then press play in the app to hear its story.`,
    },
    {
      question: `What can I learn about the history of ${neighborhood.name}?`,
      answer: historicalAnswer,
    },
    {
      question: `What kinds of places are in ${neighborhood.name}?`,
      answer: `${neighborhood.name} has ${joinNames(categories)} places in Dora. The guide is built from the locations available in this neighborhood, rather than a generic citywide list.`,
    },
    {
      question: `How many places can I explore in ${neighborhood.name}?`,
      answer: `Dora currently includes ${neighborhood.landmarkCount} places in ${neighborhood.name}. The map above shows where they are located in the neighborhood.`,
    },
    {
      question: `Where should I start in ${neighborhood.name}?`,
      answer: `A useful place to start is ${joinNames(featured)}. For a flexible ${neighborhood.name} walking tour, follow the places and stories that match your interests as you explore.`,
    },
    {
      question: `How do I explore ${neighborhood.name} with Dora?`,
      answer: `Use this guide to see what is available in ${neighborhood.name}, then download Dora to listen to location-based stories while you are out exploring. Dora works as an on-demand ${neighborhood.name} tour guide for the places you decide to visit.`,
    },
  ];
}
