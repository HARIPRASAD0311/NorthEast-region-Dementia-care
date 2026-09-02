import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function StatCard({ label, value, trend, trendLabel }) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendClass = trend === "up" ? "trend-up" : trend === "down" ? "trend-down" : "";
  return (
    <div className="card stat-card">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {trendLabel && (
        <span className={`trend ${trendClass}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <TrendIcon size={14} /> {trendLabel}
        </span>
      )}
    </div>
  );
}
