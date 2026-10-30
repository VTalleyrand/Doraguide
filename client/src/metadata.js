import {
  getFeaturedStoryByPath,
  isStoryPathCandidate,
  storyRouteNames,
  storyRoutePaths,
} from './data/featuredLocations.js';
import {
  formatPlaceCount,
  getCityGuideByPath,
  getNeighborhoodGuideByPath,
} from './data/cityGuides.js';

export const siteUrl = 'https://www.doraguide.com';

export const appStoreUrl =
  'https://apps.apple.com/us/app/dora-landmarks-stories/id6746723814';

export const appStoreAppId = '6746723814';

export const defaultDescription =
  'Tap a landmark and hear its story with Dora, an audio guide app for discovering the places around you.';

export const socialTitle = 'Dora - Landmarks & Stories';

export const socialImage = `${siteUrl}/dora-social-preview.jpg`;

export const routeMetadata = {
  '/': {
    title: 'Dora - Landmarks & Stories',
    description: defaultDescription,
    canonicalPath: '/',
    socialTitle,
  },
  '/about': {
    title: 'About the Self-Guided Audio Tour Guide App — Dora',
    description:
      'Learn about Dora, a mobile audio guide app for self-guided walking tours and city discovery.',
    canonicalPath: '/about',
    socialTitle: 'About the Self-Guided Audio Tour Guide App — Dora',
  },
  '/terms': {
    title: 'Terms of Service — Dora',
    description:
      'Read the terms for using Dora, covering accounts, passes and subscriptions, shared listening features, and acceptable use.',
    canonicalPath: '/terms',
    socialTitle: 'Terms of Service — Dora',
  },
  '/privacy': {
    title: 'Privacy Policy — Dora',
    description:
      'Learn what information Dora collects, how it is used, and the choices you have over location and notification permissions.',
    canonicalPath: '/privacy',
    socialTitle: 'Privacy Policy — Dora',
  },
  '/press': {
    title: 'Press Kit: Logos, Images and Media Info — Dora',
    description:
      'Download the Dora press kit for logos, product images, and media information.',
    canonicalPath: '/press',
    socialTitle: 'Press Kit: Logos, Images and Media Info — Dora',
  },
  '/help': {
    title: 'Help Center: Stories, Routes, Passes and More — Dora',
    description:
      'Find answers to common questions about using Dora, from stories and routes to passes, Roam with Friends, and troubleshooting.',
    canonicalPath: '/help',
    socialTitle: 'Help Center: Stories, Routes, Passes and More — Dora',
  },
  '/vote': {
    title: 'Vote for Dora’s Next City',
    description:
      'Vote for the next city you would like to see added to Dora’s walking audio guides.',
    canonicalPath: '/vote',
    socialTitle: 'Vote for Dora’s Next City',
  },
  '/cities': {
    title: 'City Guides: Places to See in Every Dora City | Dora',
    description:
      'Browse Dora city guides to find places to see, neighborhoods to explore, and the stories behind the landmarks in each city.',
    canonicalPath: '/cities',
    socialTitle: 'City Guides | Dora',
  },
};

export const notFoundMetadata = {
  title: 'Page not found — Dora',
  description: 'This page could not be found.',
  canonicalPath: '/',
  socialTitle: 'Page not found — Dora',
  noCanonical: true,
};

export { storyRouteNames, storyRoutePaths };

export const getRouteMetadata = (pathname) => {
  const neighborhoodGuide = getNeighborhoodGuideByPath(pathname);

  if (neighborhoodGuide) {
    const { city, neighborhood } = neighborhoodGuide;
    const canonicalPath = `/cities/${city.routeSlug}/${neighborhood.routeSlug}`;
    const title = `Places to See in ${neighborhood.name}, ${city.name} | Dora`;

    return {
      title,
      description: `Explore ${formatPlaceCount(neighborhood.landmarkCount)} in ${neighborhood.name}, ${city.name}. Find places to see, local history, and stories behind the places around you.`,
      canonicalPath,
      socialTitle: `Discover ${neighborhood.name} with Dora`,
    };
  }

  const city = getCityGuideByPath(pathname);

  if (city) {
    const canonicalPath = `/cities/${city.routeSlug}`;
    const title = `Places to See in ${city.name}: Neighborhood Guide | Dora`;

    return {
      title,
      description: `Explore ${city.landmarks.length} places across neighborhoods in ${city.name}, with stories behind the landmarks around you.`,
      canonicalPath,
      socialTitle: `Discover ${city.name} with Dora`,
    };
  }

  const isStoryRoute = isStoryPathCandidate(pathname);

  if (isStoryRoute) {
    const story = getFeaturedStoryByPath(pathname);
    if (!story) return notFoundMetadata;

    const canonicalPath = story.path;
    const locationName = storyRouteNames[canonicalPath] || story.title;
    const title = `Dora - Discovering ${locationName}`;

    return {
      title,
      description: `Listen to the free Dora audio story for ${locationName} in ${story.city}, then get the app for more places nearby.`,
      canonicalPath,
      socialTitle: title,
    };
  }

  return (
    routeMetadata[pathname === '/support' ? '/help' : pathname] || notFoundMetadata
  );
};
