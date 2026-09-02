export default function ProgressCard({ title, sessions }) {
  const max = Math.max(...sessions.map((s) => s.accuracy), 100);
  return (
    <div className="card">
      <p style={{ fontWeight: 700, marginBottom: 14 }}>{title}</p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
        {sessions.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              title={`${s.accuracy}% on ${s.date}`}
              style={{
                width: "100%",
                height: `${(s.accuracy / max) * 100}px`,
                background: "var(--pine)",
                borderRadius: "6px 6px 0 0",
                minHeight: 4,
              }}
            />
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{s.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
