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
};
