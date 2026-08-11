import {
  getFeaturedStoryByPath,
  isStoryPathCandidate,
  storyRouteNames,
  storyRoutePaths,
} from './data/featuredLocations.js';
import {
  getCityGuideByPath,
  getNeighborhoodGuideByPath,
} from './data/cityGuides.js';

export const siteUrl = 'https://doraguide.com';

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
    title: 'About — Dora',
    description:
      'Learn about Dora, a mobile audio guide app for self-guided walking tours and city discovery.',
    canonicalPath: '/about',
    socialTitle: 'About — Dora',
  },
  '/terms': {
    title: 'Terms of Service — Dora',
    description: 'Read the Dora terms of service.',
    canonicalPath: '/terms',
    socialTitle: 'Terms of Service — Dora',
  },
  '/privacy': {
    title: 'Privacy Policy — Dora',
    description: 'Read the Dora privacy policy.',
    canonicalPath: '/privacy',
    socialTitle: 'Privacy Policy — Dora',
  },
  '/press': {
    title: 'Press — Dora',
    description:
      'Find Dora press and media information, or reach out for coverage and partnership conversations.',
    canonicalPath: '/press',
    socialTitle: 'Press — Dora',
  },
  '/help': {
    title: 'Help — Dora',
    description:
      'Find answers to common questions about using Dora, from stories and routes to passes, Roam with Friends, and troubleshooting.',
    canonicalPath: '/help',
    socialTitle: 'Help — Dora',
  },
  '/vote': {
    title: 'Vote for Dora’s Next City',
    description:
      'Vote for the next city you would like to see added to Dora’s walking audio guides.',
    canonicalPath: '/vote',
    socialTitle: 'Vote for Dora’s Next City',
  },
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
      description: `Explore ${neighborhood.landmarkCount} places in ${neighborhood.name}, ${city.name}. Find places to see, local history, and stories behind the places around you.`,
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
    if (!story) return routeMetadata['/'];

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

  return routeMetadata[pathname === '/support' ? '/help' : pathname] || routeMetadata['/'];
};
