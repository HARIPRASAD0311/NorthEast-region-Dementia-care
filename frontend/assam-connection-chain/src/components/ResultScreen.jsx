export default function ResultScreen({ mode, score, totalPossible, roundsOrLevels, onPlayAgain, onMemoryMode, onBackHome }) {
  const isMemory = mode === 'memory';
  return (
    <div className="screen result-screen">
      <div className="result-screen__badge" aria-hidden="true">
        🎉
      </div>
      <h1>{isMemory ? 'Great Remembering!' : 'Activity Complete'}</h1>
      <p className="result-screen__lead">
        {isMemory
          ? 'You practiced remembering connections across Assam.'
          : 'You explored Assam through visual connections!'}
      </p>

      <div className="result-screen__stats">
        <div className="result-screen__stat">
          <span className="result-screen__stat-value">
            {score} / {totalPossible}
          </span>
          <span className="result-screen__stat-label">Score</span>
        </div>
        {!isMemory && (
          <div className="result-screen__stat">
            <span className="result-screen__stat-value">{roundsOrLevels}</span>
            <span className="result-screen__stat-label">Levels Completed</span>
          </div>
        )}
      </div>

      <div className="result-screen__actions">
        <button type="button" className="btn btn--primary btn--large" onClick={onPlayAgain}>
          Play Again
        </button>
        {!isMemory && (
          <button type="button" className="btn btn--secondary btn--large" onClick={onMemoryMode}>
            Memory Mode
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--large" onClick={onBackHome}>
          Back to Activities
        </button>
      </div>
    </div>
  );
}
