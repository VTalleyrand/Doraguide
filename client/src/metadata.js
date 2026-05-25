import {
  STORY_ROUTE_BASE,
  STORY_ROUTE_PREFIX,
  getFeaturedStoryBySlug,
  storyRouteNames,
  storyRoutePaths,
} from './data/featuredLocations.js';

export const siteUrl = 'https://doraguide.com';

export const defaultDescription =
  'Discover cities through narrated audio guides to history, art, culture, architecture, and hidden places.';

export const socialTitle = 'Dora — Audio Walking Tours';

export const socialImage = `${siteUrl}/dora-social-preview.jpg`;

export const routeMetadata = {
  '/': {
    title: 'Dora',
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
  '/vote': {
    title: 'Vote for Dora’s Next City',
    description:
      'Vote for the next city you would like to see added to Dora’s walking audio guides.',
    canonicalPath: '/vote',
    socialTitle: 'Vote for Dora’s Next City',
  },
};

export { storyRouteNames, storyRoutePaths };

const getStorySlugFromPathname = (pathname) => {
  const normalizedPath =
    pathname?.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname || '/';
  if (normalizedPath === STORY_ROUTE_BASE) return '';
  if (!normalizedPath.startsWith(STORY_ROUTE_PREFIX)) return '';
  return decodeURIComponent(normalizedPath.slice(STORY_ROUTE_PREFIX.length));
};

export const getRouteMetadata = (pathname) => {
  const slug = getStorySlugFromPathname(pathname);
  const isStoryRoute =
    pathname === STORY_ROUTE_BASE || pathname?.startsWith(STORY_ROUTE_PREFIX);

  if (isStoryRoute) {
    const story = getFeaturedStoryBySlug(slug);
    if (!story) return routeMetadata['/'];

    const canonicalPath = `${STORY_ROUTE_PREFIX}${slug}`;
    const locationName = storyRouteNames[canonicalPath] || story.title;
    const title = `Dora - Discovering ${locationName}`;

    return {
      title,
      description:
        story.hook ||
        'Listen to a free Dora audio story, then get early access to the app.',
      canonicalPath,
      socialTitle: title,
    };
  }

  return routeMetadata[pathname] || routeMetadata['/'];
};
