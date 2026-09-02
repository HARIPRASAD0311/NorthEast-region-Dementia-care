import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { sampleUser, sessionHistory } from "../data/sampleUser.js";
import { loadSessions } from "../services/storage.js";
import { computeTrend } from "../services/adaptiveEngine.js";

const DOMAIN_LABELS = {
  memory: "Memory", attention: "Attention", language: "Language",
  reasoning: "Reasoning", orientation: "Orientation",
};

function domainColor(val) {
  if (val >= 75) return "#4ade80";
  if (val >= 58) return "var(--ga)";
  return "#f87171";
}

export default function Progress() {
  const stored = loadSessions([]);
  const combined = [...sessionHistory, ...stored].slice(-10);
  const trend = computeTrend(combined);

  const TrendIcon = trend.direction === "up" ? ArrowUp
    : trend.direction === "down" ? ArrowDown : Minus;
  const trendColor = trend.direction === "up" ? "#4ade80"
    : trend.direction === "down" ? "#f87171" : "var(--cream-dim)";

  const maxAccuracy = Math.max(...combined.map(s => s.accuracy), 1);

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 24 }}>
        <p className="g-label" style={{ marginBottom: 6 }}>Your Progress</p>
        <h1 className="g-page-title">Activity Performance</h1>
        <p className="g-page-sub">How performance has changed over recent sessions.</p>
      </div>

      <div className="g-card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: trendColor + "22", border: `2px solid ${trendColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendIcon size={18} color={trendColor} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 17, color: "var(--cream)", margin: 0 }}>
              {trend.direction === "up" ? "Improving" : trend.direction === "down" ? "Needs Attention" : "Steady"}
            </p>
            <p style={{ fontSize: 13, color: "var(--cream-dim)", margin: 0 }}>
              {trend.direction === "up"
                ? `Up ${trend.delta}% from earlier sessions`
                : trend.direction === "down"
                  ? `Down ${Math.abs(trend.delta)}% from earlier sessions`
                  : "Consistent performance across recent sessions"}
            </p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "var(--ga)", margin: 0 }}>{trend.recentAvg}%</p>
            <p style={{ fontSize: 12, color: "var(--cream-dim)", margin: 0 }}>avg accuracy</p>
          </div>
        </div>

        {combined.length > 0 && (
          <div>
            <p style={{ fontSize: 12, color: "var(--ga)", fontWeight: 700, marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Recent Sessions
            </p>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 72 }}>
              {combined.map((s, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    title={`${s.activity}: ${s.accuracy}%`}
                    style={{
                      width: "100%",
                      height: `${Math.max(6, (s.accuracy / maxAccuracy) * 60)}px`,
                      background: `linear-gradient(180deg, var(--ga-light), var(--ga))`,
                      borderRadius: "4px 4px 0 0",
                      opacity: 0.4 + (i / combined.length) * 0.6,
                    }}
                  />
                  <span style={{ fontSize: 9, color: "var(--cream-dim)", whiteSpace: "nowrap" }}>
                    {s.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="g-card" style={{ marginBottom: 18 }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: "var(--cream)", marginBottom: 4 }}>
          Cognitive Domains
        </p>
        <p style={{ fontSize: 13.5, color: "var(--cream-dim)", marginBottom: 16 }}>
          Based on recent activity performance.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {Object.entries(sampleUser.cognitiveProfile.domains).map(([key, val]) => {
            const color = domainColor(val);
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--cream)" }}>
                    {DOMAIN_LABELS[key] || key}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 15, color }}>{val}%</span>
                </div>
                <div className="g-progress-track">
                  <div className="g-progress-fill" style={{ width: `${val}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="g-card" style={{ marginBottom: 18 }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: "var(--cream)", marginBottom: 14 }}>
          Session History
        </p>
        {combined.length === 0 ? (
          <p style={{ color: "var(--cream-dim)", fontSize: 15 }}>No sessions recorded yet.</p>
        ) : (
          combined.slice().reverse().map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 0",
              borderBottom: i < combined.length - 1 ? "1px solid var(--fg-border)" : "none",
            }}>
              <div className="g-dot" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: "var(--cream)" }}>{s.activity}</span>
                  <span style={{ fontSize: 13, color: "var(--cream-dim)" }}>{s.date}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="g-pill">{s.accuracy}% accuracy</span>
                  <span className="g-pill">{s.mistakes} mistakes</span>
                  <span className="g-pill">Level {s.level}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <p style={{ fontSize: 13.5, color: "var(--cream-dim)", background: "rgba(14,53,36,0.45)", borderRadius: 10, padding: "12px 14px", lineHeight: 1.5 }}>
        This trend reflects performance on cognitive-care activities and is intended to support personalisation — it does not represent a medical diagnosis.
      </p>
    </div>
  );
}


