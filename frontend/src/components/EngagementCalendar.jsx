import { useNavigate } from "react-router-dom";

// Deterministic demo engagement data keyed by day-of-month, standing in for
// real session history until this reads from stored sessions per date.
function demoStatusForDay(day) {
  if (day > 29) return null; // today is Aug 29, 2026 in this demo
  const pattern = day % 5;
  if (pattern === 0) return "missed";
  if (pattern === 1) return "partial";
  return "done";
}

const DOT_COLOR = { done: "#2c7a4f", partial: "var(--gold)", missed: "var(--line)" };

export default function EngagementCalendar({ monthLabel = "August 2026", daysInMonth = 31, startWeekday = 5 }) {
  const navigate = useNavigate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const completed = 18, missed = 4;

  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 17 }}>Activity &amp; engagement</p>
        <span style={{ color: "var(--muted)", fontSize: 14.5 }}>{monthLabel}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 14 }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} style={{ textAlign: "center", fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{d}</span>
        ))}
        {cells.map((day, i) => {
          const status = day ? demoStatusForDay(day) : null;
          return (
            <div key={i} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 8, background: day === 29 ? "var(--pine-light)" : "transparent" }}>
              {day && <span style={{ fontSize: 13 }}>{day}</span>}
              {status && <span style={{ width: 6, height: 6, borderRadius: "50%", background: DOT_COLOR[status], marginTop: 2 }} />}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, fontSize: 13.5, color: "var(--muted)", marginBottom: 14 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot color="#2c7a4f" /> Completed</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot color="var(--gold)" /> Partial</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot color="var(--line)" /> Missed</span>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, fontSize: 14.5, display: "flex", flexDirection: "column", gap: 4, color: "var(--ink)" }}>
        <span>This month · Completed: <strong>{completed}</strong> · Missed: <strong>{missed}</strong></span>
        <span style={{ color: "var(--muted)" }}>Current participation: Good · Last activity: Today</span>
      </div>

      <button onClick={() => navigate("/progress")} style={{ background: "none", border: "none", color: "var(--pine)", fontWeight: 600, fontSize: 14.5, padding: 0, marginTop: 10 }}>
        View activity history →
      </button>
    </div>
  );
}

function Dot({ color }) {
  return <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />;
}
