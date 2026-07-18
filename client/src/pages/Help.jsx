import { useState } from 'react';
import { HELP_EMAIL, helpSections } from './helpContent.js';
import './Help.css';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const HelpInline = ({ parts }) => (
  <>
    {parts.map((part, index) => {
      if (part.bold) {
        return <strong key={index}>{part.text}</strong>;
      }

      if (part.link) {
        const isExternal = part.link.href.startsWith('http');

        return (
          <a
            key={index}
            href={part.link.href}
            {...(isExternal
              ? { target: '_blank', rel: 'noreferrer' }
              : undefined)}
          >
            {part.link.label}
          </a>
        );
      }

      return <span key={index}>{part.text}</span>;
    })}
  </>
);

const HelpAnswerBlock = ({ block }) => {
  if (block.type === 'p') {
    return (
      <p className="help-page__answer-text">
        {block.parts ? (
          <HelpInline parts={block.parts} />
        ) : (
          block.text
        )}
      </p>
    );
  }

  if (block.type === 'ul') {
    return (
      <ul className="help-page__answer-list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === 'ol') {
    return (
      <ol className="help-page__answer-list help-page__answer-list--ordered">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  return null;
};

const HelpAccordionItem = ({ item, itemId, isOpen, onToggle }) => {
  const panelId = `help-panel-${itemId}`;

  return (
    <article className={`help-page__item ${isOpen ? 'is-open' : ''}`}>
      <button
        className="help-page__question"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="help-page__question-label">{item.question}</span>
        <span className="help-page__question-icon" aria-hidden="true">
          +
        </span>
      </button>
      <div
        className="help-page__answer-wrap"
        id={panelId}
        aria-hidden={!isOpen}
      >
        <div className="help-page__answer-inner">
          {item.answer.map((block, index) => (
            <HelpAnswerBlock block={block} key={`${itemId}-${index}`} />
          ))}
        </div>
      </div>
    </article>
  );
};

const Help = () => {
  const [openQuestionId, setOpenQuestionId] = useState(null);

  const toggleQuestion = (itemId) => {
    setOpenQuestionId((current) => (current === itemId ? null : itemId));
  };

  return (
    <section className="content-page content-page--legal help-page">
      <div className="content-page__inner">
        <div className="content-page__hero help-page__hero">
          <h1>How can we help?</h1>
          <p className="content-page__intro">
            Find answers to common questions about using Dora. If you still need
            help, contact us directly.
          </p>
        </div>

        <div className="help-page__sections">
          {helpSections.map((section) => (
            <section
              className="help-page__section"
              key={section.title}
              aria-labelledby={`help-section-${slugify(section.title)}`}
            >
              <h2
                className="help-page__section-title"
                id={`help-section-${slugify(section.title)}`}
              >
                {section.title}
              </h2>
              <div className="help-page__list">
                {section.items.map((item) => {
                  const itemId = `${slugify(section.title)}-${slugify(item.question)}`;

                  return (
                    <HelpAccordionItem
                      key={itemId}
                      item={item}
                      itemId={itemId}
                      isOpen={openQuestionId === itemId}
                      onToggle={() => toggleQuestion(itemId)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="help-page__footer">
          <div className="content-page__actions help-page__actions">
            <a className="primary-btn" href={`mailto:${HELP_EMAIL}`}>
              Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Help;
