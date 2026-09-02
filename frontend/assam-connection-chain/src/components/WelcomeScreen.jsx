export default function WelcomeScreen({ onStartChain, onStartMemory }) {
  return (
    <div className="screen welcome-screen">
      <div className="welcome-screen__badge" aria-hidden="true">
        🌿
      </div>
      <h1>Assam Connection Chain</h1>
      <p className="welcome-screen__lead">
        Let's explore familiar Assam memories and connect things together — culture, nature, wildlife,
        food, and festivals, one gentle picture at a time.
      </p>

      <div className="welcome-screen__actions">
        <button type="button" className="btn btn--primary btn--large" onClick={onStartChain}>
          Start Connection Chain
        </button>
        <button type="button" className="btn btn--secondary btn--large" onClick={onStartMemory}>
          Remember &amp; Connect
        </button>
      </div>
    </div>
  );
}
