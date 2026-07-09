import { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const items = [
    {
      question: 'What is Dora?',
      answer:
        'Dora helps you understand the world around you through the stories behind real places. Open the app, choose a nearby landmark, street, building, park, or neighborhood, and press play to discover why it matters.',
    },
    {
      question: 'How does it work?',
      answer:
        'Open Dora and start from where you are. You can discover nearby places, follow a recommended route, create your own, or shake your phone and let Dora surprise you. Tap a place, press play, and listen on location.',
    },
    {
      question: 'Where is Dora available?',
      answer:
        'Dora is currently available in New York, Paris, Milan, Palermo, Amsterdam, and Barcelona, with more cities being added over time.',
    },
    {
      question: 'Can I build my own route?',
      answer:
        'Yes. You can search for places, save the ones that interest you, and build a custom route around the stories you want to hear.',
    },
    {
      question: 'Can I read instead of listen?',
      answer:
        'Yes. Every story includes a transcript, so you can read, listen, or follow along while the audio plays.',
    },
    {
      question: 'What’s free and what requires a pass?',
      answer: [
        'Dora is free to browse and try. City stories, neighborhood stories, and select popular locations are available without paying.',
        'All other stories include a 1-minute preview, so you can listen before unlocking them.',
        'A pass or subscription unlocks full access to every story and route, plus Live Activities, full transcripts, and the ability to host Roam with Friends sessions. Friends can join a Roam session for free.',
      ],
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
                {(Array.isArray(item.answer) ? item.answer : [item.answer]).map(
                  (paragraph, index) => (
                    <p className="faq__answer" key={index}>
                      {paragraph}
                    </p>
                  )
                )}
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
