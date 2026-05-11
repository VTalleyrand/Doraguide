const summaryPoints = [
  'Dora gives you access to audio tours, place discovery, saved tours, shared listening features, and paid passes or subscriptions.',
  'You are responsible for using Dora safely and lawfully.',
  'Apple handles App Store billing, subscriptions, renewals, and refunds for in-app purchases.',
  'Dora is provided on an "as is" and "as available" basis to the extent permitted by law.',
];

const sections = [
  {
    id: 'acceptance-of-these-terms',
    title: '1. Acceptance of these Terms',
    paragraphs: [
      'By creating an account, purchasing a pass or subscription, or using Dora, you agree to these Terms and our Privacy Policy.',
      'If you do not agree, do not use Dora.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    paragraphs: [
      'You must be legally able to agree to these Terms in your place of residence in order to use Dora.',
      "If local law requires a parent or guardian's consent for you to use the service, you may only use Dora with that consent.",
    ],
  },
  {
    id: 'what-dora-provides',
    title: '3. What Dora provides',
    paragraphs: ['Dora provides features such as:'],
    list: [
      'place discovery',
      'audio playback',
      'custom and recommended tours',
      'shared listening and roaming sessions',
      'saved places and favorites',
      'passes and subscriptions',
      'optional notifications and account-based features',
    ],
    closing:
      'We may add, remove, improve, suspend, or change features at any time.',
  },
  {
    id: 'accounts',
    title: '4. Accounts',
    paragraphs: [
      'You may sign in using supported methods, including email/password, Sign in with Apple, or Google sign-in.',
      'You are responsible for:',
    ],
    list: [
      'keeping your account credentials secure',
      'keeping your account information reasonably accurate',
      'activity that occurs under your account, to the extent permitted by law',
    ],
  },
  {
    id: 'passes-subscriptions-and-billing',
    title: '5. Passes, subscriptions, and billing',
    paragraphs: ['Dora may offer:'],
    list: ['time-limited passes', 'recurring subscriptions'],
    closingLead:
      'Payments, billing, renewal, cancellation, and refunds for in-app purchases are handled by Apple through the App Store and your Apple account settings.',
    closingListLead: 'Important points:',
    closingList: [
      'recurring subscriptions renew automatically unless canceled through Apple',
      'pass and subscription pricing, availability, and features may change',
      'refund requests are generally handled by Apple, not Dora',
      'access to paid features may end when a pass or subscription expires',
      "some shared or collaborative features may depend on the host's access, the guest's account state, and current product rules",
    ],
  },
  {
    id: 'license-to-use-dora',
    title: '6. License to use Dora',
    paragraphs: [
      'Subject to these Terms, Dora grants you a limited, non-exclusive, non-transferable, revocable license to use the app for personal, non-commercial use.',
    ],
  },
  {
    id: 'what-you-may-not-do',
    title: '7. What you may not do',
    paragraphs: ['You may not:'],
    list: [
      'copy, reproduce, republish, or distribute Dora content except as allowed by law',
      'reverse engineer, decompile, or try to extract source code except where applicable law prevents that restriction',
      'interfere with the app, servers, or network operations',
      'use Dora for unlawful, abusive, fraudulent, or harmful purposes',
      'scrape, harvest, or systematically download Dora content',
      'misuse shared-tour or collaborative features',
    ],
  },
  {
    id: 'your-content-and-tour-data',
    title: '8. Your content and tour data',
    paragraphs: [
      'If you create tours, save content, upload profile information, or otherwise submit information through Dora:',
    ],
    list: [
      'you keep the rights you already have in your content',
      'you give Dora the rights reasonably necessary to host, sync, display, back up, and operate the service',
      'you confirm that you have the right to provide that content',
    ],
    closing:
      'You must not submit content that is unlawful, infringing, deceptive, defamatory, abusive, or otherwise harmful.',
  },
  {
    id: 'availability-and-service-quality',
    title: '9. Availability and service quality',
    paragraphs: [
      'Dora is provided on an "as is" and "as available" basis to the fullest extent allowed by law.',
      'We do not guarantee:',
    ],
    list: [
      'uninterrupted availability',
      'error-free operation',
      'perfectly accurate travel, mapping, routing, or place information',
      'that all content will remain available at all times',
    ],
    closing:
      'Travel conditions, access rules, opening times, routes, and local conditions may change without notice.',
  },
  {
    id: 'safety-and-real-world-use',
    title: '10. Safety and real-world use',
    paragraphs: [
      'Dora is an informational travel companion. It is not an emergency, safety, navigation, or professional advisory service.',
      'You are responsible for:',
    ],
    list: [
      'paying attention to your surroundings',
      'following local laws, signs, access restrictions, and safety instructions',
      'making your own decisions about routes, destinations, and movement in the real world',
    ],
    closing:
      'Do not rely on Dora as your only source for safety-critical information.',
  },
  {
    id: 'intellectual-property',
    title: '11. Intellectual property',
    paragraphs: [
      "The Dora app, branding, design, software, and non-user content are owned by Dora or its licensors and are protected by intellectual property laws.",
      "Except for the limited license above, these Terms do not grant you ownership of Dora's intellectual property.",
    ],
  },
  {
    id: 'suspension-and-termination',
    title: '12. Suspension and termination',
    paragraphs: [
      'You may stop using Dora at any time.',
      'We may suspend or terminate access if:',
    ],
    list: [
      'you violate these Terms',
      'we reasonably believe your use creates legal, security, or operational risk',
      'we are required to do so by law',
    ],
    closing:
      'Termination does not affect rights and obligations that by their nature should survive termination.',
  },
  {
    id: 'limitation-of-liability',
    title: '13. Limitation of liability',
    paragraphs: [
      "To the fullest extent permitted by law, Dora and its affiliates, officers, employees, contractors, and licensors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenues, data, goodwill, or business opportunities.",
      "To the fullest extent permitted by law, Dora's total liability for claims arising out of or relating to the service will not exceed the amount you paid to Dora through the app in the 12 months before the event giving rise to the claim, or, if greater, the minimum amount required by law.",
    ],
  },
  {
    id: 'indemnity',
    title: '14. Indemnity',
    paragraphs: [
      'To the extent permitted by law, you agree to indemnify and hold harmless Dora and its affiliates, officers, employees, contractors, and licensors from claims, damages, liabilities, and expenses arising from your misuse of the service, your content, or your violation of these Terms.',
    ],
  },
  {
    id: 'changes-to-these-terms',
    title: '15. Changes to these Terms',
    paragraphs: [
      'We may update these Terms from time to time. We will post the updated version with a revised "Last updated" date. Continued use of Dora after the updated Terms take effect means you accept them, except where additional consent is required by law.',
    ],
  },
  {
    id: 'contact',
    title: '16. Contact',
    paragraphs: ['For support or legal questions, contact:'],
    list: ['hello@doraguide.com'],
  },
];

const Terms = () => {
  return (
    <section className="content-page content-page--legal" id="top">
      <div className="content-page__inner">
        <div className="legal-doc__header content-page__hero">
          <h1>Terms of Service</h1>
          <p className="content-page__intro">
            These Terms of Service govern your use of the Dora app and related
            services.
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
                  {section.list ? (
                    <ul className="content-page__list">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.closingLead ? <p>{section.closingLead}</p> : null}
                  {section.closingListLead ? <p>{section.closingListLead}</p> : null}
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

export default Terms;
