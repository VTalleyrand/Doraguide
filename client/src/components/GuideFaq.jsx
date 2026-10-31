import { useState } from 'react';
import './Faq/Faq.css';
import './GuideFaq.css';

const GuideFaq = ({ questions, title = 'Frequently Asked Questions' }) => {
  const [openQuestions, setOpenQuestions] = useState(() => new Set());

  const toggleQuestion = (question) => {
    setOpenQuestions((currentQuestions) => {
      const nextQuestions = new Set(currentQuestions);
      if (nextQuestions.has(question)) {
        nextQuestions.delete(question);
      } else {
        nextQuestions.add(question);
      }
      return nextQuestions;
    });
  };

  return (
    <section className="faq guide-faq" aria-labelledby="guide-faq-title">
      <div className="faq__inner">
        <div className="faq__header">
          <h2 className="faq__title" id="guide-faq-title">
            {title}
          </h2>
        </div>
        <div className="faq__list">
          {questions.map(({ question, answer }) => {
            const panelId = `guide-faq-panel-${question
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')}`;
            const isOpen = openQuestions.has(question);

            return (
              <article className={`faq__item ${isOpen ? 'is-open' : ''}`} key={question}>
                <button
                  className="faq__question"
                  type="button"
                  onClick={() => toggleQuestion(question)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="faq__question-label">{question}</span>
                  <span className="faq__question-icon" aria-hidden="true">
                    +
                  </span>
                </button>
                <div className="faq__answer-wrap" id={panelId} aria-hidden={!isOpen}>
                  <p className="faq__answer">{answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GuideFaq;
