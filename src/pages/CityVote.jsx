import { useEffect, useMemo, useState } from 'react';
import './CityVote.css';

const voteOptions = [
  {
    city: 'London',
    country: 'UK',
  },
  {
    city: 'Rome',
    country: 'Italy',
  },
  {
    city: 'Madrid',
    country: 'Spain',
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
  },
  {
    city: 'Berlin',
    country: 'Germany',
  },
  {
    city: 'Florence',
    country: 'Italy',
  },
  {
    city: 'Venice',
    country: 'Italy',
  },
  {
    city: 'Athens',
    country: 'Greece',
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
  },
  {
    city: 'Istanbul',
    country: 'Türkiye',
  },
  {
    city: 'Mexico City',
    country: 'Mexico',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
  },
];

const CityVote = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [savedVote, setSavedVote] = useState('');
  const [voteTotals, setVoteTotals] = useState({});
  const [status, setStatus] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('');

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
          setStatusMessage(`You voted for ${data.city} today.`);
        } else {
          setStatusMessage('Choose one city from the list.');
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
          setSavedVote(data.city);
          setSelectedCity(data.city);
          setVoteTotals(data.totals || {});
          setStatusMessage(`You voted for ${data.city} today.`);
        } else {
          setStatusMessage(data.message || 'Vote could not be submitted.');
        }
        setStatus('ready');
        return;
      }

      setSavedVote(data.city);
      setSelectedCity(data.city);
      setVoteTotals(data.totals || {});
      setStatusMessage(`Your vote for ${data.city} has been recorded.`);
      setStatus('ready');
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
      setVoteTotals(data.totals || {});
      setStatus('ready');
      setStatusMessage('Local test vote reset.');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error.message);
    }
  };

  return (
    <section className="city-vote">
      <div className="city-vote__inner">
        <header className="city-vote__hero">
          <p className="city-vote__eyebrow">Next city</p>
          <h1>Where should Dora go next?</h1>
          <p>
            Vote for the city you would most like to see added to Dora’s
            walking audio guides.
          </p>
        </header>

        {savedVote ? (
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
                  >
                    <div
                      className="city-vote__result-bar"
                      style={{ width: `${width}%` }}
                    >
                      <span>{option.label}</span>
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
        ) : (
          <form className="city-vote__form" onSubmit={handleSubmit}>
            <fieldset className="city-vote__fieldset">
              <legend className="sr-only">Choose one city</legend>
              <div className="city-vote__grid">
                {sortedCities.map((option, index) => (
                  <label
                    className={`city-vote__option ${
                      selectedCity === option.city ? 'is-selected' : ''
                    }`}
                    key={option.city}
                  >
                    <input
                      type="radio"
                      name="next-city"
                      value={option.city}
                      checked={selectedCity === option.city}
                      onChange={() => setSelectedCity(option.city)}
                    />
                    <span className="city-vote__option-mark" aria-hidden="true" />
                    <span className="city-vote__option-content">
                      <span className="city-vote__option-topline">
                        <span className="city-vote__option-rank">
                          {index + 1}
                        </span>
                        <span className="city-vote__option-name">
                          {option.city}, {option.country}
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
              <p className="city-vote__status" role="status">
                {statusMessage}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default CityVote;
