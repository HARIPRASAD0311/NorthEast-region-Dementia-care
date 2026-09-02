import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VoiceAssistant from "../components/VoiceAssistant.jsx";
import { ASSESSMENT_QUESTIONS as QUESTIONS, ASSESSMENT_DOMAINS as DOMAINS } from "../data/assessment.js";
import { saveAssessment } from "../services/storage.js";
import { useLanguage } from "../i18n.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ── Decorative SVG motifs ──────────────────────────────────────── */

/* Warm tan line-art color so motifs read clearly on the cream page,
   the way they do in the reference design. */
const MOTIF_COLOR = "#8a7a58";

function MotifDancer() {
  return (
    <svg viewBox="0 0 80 160" width="64" height="128" fill="none" aria-hidden="true"
      style={{ position: "fixed", top: 24, left: 24, opacity: 0.55, zIndex: 0 }}>
      {/* Simplified silhouette of a classical dancer */}
      <ellipse cx="40" cy="20" rx="10" ry="12" fill={MOTIF_COLOR}/>
      <path d="M40 32 C30 50 20 60 10 80 M40 32 C50 50 60 60 70 80" stroke={MOTIF_COLOR} strokeWidth="4" strokeLinecap="round"/>
      <path d="M40 32 C35 55 30 90 28 130" stroke={MOTIF_COLOR} strokeWidth="5" strokeLinecap="round"/>
      <path d="M28 130 C22 145 30 155 40 155 C50 155 58 145 52 130" stroke={MOTIF_COLOR} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M10 80 C5 90 8 100 15 100" stroke={MOTIF_COLOR} strokeWidth="3" strokeLinecap="round"/>
      <path d="M70 80 C75 90 72 100 65 100" stroke={MOTIF_COLOR} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function MotifMap() {
  /* India outline watermark, large and faint, behind the dancer */
  return (
    <svg viewBox="0 0 220 260" width="220" height="260" fill="none" aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, opacity: 0.2, zIndex: 0 }}>
      <path d="M110 15 C70 30 45 55 40 90 C36 118 44 140 60 160 C55 175 58 190 70 200
               C80 210 95 208 100 218 C104 228 116 232 128 224 C140 216 142 200 155 195
               C170 190 178 175 172 160 C185 150 190 130 180 112 C190 100 188 80 172 70
               C168 50 150 32 128 22 C122 18 116 15 110 15Z"
        stroke={MOTIF_COLOR} strokeWidth="1.6" fill="none"/>
      <line x1="20" y1="60" x2="60" y2="90" stroke={MOTIF_COLOR} strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="20" y1="120" x2="55" y2="130" stroke={MOTIF_COLOR} strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="15" y1="180" x2="60" y2="170" stroke={MOTIF_COLOR} strokeWidth="1" strokeDasharray="3 3"/>
    </svg>
  );
}

function MotifPlant() {
  /* Peacock-feather / lamp style motif, top right */
  return (
    <svg viewBox="0 0 100 160" width="80" height="130" fill="none" aria-hidden="true"
      style={{ position: "fixed", top: 20, right: 24, opacity: 0.55, zIndex: 0 }}>
      <path d="M50 155 L50 60" stroke={MOTIF_COLOR} strokeWidth="3" strokeLinecap="round"/>
      {[-30, -15, 0, 15, 30].map((x, i) => (
        <g key={i}>
          <path d={`M50 60 C${50 + x} 40 ${50 + x * 1.3} 15 ${50 + x * 0.6} 5`}
            stroke={MOTIF_COLOR} strokeWidth="2" fill="none"/>
          <circle cx={50 + x * 0.6} cy={i % 2 === 0 ? 3 : 8} r="4" fill="none" stroke={MOTIF_COLOR} strokeWidth="1.6"/>
        </g>
      ))}
    </svg>
  );
}

function MotifMountains() {
  return (
    <svg viewBox="0 0 240 100" width="220" height="90" fill="none" aria-hidden="true"
      style={{ position: "fixed", bottom: 0, right: 0, opacity: 0.4, zIndex: 0 }}>
      <path d="M0 100 L40 30 L80 70 L130 15 L175 60 L240 35 L240 100Z" fill={MOTIF_COLOR} opacity="0.6"/>
      <path d="M0 100 L50 55 L90 80 L140 40 L190 75 L240 60 L240 100Z" fill={MOTIF_COLOR} opacity="0.35"/>
    </svg>
  );
}

function MotifWeave() {
  /* Repeating geometric border pattern — bottom-left corner */
  return (
    <svg viewBox="0 0 60 220" width="52" height="200" fill="none" aria-hidden="true"
      style={{ position: "fixed", bottom: 0, left: 12, opacity: 0.45, zIndex: 0 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i} transform={`translate(0, ${i * 28})`}>
          <rect x="10" y="4" width="14" height="14" stroke={MOTIF_COLOR} strokeWidth="1.5" fill="none"/>
          <rect x="14" y="8" width="6" height="6" fill={MOTIF_COLOR}/>
          <line x1="30" y1="4" x2="44" y2="18" stroke={MOTIF_COLOR} strokeWidth="1.5"/>
          <line x1="44" y1="4" x2="30" y2="18" stroke={MOTIF_COLOR} strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  );
}

function MotifWeaveRight() {
  /* Repeating geometric border pattern — top-right corner, under the lamp motif */
  return (
    <svg viewBox="0 0 60 200" width="44" height="180" fill="none" aria-hidden="true"
      style={{ position: "fixed", top: 150, right: 8, opacity: 0.4, zIndex: 0 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`translate(0, ${i * 25})`}>
          <circle cx="22" cy="10" r="7" stroke={MOTIF_COLOR} strokeWidth="1.5" fill="none"/>
          <circle cx="22" cy="10" r="3" fill={MOTIF_COLOR}/>
          <line x1="5" y1="10" x2="14" y2="10" stroke={MOTIF_COLOR} strokeWidth="1.5"/>
          <line x1="30" y1="10" x2="40" y2="10" stroke={MOTIF_COLOR} strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  );
}

function MotifLamp() {
  /* Small diya/lamp motif, top-right, above the weave border pattern */
  return (
    <svg viewBox="0 0 60 60" width="46" height="46" fill="none" aria-hidden="true"
      style={{ position: "fixed", top: 130, right: 60, opacity: 0.5, zIndex: 0 }}>
      <path d="M10 40 C10 50 20 55 30 55 C40 55 50 50 50 40 C50 36 46 34 30 34 C14 34 10 36 10 40Z"
        stroke={MOTIF_COLOR} strokeWidth="1.8" fill="none"/>
      <path d="M30 34 C28 26 30 18 30 10" stroke={MOTIF_COLOR} strokeWidth="1.6" strokeLinecap="round"/>
      <ellipse cx="30" cy="8" rx="4" ry="6" fill={MOTIF_COLOR} opacity="0.7"/>
    </svg>
  );
}

/* Colourful blurred backdrop that shows through the frosted-glass panels,
   mimicking a soft-focus textile behind the card content. */
function ColorBlob() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: -30,
        zIndex: 1,
        background:
          "linear-gradient(120deg, #7a2e35 0%, #2c4a3e 38%, #b8862f 68%, #1c4c5c 100%)",
        filter: "blur(34px)",
        transform: "scale(1.1)",
      }}
    />
  );
}

/* ── Check icon ─────────────────────────────────────────────────── */
function CheckIcon({ light }) {
  const color = light ? "#f3e4c8" : "#2c4a3e";
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.6"/>
      <path d="M6 10.5l2.5 2.5L14 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Brain SVG icon ─────────────────────────────────────────────── */
function BrainIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#2c4a3e" strokeWidth="1.8" fill="none"/>
      <path d="M20 8 C14 8 10 12 10 17 C10 20 12 22 14 23 C12 24 10 26 10 29 C10 33 14 35 18 34"
        stroke="#2c4a3e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M20 8 C26 8 30 12 30 17 C30 20 28 22 26 23 C28 24 30 26 30 29 C30 33 26 35 22 34"
        stroke="#2c4a3e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M14 20 C16 18 18 19 20 20 C22 21 24 20 26 20"
        stroke="#2c4a3e" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="8" x2="20" y2="34" stroke="#2c4a3e" strokeWidth="1.2" strokeDasharray="2 2"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function Assessment() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  async function finishAssessment(finalAnswers) {
    // 1. Persist answers immediately — profile is accessible even if AI fails.
    saveAssessment(finalAnswers, null);

    // 2. Try Groq analysis via FastAPI.
    setAnalyzing(true);
    let aiAnalysis = null;
    try {
      const payload = {
        answers: QUESTIONS.map((q) => ({
          question_id: q.id,
          question_text: q.prompt,
          chosen_option: finalAnswers[q.id] || "",
        })),
      };
      const res = await fetch(`${API_BASE}/api/assessment/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        aiAnalysis = await res.json();
        // Persist with AI analysis included.
        saveAssessment(finalAnswers, aiAnalysis);
      }
    } catch {
      // Network error or backend unavailable — continue without AI.
    } finally {
      setAnalyzing(false);
    }

    navigate("/cognitive-profile", { state: { answers: finalAnswers, aiAnalysis } });
  }

  /* ── Stage 1: Introduction ───────────────────────────────────── */
  if (!started) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "24px 16px",
      }}>
        {/* Decorative background line-art, pinned to the page edges */}
        <MotifDancer />
        <MotifMap />
        <MotifMountains />
        <MotifWeave />
        <MotifWeaveRight />
        <MotifLamp />

        {/* Centre card */}
        <div style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 520,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(28,48,42,0.25)",
        }}>
          {/* Colourful blurred backdrop, visible through the glass panels */}
          <ColorBlob />

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Header strip: title + subtitle on the light paper tone */}
            <div style={{
              background: "rgba(245,240,230,0.9)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              padding: "28px 32px 20px",
              textAlign: "center",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  background: "#eaf0eb",
                  border: "1px solid rgba(44,74,62,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BrainIcon />
                </div>
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 4vw, 28px)",
                fontWeight: 700,
                color: "#1c302a",
                marginBottom: 10,
                lineHeight: 1.25,
              }}>
                {t("assessmentPageTitle")}
              </h1>
              <p style={{
                color: "#4a4438",
                fontSize: 15.5,
                lineHeight: 1.65,
                maxWidth: 380,
                margin: "0 auto",
              }}>
                {t("assessmentPageSubtitle")}
              </p>
            </div>

            {/* Domains + disclaimer sit directly over the blurred colour backdrop */}
            <div style={{ padding: "22px 28px 0" }}>
              <div style={{
                background: "rgba(20,28,24,0.38)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "18px 20px",
              }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#ffffff", marginBottom: 12 }}>
                  {t("assessmentCovers")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {DOMAINS.map((domain) => (
                    <div key={domain} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckIcon light />
                      <span style={{ fontSize: 15.5, color: "#f3f0e8" }}>{domain}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 28px 0" }}>
              <div style={{
                background: "rgba(20,28,24,0.32)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "12px 16px",
              }}>
                <p style={{ fontSize: 13.5, color: "#eef0ec", lineHeight: 1.55 }}>
                  {t("assessmentDisclaimer").replace("{count}", QUESTIONS.length)}
                </p>
              </div>
            </div>

            {/* CTA button — brass/gold bordered */}
            <div style={{ padding: "22px 28px 28px" }}>
              <button
                onClick={() => setStarted(true)}
                style={{
                  width: "100%",
                  padding: "15px 24px",
                  background: "linear-gradient(135deg, #1c302a, #2c4a3e)",
                  color: "#f3e4c8",
                  border: "2px solid #b8862f",
                  borderRadius: 12,
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(184,134,47,0.35)",
                  transition: "transform 0.12s ease, box-shadow 0.12s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {t("startAssessment")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Stage 2: Questions ──────────────────────────────────────── */
  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  function choose(opt) {
    if (selected) return;
    setSelected(opt);
    const updated = { ...answers, [q.id]: opt };
    setAnswers(updated);
    setTimeout(() => {
      setSelected(null);
      if (step === QUESTIONS.length - 1) {
        finishAssessment(updated);
      } else {
        setStep((s) => s + 1);
      }
    }, 420);
  }

  /* ── Loading screen — shown while Groq analyzes ─────────────── */
  if (analyzing) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "24px 16px",
      }}>
        <MotifDancer />
        <MotifMountains />
        <MotifWeave />
        <div style={{
          position: "relative", zIndex: 2,
          textAlign: "center",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          borderRadius: 24,
          border: "1px solid rgba(44,74,62,0.14)",
          boxShadow: "0 8px 40px rgba(28,48,42,0.12)",
          padding: "48px 36px",
          maxWidth: 420, width: "100%",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "3px solid rgba(44,74,62,0.15)",
            borderTopColor: "#2c4a3e",
            animation: "spin 0.9s linear infinite",
            margin: "0 auto 20px",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 17, fontWeight: 600, color: "#1c302a", margin: 0 }}>
            {t("analysingAssessment")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "24px 16px",
    }}>
      <MotifDancer />
      <MotifPlant />
      <MotifMountains />
      <MotifWeave />

      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: 520,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderRadius: 24,
        border: "1px solid rgba(44,74,62,0.14)",
        boxShadow: "0 8px 40px rgba(28,48,42,0.12)",
        padding: "28px 28px 32px",
      }}>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#5a6b62", letterSpacing: "0.03em" }}>
            {t("questionOf").replace("{current}", step + 1).replace("{total}", QUESTIONS.length)}
          </span>
          <VoiceAssistant script={q.prompt} />
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6, background: "rgba(44,74,62,0.12)",
          borderRadius: 999, overflow: "hidden", marginBottom: 26,
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #2c4a3e, #5a9080)",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }} />
        </div>

        {/* Question */}
        <div style={{
          background: "rgba(235,228,210,0.5)",
          borderRadius: 16,
          padding: "22px 20px",
          marginBottom: 18,
          border: "1px solid rgba(44,74,62,0.1)",
        }}>
          <h2 style={{
            fontSize: "clamp(18px, 3vw, 21px)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "#1c302a",
            lineHeight: 1.4,
            textAlign: "center",
            margin: 0,
          }}>
            {q.prompt}
          </h2>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt) => {
            const isChosen = selected === opt;
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={!!selected}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  borderRadius: 13,
                  border: isChosen
                    ? "2px solid #2c4a3e"
                    : "2px solid rgba(44,74,62,0.2)",
                  background: isChosen
                    ? "rgba(44,74,62,0.12)"
                    : "rgba(255,255,255,0.65)",
                  color: "#1c302a",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  cursor: selected ? "default" : "pointer",
                  textAlign: "left",
                  transition: "border-color 0.15s ease, background 0.15s ease, transform 0.1s ease",
                  transform: isChosen ? "scale(0.99)" : "scale(1)",
                }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = "#2c4a3e"; }}
                onMouseLeave={e => { if (!selected && !isChosen) e.currentTarget.style.borderColor = "rgba(44,74,62,0.2)"; }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
