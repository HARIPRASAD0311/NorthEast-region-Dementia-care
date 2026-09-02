import NodeChain from './NodeChain.jsx';

export default function LevelComplete({ level, chainNodes, onNext, onReplay, isFinalLevel }) {
  return (
    <div className="screen level-complete-screen">
      <h2>Wonderful!</h2>
      <p className="level-complete-screen__subtitle">You completed Level {level}</p>

      <NodeChain nodes={chainNodes} />

      <div className="level-complete-screen__actions">
        {!isFinalLevel && (
          <button type="button" className="btn btn--primary btn--large" onClick={onNext}>
            Next Level
          </button>
        )}
        <button type="button" className="btn btn--secondary btn--large" onClick={onReplay}>
          Replay Level
        </button>
      </div>
    </div>
  );
}
