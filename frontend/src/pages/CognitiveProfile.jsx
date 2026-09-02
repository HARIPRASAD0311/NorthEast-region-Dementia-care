import { useNavigate, useLocation } from "react-router-dom";
import { sampleUser } from "../data/sampleUser.js";
import { loadAssessment } from "../services/storage.js";

function domainColor(val) {
  if (val >= 75) return "#2c7a4f";
  if (val >= 55) return "#b8862f";
  return "#9a4a32";
}

const DOMAIN_LABELS = {
  memory: "Memory",
  attention: "Attention",
  language: "Language",
  reasoning: "Reasoning",
  orientation: "Orientation",
};

export default function CognitiveProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const saved = loadAssessment();
  const aiAnalysis = location.state?.aiAnalysis ?? saved?.aiAnalysis ?? null;
  const { cognitiveProfile } = sampleUser;
  const overallPct = Math.round(
    Object.values(cognitiveProfile.domains).reduce((s, v) => s + v, 0) /
    Object.values(cognitiveProfile.domains).length
  );
  const overallColor = domainColor(overallPct);

  function statusColor(status) {
    if (status === "good") return "#2c7a4f";
    if (status === "needs_support") return "#9a4a32";
    return "#b8862f";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "24px 16px" }}>
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 520, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", borderRadius: 24, border: "1px solid rgba(44,74,62,0.14)", boxShadow: "0 8px 40px rgba(28,48,42,0.12)", padding: "32px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: `conic-gradient(${overallColor} ${overallPct * 3.6}deg, rgba(44,74,62,0.12) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 18px rgba(28,48,42,0.12)" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: overallColor, lineHeight: 1 }}>{overallPct}%</span>
              <span style={{ fontSize: 10, color: "#5a6b62", fontWeight: 600, marginTop: 2 }}>overall</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, color: "#1c302a", marginBottom: 8, lineHeight: 1.25 }}>Your Cognitive Profile</h1>
          <p style={{ color: "#5a6b62", fontSize: 15, lineHeight: 1.55 }}>Here&apos;s what we&apos;ve put together so far. This will keep updating as you use the app.</p>
          <div style={{ marginTop: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 14px", borderRadius: 999, background: "#e4ebe6", color: "#1c302a", fontSize: 13, fontWeight: 700, border: "1px solid rgba(44,74,62,0.15)" }}>{cognitiveProfile.stage}</span>
          </div>
        </div>

        {aiAnalysis?.summary && (
          <div style={{ background: "rgba(44,74,62,0.07)", borderRadius: 14, border: "1px solid rgba(44,74,62,0.18)", padding: "16px 18px", marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "#2c4a3e", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Assessment Summary</p>
            <p style={{ fontSize: 14, color: "#2b3d35", lineHeight: 1.6, margin: 0 }}>{aiAnalysis.summary}</p>
          </div>
        )}

        <div style={{ background: "rgba(235,228,210,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 14, border: "1px solid rgba(44,74,62,0.12)", padding: "18px 20px", marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#1c302a", marginBottom: 14 }}>Performance across domains</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {Object.entries(cognitiveProfile.domains).map(([key, val]) => {
              const color = domainColor(val);
              const aiDomain = aiAnalysis?.domains?.[key];
              return (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 14 }}>
                    <div>
                      <span style={{ color: "#2b3d35", fontWeight: 600 }}>{DOMAIN_LABELS[key] || key}</span>
                      {aiDomain?.status && (
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: statusColor(aiDomain.status), background: statusColor(aiDomain.status) + "18", border: `1px solid ${statusColor(aiDomain.status)}44`, borderRadius: 999, padding: "1px 7px", textTransform: "capitalize" }}>
                          {aiDomain.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 700, color }}>{val}%</span>
                  </div>
                  <div style={{ height: 7, background: "rgba(44,74,62,0.12)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
                  </div>
                  {aiDomain?.observation && (
                    <p style={{ fontSize: 12, color: "#5a6b62", margin: "4px 0 0", lineHeight: 1.4 }}>{aiDomain.observation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {aiAnalysis?.recommendations?.length > 0 && (
          <div style={{ background: "rgba(235,228,210,0.45)", borderRadius: 12, border: "1px solid rgba(44,74,62,0.1)", padding: "14px 18px", marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "#2c4a3e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Suggestions</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {aiAnalysis.recommendations.map((rec, i) => (
                <li key={i} style={{ fontSize: 13.5, color: "#2b3d35", lineHeight: 1.55, marginBottom: 4 }}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ background: "rgba(235,228,210,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: 12, border: "1px solid rgba(44,74,62,0.1)", padding: "12px 16px", marginBottom: 22 }}>
          <p style={{ fontSize: 13, color: "#5a6b62", lineHeight: 1.55 }}>{aiAnalysis?.disclaimer || "This profile reflects performance on cognitive-care activities and is intended to personalise your experience. It does not replace professional medical diagnosis or treatment. If you have concerns, please consult a doctor."}</p>
        </div>

        <button onClick={() => navigate("/activities")} style={{ width: "100%", padding: "16px 24px", background: "linear-gradient(135deg, #2c4a3e, #3a6054)", color: "#f5f3ec", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", boxShadow: "0 6px 20px rgba(28,48,42,0.25)", transition: "transform 0.12s ease" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>Continue to Activities</button>
      </div>
    </div>
  );
}
