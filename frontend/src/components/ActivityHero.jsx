import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ChevronDown, Brain } from "lucide-react";
import * as Icons from "lucide-react";

export default function ActivityHero({ recommendation }) {
  const navigate = useNavigate();
  const [showWhy, setShowWhy] = useState(false);
  const { activity, reason } = recommendation;
  const Icon = Icons[activity.icon] || Brain;

  return (
    <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="pill pill-gold" style={{ marginBottom: 10 }}>Today's cognitive activity</p>
          <h2 style={{ fontSize: 26 }}>{activity.title}</h2>
          <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 4 }}>
            {activity.category} · Level {activity.baseLevel} · 5–7 minutes
          </p>
        </div>
        <div
          style={{ width: 64, height: 64, borderRadius: 18, background: "var(--pine-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <Icon size={30} color="var(--pine-dark)" />
        </div>
      </div>

      <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate(`/game/${activity.id}`)}>
        <Play size={20} /> Start activity
      </button>

      <div>
        <p style={{ fontSize: 14, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="pill pill-pine" style={{ padding: "3px 10px", fontSize: 12.5 }}>AI recommended</span>
          Based on your recent performance
        </p>
        <button
          onClick={() => setShowWhy((s) => !s)}
          style={{ background: "none", border: "none", color: "var(--pine)", fontWeight: 600, fontSize: 14.5, padding: 0, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}
        >
          Why this activity? <ChevronDown size={16} style={{ transform: showWhy ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {showWhy && (
          <p style={{ marginTop: 8, fontSize: 14.5, color: "var(--ink)", background: "var(--paper-deep)", padding: "10px 14px", borderRadius: 10 }}>
            {reason} This reflects activity performance, not a medical assessment.
          </p>
        )}
      </div>
    </div>
  );
}
