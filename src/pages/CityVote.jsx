import { useEffect, useMemo, useState } from 'react';
import './CityVote.css';

const voteOptions = [
  {
    id: 'london',
    city: 'London',
    country: 'UK',
    color: '#6265FA',
    foreground: '#FFFFFF',
  },
  {
    id: 'rome',
    city: 'Rome',
    country: 'Italy',
    color: '#FE8101',
    foreground: '#FFFFFF',
  },
  {
    id: 'madrid',
    city: 'Madrid',
    country: 'Spain',
    color: '#E954A4',
    foreground: '#FFFFFF',
  },
  {
    id: 'lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    color: '#19B879',
    foreground: '#FFFFFF',
  },
  {
    id: 'berlin',
    city: 'Berlin',
    country: 'Germany',
    color: '#1F1B16',
    foreground: '#FFFFFF',
  },
  {
    id: 'florence',
    city: 'Florence',
    country: 'Italy',
    color: '#C99221',
    foreground: '#FFFFFF',
  },
  {
    id: 'venice',
    city: 'Venice',
    country: 'Italy',
    color: '#2187C9',
    foreground: '#FFFFFF',
  },
  {
    id: 'athens',
    city: 'Athens',
    country: 'Greece',
    color: '#2F80ED',
    foreground: '#FFFFFF',
  },
  {
    id: 'prague',
    city: 'Prague',
    country: 'Czech Republic',
    color: '#8D5CF6',
    foreground: '#FFFFFF',
  },
  {
    id: 'istanbul',
    city: 'Istanbul',
    country: 'Türkiye',
    color: '#D84B2A',
    foreground: '#FFFFFF',
  },
  {
    id: 'mexico-city',
    city: 'Mexico City',
    country: 'Mexico',
    color: '#0E9F6E',
    foreground: '#FFFFFF',
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    color: '#E5484D',
    foreground: '#FFFFFF',
  },
];

const CityVote = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [savedVote, setSavedVote] = useState('');
  const [voteTotals, setVoteTotals] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [status, setStatus] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('');
  const isThankYouView = Boolean(savedVote) && !showResults;
  const isResultView = Boolean(savedVote) && showResults;

  useEffect(() => {
    const loadVoteStatus = async () => {
      try {
        const response = await fetch('/api/votes/status');
        if (!response.ok) throw new Error('Unable to load vote status.');

        const data = await response.json();
        setVoteTotals(data.totals || {});
        if (data.votedToday && data.city) {
          setSavedVote(data.city);
          setSelectedCity(data.city);
          setShowResults(true);
          setStatusMessage(`You voted for ${data.city} today.`);
        } else {
          setStatusMessage('');
        }
        setStatus('ready');
      } catch {
        setStatus('unavailable');
        setStatusMessage('Voting is not available right now.');
      }
    };

    loadVoteStatus();
  }, []);

  const canSubmit = selectedCity && !savedVote && status === 'ready';
  const sortedCities = useMemo(() => voteOptions, []);
  const resultRows = useMemo(() => {
    const rows = voteOptions.map((option) => ({
      ...option,
      label: `${option.city}, ${option.country}`,
      votes: Number(voteTotals[option.city] || 0),
    }));
    const maxVotes = Math.max(...rows.map((option) => option.votes), 1);
    const totalVotes = rows.reduce((total, option) => total + option.votes, 0);

    return {
      maxVotes,
      totalVotes,
      rows: rows.sort((first, second) => {
        if (second.votes !== first.votes) return second.votes - first.votes;
        return first.city.localeCompare(second.city);
      }),
    };
  }, [voteTotals]);

  const showVoteResult = (city, totals, message, revealResults = false) => {
    setSavedVote(city);
    setSelectedCity(city);
    setVoteTotals(totals || {});
    setShowResults(revealResults);
    setStatusMessage(message);
    setStatus('ready');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus('submitting');

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.city) {
          showVoteResult(
            data.city,
            data.totals,
            `You voted for ${data.city} today.`,
            true,
          );
        } else {
          setStatusMessage(data.message || 'Vote could not be submitted.');
          setStatus('ready');
        }
        return;
      }

      showVoteResult(
        data.city,
        data.totals,
        `Your vote for ${data.city} has been recorded.`,
        false,
      );
    } catch {
      setStatus('ready');
      setStatusMessage('Vote could not be submitted. Try again later.');
    }
  };

  const handleLocalReset = async () => {
    setStatus('submitting');
    setStatusMessage('Resetting local test vote...');

    try {
      const response = await fetch('/api/votes/dev-reset', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Local reset is unavailable.');
      }

      setSavedVote('');
      setSelectedCity('');
      setShowResults(false);
      setVoteTotals(data.totals || {});
      setStatus('ready');
      setStatusMessage('');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error.message);
    }
  };

  return (
    <section className="city-vote">
      <div className="city-vote__inner">
        <header className="city-vote__hero">
          <h1>
            {isResultView
              ? 'Next city results'
              : isThankYouView
                ? 'Thank you for voting'
                : 'Pick the next city'}
          </h1>
          <p>
            {isResultView
              ? 'See which city Dora travelers want next.'
              : isThankYouView
                ? `${savedVote} is on the board.`
              : 'Select a city to vote for the one you would like to explore with Dora next.'}
          </p>
        </header>

        {status === 'loading' ? (
          <div className="city-vote__loading" role="status">
            Loading vote status...
          </div>
        ) : isResultView ? (
          <div className="city-vote__results" aria-live="polite">
            <p className="city-vote__status city-vote__status--center">
              {statusMessage}
            </p>
            <div className="city-vote__result-list">
              {resultRows.rows.map((option) => {
                const width = Math.max(
                  option.votes > 0 ? 28 : 34,
                  (option.votes / resultRows.maxVotes) * 100,
                );
                const percentage = resultRows.totalVotes
                  ? Math.round((option.votes / resultRows.totalVotes) * 100)
                  : 0;

                return (
                  <div
                    className={`city-vote__result ${
                      option.city === savedVote ? 'is-user-vote' : ''
                    } ${option.votes === 0 ? 'is-empty' : ''}`}
                    key={option.city}
                    style={{
                      '--city-vote-color': option.color,
                      '--city-vote-foreground': option.foreground,
                    }}
                  >
                    <div className="city-vote__result-body">
                      <span className="city-vote__result-label">
                        {option.label}
                      </span>
                      <span
                        className="city-vote__result-line"
                        style={{ width: `${width}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="city-vote__result-count">
                      {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                      {resultRows.totalVotes > 0 ? ` · ${percentage}%` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            {import.meta.env.DEV && (
              <div className="city-vote__actions">
                <button
                  className="secondary-btn city-vote__reset"
                  type="button"
                  onClick={handleLocalReset}
                  disabled={status === 'submitting'}
                >
                  Reset local test vote
                </button>
              </div>
            )}
          </div>
        ) : isThankYouView ? (
          <div className="city-vote__thanks" aria-live="polite">
            <button
              className="primary-btn"
              type="button"
              onClick={() => setShowResults(true)}
            >
              Show me results
            </button>
            {import.meta.env.DEV && (
              <button
                className="secondary-btn city-vote__reset"
                type="button"
                onClick={handleLocalReset}
                disabled={status === 'submitting'}
              >
                Reset local test vote
              </button>
            )}
          </div>
        ) : (
          <form className="city-vote__form" onSubmit={handleSubmit}>
            <fieldset className="city-vote__fieldset">
              <legend className="sr-only">Choose one city</legend>
              <div className="city-vote__grid">
                {sortedCities.map((option) => (
                  <label
                    className={`city-vote__option ${
                      selectedCity === option.city ? 'is-selected' : ''
                    }`}
                    key={option.city}
                    style={{
                      '--city-vote-color': option.color,
                      '--city-vote-foreground': option.foreground,
                    }}
                  >
                    <input
                      type="radio"
                      name="next-city"
                      value={option.city}
                      checked={selectedCity === option.city}
                      onChange={() => setSelectedCity(option.city)}
                    />
                    <span className="city-vote__option-content">
                      <span className="city-vote__option-topline">
                        <span className="city-vote__option-name">
                          <span>{option.city}, {option.country}</span>
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="city-vote__actions">
              <button className="primary-btn" type="submit" disabled={!canSubmit}>
                {status === 'submitting' ? 'Submitting...' : 'Submit vote'}
              </button>
              {statusMessage && (
                <p className="city-vote__status" role="status">
                  {statusMessage}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default CityVote;
