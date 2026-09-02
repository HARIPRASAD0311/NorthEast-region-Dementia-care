import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";

export default function ActivityCard({ activity, level = 1, onSelect }) {
  const navigate = useNavigate();
  const Icon = Icons[activity.icon] || Icons.Puzzle;

  function handleClick() {
    if (onSelect) {
      onSelect(activity);
    } else {
      navigate(`/game/${activity.id}`);
    }
  }

  return (
    <div
      className="card activity-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`Start ${activity.title}`}
    >
      <div className="activity-icon"><Icon size={26} /></div>
      <div className="activity-title">{activity.title}</div>
      <p style={{ color: "var(--muted)", fontSize: 15 }}>{activity.description}</p>
      <div className="activity-meta">
        <span className="pill pill-pine">Level {level}</span>
        <span className="pill pill-gold">{activity.badge || activity.category}</span>
      </div>
    </div>
  );
}
