export const HELP_EMAIL = 'hello@volele.co';

export const helpSections = [
  {
    title: 'About Dora',
    items: [
      {
        question: 'What is Dora?',
        answer: [
          {
            type: 'p',
            text: 'Dora helps you understand the world around you through the stories behind real places. Open the app, choose a nearby landmark, street, building, park, or neighborhood, and press play to discover why it matters.',
          },
        ],
      },
      {
        question: 'How does it work?',
        answer: [
          {
            type: 'p',
            text: 'Open Dora and start from where you are. You can discover nearby places, follow a recommended route, create your own, or shake your phone and let Dora surprise you. Tap a place, press play, and listen.',
          },
        ],
      },
      {
        question: 'Where is Dora available?',
        answer: [
          {
            type: 'p',
            text: 'Dora is currently available in New York, Paris, Milan, Palermo, Amsterdam, and Barcelona, with more cities being added over time.',
          },
        ],
      },
    ],
  },
  {
    title: 'Getting started',
    items: [
      {
        question: 'How do I listen to a story?',
        answer: [
          {
            type: 'p',
            parts: [
              { text: 'Open the ' },
              { bold: true, text: 'Map' },
              { text: ' tab, select a place, and tap play.' },
            ],
          },
          {
            type: 'p',
            text: 'Stories opened directly from the map can be played from anywhere. Free accounts receive a one-minute preview unless the story is marked as free. An active pass or subscription unlocks the full story.',
          },
          {
            type: 'p',
            text: 'When following a route, each stop unlocks once you are close to it. Select the stop and press play after you arrive.',
          },
          {
            type: 'p',
            text: 'When a transcript is available, you can open it from the story player and read along. Transcript access follows your audio access, so you will see either the preview or the full story.',
          },
        ],
      },
      {
        question: 'Can I use Dora from home?',
        answer: [
          {
            type: 'p',
            text: 'Yes. You can browse Dora’s cities, places, and routes from anywhere.',
          },
          {
            type: 'p',
            text: 'You can also listen to one-minute previews, stories marked as free, and any full stories included with an active pass or subscription.',
          },
          {
            type: 'p',
            text: 'Route stops are designed to be experienced on location, so their audio only unlocks when you are near each stop.',
          },
        ],
      },
    ],
  },
  {
    title: 'Finding places',
    items: [
      {
        question: 'Why can’t I see any places around me?',
        answer: [
          {
            type: 'p',
            text: 'Make sure the city is currently on Dora, the app has access to your location and that your iPhone has an internet connection.',
          },
          {
            type: 'p',
            parts: [{ text: 'On your iPhone, open:' }],
          },
          {
            type: 'p',
            parts: [
              {
                bold: true,
                text: 'Settings → Privacy & Security → Location Services → Dora',
              },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'Choose ' },
              { bold: true, text: 'While Using the App' },
              { text: ' and turn on ' },
              { bold: true, text: 'Precise Location' },
              { text: ' for the best nearby results and walking routes.' },
            ],
          },
          {
            type: 'p',
            parts: [
              {
                text: 'Dora may not yet have stories in your current area. You can still open the ',
              },
              { bold: true, text: 'Routes' },
              { text: ' tab and use ' },
              { bold: true, text: 'Around the World' },
              { text: ' to browse a supported city.' },
            ],
          },
        ],
      },
      {
        question: 'Why is a story still locked when I am nearby?',
        answer: [
          {
            type: 'p',
            text: 'Location locking only applies to stories played as stops in an active route.',
          },
          {
            type: 'p',
            text: 'Move within approximately 150 metres or 500 feet of the stop, keep Dora open for a few seconds, and try again.',
          },
          {
            type: 'p',
            text: 'Tall buildings, indoor spaces, poor GPS reception, or disabled Precise Location can make your reported position less accurate. Once a stop has been unlocked for that route, it remains unlocked.',
          },
          {
            type: 'p',
            text: 'When you open a story directly from the map and only see a one-minute preview, this is an access limit rather than a location lock. Choose a story marked as free or activate a pass or subscription to hear the full version.',
          },
        ],
      },
      {
        question: 'How do I search for a place?',
        answer: [
          {
            type: 'p',
            parts: [
              { text: 'Use the search field on the ' },
              { bold: true, text: 'Map' },
              {
                text: ' tab to find Dora stories by place name, landmark, neighborhood, or category.',
              },
            ],
          },
          {
            type: 'p',
            text: 'Search results only include places currently covered by Dora.',
          },
          {
            type: 'p',
            parts: [
              { text: 'To browse another supported city, open the ' },
              { bold: true, text: 'Routes' },
              { text: ' tab, select ' },
              { bold: true, text: 'Around the World' },
              { text: ', and search for the city.' },
            ],
          },
        ],
      },
      {
        question: 'Can I suggest a place or city?',
        answer: [
          {
            type: 'p',
            parts: [
              { text: 'Yes. ' },
              { link: { href: `mailto:${HELP_EMAIL}`, label: 'Email us' } },
              { text: ' with the name and location of the place or city you would like Dora to cover.' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Stories',
    items: [
      {
        question: 'How are Dora’s stories created?',
        answer: [
          {
            type: 'p',
            text: 'Dora’s stories are researched, written, and reviewed by our team using historical and cultural sources. The finished scripts are narrated.',
          },
        ],
      },
      {
        question: 'I noticed something inaccurate. How can I report it?',
        answer: [
          {
            type: 'p',
            parts: [
              { link: { href: `mailto:${HELP_EMAIL}`, label: 'Email us' } },
              { text: ' and include:' },
            ],
          },
          {
            type: 'ul',
            items: [
              'The name of the place',
              'The information you believe is incorrect',
              'A source or reference, when available',
            ],
          },
          {
            type: 'p',
            text: 'We review reported corrections and update stories when appropriate.',
          },
        ],
      },
      {
        question: 'Can I read instead of listen?',
        answer: [
          {
            type: 'p',
            text: 'Yes. Every story includes a transcript, so you can read, listen, or follow along while the audio plays.',
          },
          {
            type: 'p',
            text: 'Free previews include the corresponding preview section of the transcript. Full transcript access follows the same access rules as full audio.',
          },
        ],
      },
      {
        question: 'Can I download stories for offline listening?',
        answer: [
          {
            type: 'p',
            text: 'Dora does not currently include a manual download option.',
          },
          {
            type: 'p',
            text: 'Eligible audio is automatically cached as you use the app, and Dora may prefetch audio for your current supported city while you are connected to Wi-Fi.',
          },
          {
            type: 'p',
            text: 'Previously cached audio may continue to play without an internet connection. New stories, maps, search results, walking routes, transcripts, and account updates may still require internet access, so the complete Dora experience should not be considered fully available offline.',
          },
        ],
      },
    ],
  },
  {
    title: 'Routes',
    items: [
      {
        question: 'Can I build my own route?',
        answer: [
          {
            type: 'p',
            text: 'Yes. You can search for places, save the ones that interest you, and build a custom route around the stories you want to hear.',
          },
          {
            type: 'p',
            text: 'A custom route must contain at least three places before it can be started.',
          },
        ],
      },
      {
        question: 'How do routes work?',
        answer: [
          {
            type: 'p',
            text: 'Choose a recommended route or create your own.',
          },
          {
            type: 'p',
            text: 'Dora displays the route stops on the map and can calculate a walking path from your current location through each stop.',
          },
          {
            type: 'p',
            parts: [
              {
                text: 'Select a stop and press play once you are close enough for its audio to unlock. Dora saves your progress, so an unfinished route can later appear under ',
              },
              { bold: true, text: 'Continue' },
              { text: '.' },
            ],
          },
        ],
      },
      {
        question: 'Do I need to begin at a specific starting point?',
        answer: [
          { type: 'p', text: 'No.' },
          {
            type: 'p',
            text: 'When the walking path is enabled, Dora begins from your current location and can optimize the order of the remaining stops.',
          },
          {
            type: 'p',
            text: 'You can also reorder the stops while the active walking path is displayed.',
          },
        ],
      },
      {
        question: 'Can I change the places in my route?',
        answer: [
          {
            type: 'p',
            text: 'You can add, remove, or reorder places in a custom route before you begin making progress.',
          },
          {
            type: 'p',
            text: 'Once a route is underway, its saved list of stops is locked so that your progress remains consistent.',
          },
          {
            type: 'p',
            text: 'Recommended routes cannot be edited directly, but you can create your own custom version.',
          },
        ],
      },
    ],
  },
  {
    title: 'Shake',
    items: [
      {
        question: 'What happens when I shake my phone?',
        answer: [
          {
            type: 'p',
            parts: [
              { text: 'On the ' },
              { bold: true, text: 'Map' },
              {
                text: ' tab, shaking your iPhone selects a random Dora place within approximately 8 kilometres or 5 miles of your current location.',
              },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'On the ' },
              { bold: true, text: 'Routes' },
              { text: ' tab, shaking creates a surprise ' },
              { bold: true, text: 'Serendipity' },
              { text: ' route using suitable nearby places.' },
            ],
          },
          {
            type: 'p',
            text: 'Shake again while viewing a Serendipity route to generate another suggestion.',
          },
        ],
      },
      {
        question: 'Shake is not working. What should I do?',
        answer: [
          {
            type: 'p',
            parts: [
              { text: 'Make sure Dora has ' },
              { bold: true, text: 'While Using the App' },
              { text: ' location access and that ' },
              { bold: true, text: 'Precise Location' },
              { text: ' is enabled.' },
            ],
          },
          {
            type: 'p',
            text: 'Shake also requires suitable Dora places near your current location, so it may not return a result outside a supported area.',
          },
          {
            type: 'p',
            parts: [
              { text: 'Try a clear, deliberate shake while the ' },
              { bold: true, text: 'Map' },
              { text: ' or ' },
              { bold: true, text: 'Routes' },
              { text: ' tab is visible.' },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'The ' },
              { bold: true, text: 'Haptic Feedback' },
              {
                text: ' setting only controls the confirmation vibration. It does not turn Shake on or off.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Roam with Friends',
    items: [
      {
        question: 'What is Roam with Friends?',
        answer: [
          {
            type: 'p',
            text: 'Roam with Friends allows a host to invite other Dora users into a live listening session.',
          },
          {
            type: 'p',
            text: 'The host chooses and controls the story, while Dora keeps playback synchronized for everyone in the group.',
          },
          {
            type: 'p',
            text: 'The host needs an active pass, subscription, or other eligible premium access. Invited participants can listen to the host’s full story access for free while the session remains active.',
          },
        ],
      },
      {
        question: 'Does everyone need Dora installed?',
        answer: [
          { type: 'p', text: 'Yes.' },
          {
            type: 'p',
            text: 'Each participant must have Dora installed, be signed in, and have an internet connection.',
          },
          {
            type: 'p',
            text: 'Participants join by opening the host’s invitation link or scanning the host’s QR code using the iPhone Camera.',
          },
          {
            type: 'p',
            text: 'The eight-character session code cannot be entered manually.',
          },
        ],
      },
      {
        question: 'Why is our audio not staying in sync?',
        answer: [
          {
            type: 'p',
            text: 'Make sure everyone has a stable internet connection and is using the latest version of Dora.',
          },
          {
            type: 'p',
            text: 'The host should keep the session active and use the host controls to play, pause, seek, or change stories.',
          },
          {
            type: 'p',
            text: 'When the session has ended, or the problem continues, leave the session and ask the host to create and share a new one.',
          },
        ],
      },
    ],
  },
  {
    title: 'Free access and passes',
    items: [
      {
        question: 'What’s free and what requires a pass?',
        answer: [
          {
            type: 'p',
            text: 'Dora is free to browse and try. City stories, neighborhood stories, and select popular locations are available without paying.',
          },
          {
            type: 'p',
            text: 'All other stories include a one-minute preview, so you can listen before unlocking them.',
          },
          {
            type: 'p',
            text: 'Dora offers 24-hour, 3-day, and 7-day non-renewing passes, as well as monthly and yearly subscriptions.',
          },
          {
            type: 'p',
            text: 'A pass or subscription unlocks full access to every story and route, plus Live Activities, full transcripts, and the ability to host Roam with Friends sessions. Friends can join a Roam session for free.',
          },
        ],
      },
      {
        question: 'How long is the free preview?',
        answer: [
          {
            type: 'p',
            text: 'The preview for a regular locked story is one minute.',
          },
          {
            type: 'p',
            text: 'Some stories are marked as free and can be heard in full without a pass or subscription.',
          },
        ],
      },
      {
        question: 'How do I manage or cancel my purchase?',
        answer: [
          {
            type: 'p',
            parts: [
              { text: 'Open ' },
              { bold: true, text: 'Profile → Plan' },
              { text: ' in Dora to view plan options or restore purchases.' },
            ],
          },
          {
            type: 'p',
            text: 'The 24-hour, 3-day, and 7-day passes do not renew and expire automatically, so there is nothing to cancel.',
          },
          {
            type: 'p',
            parts: [
              {
                text: 'Monthly and yearly subscriptions renew through Apple until cancelled. To manage a subscription on your iPhone, open:',
              },
            ],
          },
          {
            type: 'p',
            parts: [
              {
                bold: true,
                text: 'Settings → Your Name → Subscriptions → Dora',
              },
            ],
          },
          {
            type: 'p',
            text: 'Deleting Dora does not cancel an active subscription.',
          },
        ],
      },
      {
        question: 'How do I restore a previous purchase?',
        answer: [
          { type: 'p', parts: [{ text: 'Open Dora and go to:' }] },
          {
            type: 'p',
            parts: [{ bold: true, text: 'Profile → Plan → Restore Purchases' }],
          },
          {
            type: 'p',
            text: 'Make sure your iPhone is signed in to the same Apple Account used for the purchase.',
          },
          {
            type: 'p',
            text: 'You must also be signed in to your Dora account so that the restored access can be connected to your profile.',
          },
        ],
      },
      {
        question: 'I restored my purchase, but it is still not appearing.',
        answer: [
          {
            type: 'p',
            text: 'Confirm that you are using the same Apple Account that made the purchase and that your iPhone has an internet connection.',
          },
          {
            type: 'p',
            parts: [
              {
                text: 'For a monthly or yearly subscription, confirm that it is active under:',
              },
            ],
          },
          {
            type: 'p',
            parts: [
              { bold: true, text: 'Settings → Your Name → Subscriptions' },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'Then reopen Dora, go to ' },
              { bold: true, text: 'Profile → Plan' },
              { text: ', and select ' },
              { bold: true, text: 'Restore Purchases' },
              { text: ' again.' },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'If your access still does not appear, email ' },
              {
                link: {
                  href: `mailto:${HELP_EMAIL}`,
                  label: HELP_EMAIL,
                },
              },
              {
                text: ' with your Dora account email and Apple purchase receipt.',
              },
            ],
          },
          {
            type: 'p',
            text: 'Do not send payment-card information.',
          },
        ],
      },
      {
        question: 'Can I request a refund?',
        answer: [
          {
            type: 'p',
            text: 'Apple handles payments and refund decisions for Dora purchases.',
          },
          {
            type: 'p',
            parts: [
              { text: 'Sign in at ' },
              {
                link: {
                  href: 'https://reportaproblem.apple.com',
                  label: 'reportaproblem.apple.com',
                },
              },
              { text: ', choose ' },
              { bold: true, text: 'Request a refund' },
              { text: ', and select the relevant Dora purchase.' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Account and privacy',
    items: [
      {
        question: 'Do I need an account?',
        answer: [
          { type: 'p', text: 'Yes. Dora requires an account.' },
          {
            type: 'p',
            text: 'You can sign in with Apple, Google, or email.',
          },
          {
            type: 'p',
            text: 'Your account keeps your profile, preferences, favorites, custom routes, route progress, purchases, and access status connected to you across sessions and supported devices.',
          },
        ],
      },
      {
        question: 'How do I delete my account?',
        answer: [
          { type: 'p', parts: [{ text: 'Open:' }] },
          {
            type: 'p',
            parts: [{ bold: true, text: 'Profile → Account → Delete Account' }],
          },
          {
            type: 'p',
            text: 'Confirm the deletion inside the app.',
          },
          {
            type: 'p',
            text: 'This permanently deletes your Dora account and its associated profile data and cannot be undone.',
          },
          {
            type: 'p',
            text: 'Deleting your Dora account does not cancel an App Store subscription. Cancel any active subscription separately through Apple.',
          },
        ],
      },
      {
        question: 'How does Dora use my location?',
        answer: [
          {
            type: 'p',
            text: 'Dora uses your location while you are using the app to:',
          },
          {
            type: 'ul',
            items: [
              'Show your position',
              'Identify your current city',
              'Find nearby stories',
              'Recommend relevant routes',
              'Build walking paths',
              'Determine when a stop in an active route can be unlocked',
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'Dora does not require ' },
              { bold: true, text: 'Always' },
              {
                text: ' location access for its core experience and does not use your location to track you for advertising.',
              },
            ],
          },
          {
            type: 'p',
            text: 'You can change your location permissions at any time in iPhone Settings.',
          },
          {
            type: 'p',
            parts: [
              { text: 'For more information, read our ' },
              { link: { href: '/privacy', label: 'Privacy Policy' } },
              { text: '.' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Troubleshooting',
    items: [
      {
        question: 'Dora is not working properly. What should I do?',
        answer: [
          { type: 'p', text: 'Try the following:' },
          {
            type: 'ol',
            items: [
              'Check that you have an active internet connection.',
              'Close and reopen Dora.',
              'Confirm that location access and Precise Location are enabled.',
              'Update Dora to the latest version available in the App Store.',
              'Restart your iPhone.',
            ],
          },
          {
            type: 'p',
            text: 'If the problem continues, contact us and describe what happened.',
          },
        ],
      },
      {
        question: 'The map is not updating my location.',
        answer: [
          { type: 'p', parts: [{ text: 'Open:' }] },
          {
            type: 'p',
            parts: [
              {
                bold: true,
                text: 'Settings → Privacy & Security → Location Services → Dora',
              },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'Choose ' },
              { bold: true, text: 'While Using the App' },
              { text: ' and turn on ' },
              { bold: true, text: 'Precise Location' },
              { text: '.' },
            ],
          },
          {
            type: 'p',
            parts: [
              { text: 'Return to Dora, open the ' },
              { bold: true, text: 'Map' },
              { text: ' tab, and tap the location button.' },
            ],
          },
          {
            type: 'p',
            text: 'Moving outdoors or away from tall buildings may also improve GPS accuracy.',
          },
        ],
      },
      {
        question: 'The audio is not playing.',
        answer: [
          { type: 'p', text: 'Check that:' },
          {
            type: 'ul',
            items: [
              'Your media volume is turned up',
              'Your iPhone is not connected to an unintended Bluetooth device',
              'You have an internet connection, unless the audio was previously cached',
              'Your pass or subscription is active when playing a full locked story',
              'You are within approximately 150 metres or 500 feet when the story is part of an active route',
            ],
          },
          { type: 'p', text: 'Then close and reopen the story.' },
          {
            type: 'p',
            parts: [{ text: 'If your paid access is missing, go to:' }],
          },
          {
            type: 'p',
            parts: [{ bold: true, text: 'Profile → Plan → Restore Purchases' }],
          },
        ],
      },
      {
        question: 'How do I report a bug?',
        answer: [
          {
            type: 'p',
            parts: [
              { link: { href: `mailto:${HELP_EMAIL}`, label: 'Email us' } },
              { text: ' and include:' },
            ],
          },
          {
            type: 'ul',
            items: [
              'What you were trying to do',
              'What happened instead',
              'The city, place, route, or feature involved',
              'Your iPhone model',
              'Your iOS version',
              'Your Dora version and build number, shown at the bottom of the Profile tab',
              'A screenshot or screen recording, when possible',
            ],
          },
          {
            type: 'p',
            text: 'Do not include your password, full payment details, or other sensitive information.',
          },
        ],
      },
    ],
  },
  {
    title: 'Contact us',
    items: [
      {
        question: 'Still need help?',
        answer: [
          {
            type: 'p',
            parts: [
              {
                link: { href: `mailto:${HELP_EMAIL}`, label: 'Email us' },
              },
              { text: ' and include as much relevant detail as possible.' },
            ],
          },
          {
            type: 'p',
            text: 'We read every message and will respond as soon as we can.',
          },
          { type: 'p', text: 'You can also contact us to:' },
          {
            type: 'ul',
            items: [
              'Report incorrect information',
              'Suggest a place or city',
              'Share feedback',
              'Report a technical problem',
              'Request help with your account or purchase',
            ],
          },
        ],
      },
    ],
  },
];
