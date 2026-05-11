import { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const items = [
    {
      question: 'What is Dora?',
      answer:
        'Dora is a narrated tour guide app that helps you explore, discover, and learn about cities through audio stories and curated routes of nearby sites or custom tours, alone or with friends.',
    },
    {
      question: 'How does it work?',
      answer:
        'Open Dora, search for a city, a landmark, or start right where you are. Tap a site, pick one of our recommended tours, or create your own. You can curate your perfect route, listen as you walk, or shake your phone and let the app surprise you.',
    },
    {
      question: 'Where is Dora available?',
      answer:
        'Dora is currently available in New York, Paris, Milan, Palermo, Amsterdam, and Barcelona, with more cities being added over time.',
    },
    {
      question: 'Can I build my own tour?',
      answer:
        'Absolutely. Search for cities and landmarks and add them to a custom tour.',
    },
    {
      question: 'What’s free and what requires a pass?',
      answer:
        'Dora is free to browse and preview. Purchasing a pass unlocks the full audio experience across single stories and tours.',
    },
  ];

  const toggleQuestion = (question) => {
    setOpenQuestion((current) => (current === question ? null : question));
  };

  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        <div className="faq__header">
          <h2 className="faq__title">Frequently Asked Questions</h2>
        </div>
        <div className="faq__list">
          {items.map((item) => {
            const panelId = `faq-panel-${item.question
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')}`;

            return (
              <article
                className={`faq__item ${
                  openQuestion === item.question ? 'is-open' : ''
                }`}
                key={item.question}
              >
              <button
                className="faq__question"
                type="button"
                onClick={() => toggleQuestion(item.question)}
                aria-expanded={openQuestion === item.question}
                aria-controls={panelId}
              >
                <span className="faq__question-label">{item.question}</span>
                <span className="faq__question-icon" aria-hidden="true">
                  +
                </span>
              </button>
              <div
                className="faq__answer-wrap"
                id={panelId}
                aria-hidden={openQuestion !== item.question}
              >
                <p className="faq__answer">{item.answer}</p>
              </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
