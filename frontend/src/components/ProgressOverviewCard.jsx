import { useNavigate } from "react-router-dom";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";

const LABELS = { memory: "Memory", attention: "Attention", language: "Recognition", reasoning: "Reasoning", orientation: "Orientation" };

function trendFor(value) {
  // Simple, non-alarming framing: only "Improving" or "Steady" surface here —
  // any decline signal belongs on the caregiver dashboard, not this card.
  if (value >= 75) return { label: "Improving", icon: TrendingUp, cls: "trend-up" };
  return { label: "Steady", icon: Minus, cls: "" };
}

export default function ProgressOverviewCard({ domains, overallPct }) {
  const navigate = useNavigate();
  const entries = Object.entries(domains).slice(0, 4);

  return (
    <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>My progress overview</p>
        <p style={{ color: "var(--muted)", fontSize: 14.5 }}>How you've been doing across activity types.</p>
      </div>

      <div className="grid grid-2" style={{ gap: 14 }}>
        {entries.map(([key, val]) => {
          const t = trendFor(val);
          const Icon = t.icon;
          return (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 14.5, color: "var(--muted)" }}>{LABELS[key] || key}</span>
              <span className={`trend ${t.cls}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 15 }}>
                <Icon size={15} /> {t.label}
              </span>
            </div>
          );
        })}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14.5 }}>
          <span style={{ color: "var(--muted)" }}>Overall progress</span>
          <span style={{ fontWeight: 700 }}>{overallPct}%</span>
        </div>
        <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${overallPct}%` }} /></div>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 8 }}>Great job! Small steps every day make a difference.</p>
      </div>

      <button onClick={() => navigate("/progress")} style={{ background: "none", border: "none", color: "var(--pine)", fontWeight: 600, fontSize: 14.5, padding: 0, textAlign: "left" }}>
        View details →
      </button>
    </div>
  );
}
