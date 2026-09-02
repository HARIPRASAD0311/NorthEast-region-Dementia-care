export default function ProgressBar({ current, total, stepLabel }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-wrap" role="group" aria-label={`Level ${current} of ${total}`}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">
        Level {current} of {total}
        {stepLabel ? ` · ${stepLabel}` : ''}
      </span>
    </div>
  );
}
