import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";

export default function AdaptiveRecommendation({ recommendation }) {
  const navigate = useNavigate();
  const { activity, reason } = recommendation;
  const Icon = Icons[activity.icon] || Icons.Puzzle;

  return (
    <div className="card" style={{ background: "var(--pine)", color: "var(--paper)", border: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Sparkles size={18} color="var(--gold)" />
        <span style={{ fontWeight: 700, fontSize: 15 }}>Recommended next</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,243,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={24} />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 18 }}>{activity.title}</p>
          <p style={{ fontSize: 14, color: "var(--paper-deep)" }}>{reason}</p>
        </div>
      </div>
      <button className="btn btn-gold btn-block" onClick={() => navigate(`/game/${activity.id}`)}>
        Start this activity
      </button>
    </div>
  );
}
