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

export const storyRouteNames = {
  '/s/new-york': 'New York',
  '/s/paris': 'Paris',
  '/s/milan': 'Milan',
  '/s/palermo': 'Palermo',
};

export const storyRoutePaths = Object.keys(storyRouteNames);

export const getRouteMetadata = (pathname) => {
  if (pathname?.startsWith('/s/')) {
    const locationName = storyRouteNames[pathname] || 'this place';
    const title = `Dora - Discovering ${locationName}`;

    return {
      title,
      description:
        'Listen to a free Dora audio story, then get early access to the app.',
      canonicalPath: pathname,
      socialTitle: title,
    };
  }

  return routeMetadata[pathname] || routeMetadata['/'];
};
