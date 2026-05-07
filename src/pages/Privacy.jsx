const summaryPoints = [
  'We collect the information we need to run Dora, including account details, app activity, purchases, and optional permissions such as location and notifications.',
  'We use that information to provide the app, sync your account and tours, manage access, improve reliability, and keep Dora secure.',
  'We do not sell your personal information.',
  'If you grant location or notification permissions, you can turn them off later in your device settings.',
];

const sections = [
  {
    id: 'what-dora-does',
    title: '1. What Dora does',
    paragraphs: [
      'Dora helps you discover places, listen to audio stories, follow or create tours, save favorites, manage passes and subscriptions, and use shared listening features where available.',
    ],
  },
  {
    id: 'what-we-collect',
    title: '2. What we collect',
    paragraphs: ['We collect information in a few categories.'],
    groups: [
      {
        label: 'a. Information you give us',
        items: [
          'Name, first name, and last name',
          'Email address',
          'Account ID / user ID',
          'Hometown details, if you choose to add them',
          'Profile image, if you choose to add one',
          'Tours you create or save',
          'Favorites and preferences you choose in the app',
        ],
      },
      {
        label: 'b. Account and sign-in information',
        items: [
          'Sign-in details needed to authenticate you',
          'Information from Apple if you use Sign in with Apple',
          'Information from Google if you use Google sign-in',
        ],
      },
      {
        label: 'c. App activity and service data',
        items: [
          'Tours you create, import, continue, or complete',
          'Favorite places',
          'Visited cities',
          'Tour progress and completion state',
          'Shared-session participation state, such as whether you are hosting or joining',
          'App settings and preferences, including language, theme, measurement system, haptics, and notification preferences',
        ],
      },
      {
        label: 'd. Purchase and entitlement information',
        items: [
          'Pass and subscription status',
          'Product type',
          'Expiration dates',
          'Restore and entitlement status received from Apple StoreKit',
        ],
      },
      {
        label: 'e. Location information',
        items: [
          'Your approximate or precise location while using location-based features, if you grant location access',
          'City and neighborhood context derived from your location',
        ],
      },
      {
        label: 'f. Device and analytics information',
        items: [
          'Session identifiers',
          'Device model',
          'Operating system version',
          'App version',
          'Language and locale',
          'Network type',
          'Product usage and feature interaction events',
          'City and neighborhood context associated with some events',
        ],
      },
      {
        label: 'g. Notification information',
        items: [
          'Notification permission status',
          'Push token, if push-capable notification infrastructure is used',
          'Reminder and notification scheduling metadata stored on your device',
        ],
      },
      {
        label: 'h. Information stored locally on your device',
        items: [
          'Cached content and app state needed to make Dora faster and more reliable',
          'Locally stored settings, reminders, and certain tour or audio data',
        ],
      },
    ],
  },
  {
    id: 'how-we-collect',
    title: '3. How we collect information',
    paragraphs: ['We collect information:'],
    list: [
      'directly from you',
      'automatically when you use Dora',
      'from Apple when sign-in and purchases are processed',
      'from Google if you choose Google sign-in',
      'from backend and infrastructure providers that help us operate Dora',
    ],
  },
  {
    id: 'how-we-use',
    title: '4. How we use information',
    paragraphs: ['We use information to:'],
    list: [
      'create and manage your account',
      'sign you in and keep you signed in',
      'sync your profile, tours, favorites, progress, and settings',
      'provide nearby content, route context, and location-aware experiences',
      'provide audio playback and related features',
      'provide shared listening and roaming features where available',
      'manage passes, subscriptions, restores, and access rights',
      'send reminders and notifications you enable',
      'improve performance, reliability, and product quality',
      'detect abuse, fraud, misuse, and security issues',
      'comply with legal obligations',
    ],
  },
  {
    id: 'location',
    title: '5. Location',
    paragraphs: [
      'Dora only uses your location if you grant permission.',
      'If you allow location access, Dora may use it to:',
    ],
    list: [
      'show nearby places and tours',
      'determine your current city or neighborhood',
      'personalize recommendations',
      'resume relevant tours',
      'improve route and in-app travel context',
    ],
    closing:
      'Dora does not currently require "Always" background location permission to provide its core experience.',
  },
  {
    id: 'notifications',
    title: '6. Notifications',
    paragraphs: [
      'If you opt in, Dora may send local or remote notifications such as:',
    ],
    list: [
      'pass expiration reminders',
      'resume-tour reminders',
      'tour and engagement reminders',
      'nearby or recommended tour prompts',
    ],
    closing:
      'You can turn notifications off at the system level, and you can change in-app notification preferences where available.',
  },
  {
    id: 'purchases-sign-in-and-platform-services',
    title: '7. Purchases, sign-in providers, and platform services',
    paragraphs: [
      'If you purchase a pass or subscription, Apple handles billing and payment processing through the App Store. Dora receives purchase and entitlement information needed to unlock access and restore purchases.',
      'If you sign in with Apple or Google, Dora receives the account information needed to authenticate you and operate your account.',
      'Your use of Apple and Google services is also subject to their own terms and privacy policies.',
    ],
  },
  {
    id: 'when-we-share',
    title: '8. When we share information',
    paragraphs: ['We do not sell your personal information.'],
    lead: 'We may share information with service providers that help us operate Dora, including:',
    list: [
      'Apple, for Sign in with Apple, App Store purchases, and platform services',
      'Google, if you use Google sign-in',
      'Supabase and related infrastructure used for authentication, database, storage, and realtime/backend features',
    ],
    closingLead: 'We may also disclose information:',
    closingList: [
      'if required by law',
      'to protect users, Dora, or the public',
      'in connection with a merger, financing, acquisition, reorganization, or sale of assets',
    ],
  },
  {
    id: 'data-retention',
    title: '9. Data retention',
    paragraphs: ['We keep information for as long as reasonably necessary to:'],
    list: [
      'provide Dora',
      'maintain your account',
      'comply with legal, tax, accounting, and security obligations',
      'resolve disputes and enforce agreements',
    ],
    closing:
      'Some information may remain stored locally on your device until it is replaced, cleared, or the app is removed.',
  },
  {
    id: 'your-choices',
    title: '10. Your choices',
    paragraphs: ['You may be able to:'],
    list: [
      'access and update profile information in the app',
      'disable location access in device settings',
      'disable notification access in device settings',
      'use account deletion features available in the app',
      'contact us for support or privacy requests',
    ],
  },
  {
    id: 'region-specific-rights',
    title: '11. Region-specific rights',
    paragraphs: [
      'Depending on where you live, you may have rights such as:',
    ],
    list: [
      'access',
      'correction',
      'deletion',
      'portability',
      'objection',
      'restriction',
      'withdrawal of consent',
      'complaint to a data protection authority',
    ],
    closing: 'To exercise applicable rights, contact hello@doraguide.com.',
  },
  {
    id: 'international-data-transfers',
    title: '12. International data transfers',
    paragraphs: [
      'Dora and its providers may process information in countries other than your own. Where required, we take steps intended to provide appropriate safeguards for cross-border transfers.',
    ],
  },
  {
    id: 'security',
    title: '13. Security',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational measures designed to protect information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: "14. Children's privacy",
    paragraphs: [
      'Dora is not intended for children under 13, or the minimum age required by local law to use the service without parental consent. We do not knowingly collect personal information from children in violation of applicable law.',
    ],
  },
  {
    id: 'third-party-services-and-links',
    title: '15. Third-party services and links',
    paragraphs: [
      'Dora may link to third-party content or services. Their privacy practices are governed by their own terms and policies.',
    ],
  },
  {
    id: 'changes-to-this-policy',
    title: '16. Changes to this Privacy Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. We will post the updated version with a revised "Last updated" date. If required by law, we will provide additional notice or request consent.',
    ],
  },
  {
    id: 'contact',
    title: '17. Contact',
    paragraphs: ['For privacy questions or requests, contact:'],
    list: ['hello@doraguide.com'],
  },
];

const Privacy = () => {
  return (
    <section className="content-page content-page--legal" id="top">
      <div className="content-page__inner">
        <div className="legal-doc__header content-page__hero">
          <h1>Privacy Policy</h1>
          <p className="content-page__intro">
            This Privacy Policy explains what Dora collects, how we use it, and
            the choices you have when you use the Dora app and related services.
          </p>
        </div>

        <div className="legal-doc__main">
          <div className="legal-doc">
            <section className="legal-doc__section" id="summary">
              <h2>Summary</h2>
              <ul className="content-page__list">
                {summaryPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>

            <div className="legal-doc__sections">
              {sections.map((section) => (
                <section
                  className="legal-doc__section"
                  id={section.id}
                  key={section.id}
                >
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.lead ? <p>{section.lead}</p> : null}
                  {section.list ? (
                    <ul className="content-page__list">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.groups?.map((group) => (
                    <div className="content-page__subsection" key={group.label}>
                      <h3>{group.label}</h3>
                      <ul className="content-page__list">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {section.closingLead ? <p>{section.closingLead}</p> : null}
                  {section.closingList ? (
                    <ul className="content-page__list">
                      {section.closingList.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.closing ? <p>{section.closing}</p> : null}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
