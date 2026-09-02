const LABELS = { memory: "Memory", attention: "Attention", language: "Language", reasoning: "Reasoning", orientation: "Orientation" };

export default function CognitiveScoreCard({ domains }) {
  return (
    <div className="card">
      <p style={{ fontWeight: 700, marginBottom: 4 }}>Cognitive performance profile</p>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 16 }}>
        Based on recent activity performance across domains.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {Object.entries(domains).map(([key, val]) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 15 }}>
              <span>{LABELS[key] || key}</span>
              <span style={{ fontWeight: 600 }}>{val}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
