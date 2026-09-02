import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, AlertCircle, Activity, Heart, ChevronRight,
  Brain, Mic, MicOff, Globe, Bell, Users, X, Check,
} from "lucide-react";
import ProfileCard from "../components/ProfileCard.jsx";
import { sampleUser, sessionHistory } from "../data/sampleUser.js";
import { computeTrend } from "../services/adaptiveEngine.js";
import { loadSessions } from "../services/storage.js";
import { requestNotificationPermission } from "../services/notifications.js";
import { useAccessibility } from "../components/AccessibilityControls.jsx";
import { getTheme } from "../data/culturalData.js";
import { LANGUAGES, useLanguage } from "../i18n.js";

/* ── Themed icon button (top-right controls) ───────────────────── */
function HeaderBtn({ onClick, label, children, badge }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} style={{
      position: "relative", width: 44, height: 44, borderRadius: "50%",
      border: "1.5px solid var(--fg-border)",
      background: "rgba(26,77,53,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}>
      {children}
      {badge > 0 && (
        <span style={{
          position: "absolute", top: 5, right: 5,
          width: 9, height: 9, borderRadius: "50%",
          background: "var(--ga)", border: "1.5px solid var(--fg)",
        }} />
      )}
    </button>
  );
}

/* ── Small stat chip ────────────────────────────────────────────── */
function StatChip({ label, value, accent }) {
  return (
    <div style={{
      flex: "1 1 80px", textAlign: "center",
      padding: "10px 6px",
      background: "rgba(26,77,53,0.6)",
      borderRadius: 12,
      border: "1px solid var(--fg-border)",
    }}>
      <p style={{ fontSize: 20, fontWeight: 800, color: accent || "var(--ga)", margin: "0 0 2px" }}>{value}</p>
      <p style={{ fontSize: 12, color: "var(--cream-dim)", margin: 0, textTransform: "capitalize" }}>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { voiceOn, toggleVoice, say } = useAccessibility();
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const currentLang = lang;

  const stored = loadSessions([]);
  const combined = [...sessionHistory, ...stored].slice(-6);
  const trend = computeTrend(combined);
  const theme = getTheme(sampleUser.state);

  const lastSession = combined[combined.length - 1];
  const pendingReminders = sampleUser.reminders.filter((r) => !r.done);
  const doneReminders = sampleUser.reminders.filter((r) => r.done);
  const { cognitiveProfile } = sampleUser;
  const overallPct = Math.round(
    Object.values(cognitiveProfile.domains).reduce((s, v) => s + v, 0) /
    Object.values(cognitiveProfile.domains).length
  );

  const engagementStatusKey =
    sampleUser.streakDays >= 5 ? "regular" :
      sampleUser.streakDays >= 2 ? "needsAttention" : "atRisk";
  const engagementStatus = t(engagementStatusKey);
  const engagementColor =
    engagementStatusKey === "regular" ? "#4ade80" :
      engagementStatusKey === "needsAttention" ? "var(--ga)" : "#f87171";

  function handleMic() {
    const turningOn = !voiceOn;
    toggleVoice();
    if (turningOn) {
      setTimeout(() => say(`${t("voiceGuidanceOn")} ${theme.greeting}, ${sampleUser.fullName.split(" ")[0]}.`), 150);
    } else {
      window.speechSynthesis?.cancel();
    }
  }

  function handleEnableNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    requestNotificationPermission();
    setNotifOpen(false);
  }

  const C = { color: "var(--cream)" };
  const CD = { color: "var(--cream-dim)" };

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p className="g-label" style={{ marginBottom: 4 }}>{t("caregiverOverview")}</p>
          <h1 style={{ fontSize: 24, marginBottom: 2, lineHeight: 1.2, ...C }}>{t("patientStatus")}</h1>
          <p style={{ fontSize: 14, ...CD }}>{t("lastAssessed")} {cognitiveProfile.lastAssessed}</p>
        </div>

        {/* Mic · Language · Notifications */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 2 }}>
          <HeaderBtn label={voiceOn ? t("turnOffVoice") : t("turnOnVoice")} onClick={handleMic}>
            {voiceOn ? <Mic size={19} color="var(--ga)" /> : <MicOff size={19} color="var(--cream-dim)" />}
          </HeaderBtn>

          <div style={{ position: "relative" }}>
            <HeaderBtn label={t("changeLanguage")} onClick={() => { setLangOpen(o => !o); setNotifOpen(false); }}>
              <Globe size={19} color="var(--ga)" />
            </HeaderBtn>
            {langOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setLangOpen(false)} />
                <div style={{
                  position: "absolute", top: 50, right: 0, zIndex: 40,
                  background: "rgba(10,40,26,0.97)", border: "1px solid var(--fg-border)",
                  borderRadius: 14, boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
                  minWidth: 180, overflow: "hidden",
                }}>
                  <p style={{ padding: "12px 16px 8px", fontSize: 11, fontWeight: 800, color: "var(--ga)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("language")}</p>
                  {LANGUAGES.map(langOption => (
                    <button key={langOption} onClick={() => { setLang(langOption); setLangOpen(false); }} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: "11px 16px", background: currentLang === langOption ? "rgba(199,168,90,0.15)" : "transparent",
                      border: "none", cursor: "pointer", fontSize: 15,
                      fontWeight: currentLang === langOption ? 700 : 500,
                      color: currentLang === langOption ? "var(--ga)" : "var(--cream-dim)",
                      textAlign: "left",
                    }}>
                      {langOption}
                      {currentLang === langOption && <Check size={15} color="var(--ga)" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <HeaderBtn label={t("notifications")} badge={pendingReminders.length} onClick={() => { setNotifOpen(o => !o); setLangOpen(false); }}>
              <Bell size={19} color="var(--ga)" />
            </HeaderBtn>
            {notifOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setNotifOpen(false)} />
                <div style={{
                  position: "absolute", top: 50, right: 0, zIndex: 40, width: 290,
                  background: "rgba(10,40,26,0.97)", border: "1px solid var(--fg-border)",
                  borderRadius: 14, boxShadow: "0 8px 28px rgba(0,0,0,0.3)", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "var(--ga)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("reminders")}</p>
                    <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <X size={15} color="var(--cream-dim)" />
                    </button>
                  </div>
                  {pendingReminders.length === 0
                    ? <p style={{ padding: "10px 16px 14px", fontSize: 14, color: "var(--cream-dim)" }}>{t("allRemindersCompleted")}</p>
                    : pendingReminders.map(r => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: "1px solid var(--fg-border)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ga)", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--cream)" }}>{r.label}</p>
                          <p style={{ fontSize: 12, color: "var(--cream-dim)", margin: 0 }}>{r.time}</p>
                        </div>
                      </div>
                    ))
                  }
                  {typeof window !== "undefined" && "Notification" in window && Notification.permission === "default" && (
                    <div style={{ padding: "10px 16px 0" }}>
                      <button className="btn-theme-outline" style={{ width: "100%", fontSize: 13, padding: "9px 14px" }} onClick={handleEnableNotifications}>
                        Enable browser alerts
                      </button>
                    </div>
                  )}
                  <div style={{ padding: "10px 16px 14px" }}>
                    <button className="btn-theme-outline" style={{ width: "100%", fontSize: 13, padding: "9px 14px" }}
                      onClick={() => { setNotifOpen(false); navigate("/daily-care"); }}>
                      {t("viewDailyCare")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile */}
      <div style={{ marginBottom: 18 }}>
        <ProfileCard user={sampleUser} />
      </div>

      {/* Cognitive performance */}
      <div className="g-card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Brain size={18} color="var(--ga)" />
          <p style={{ fontWeight: 700, fontSize: 17, ...C }}>{t("cognitivePerformance")}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {Object.entries(cognitiveProfile.domains).map(([domain, score]) => (
            <StatChip key={domain} label={domain} value={`${score}%`}
              accent={score >= 75 ? "#4ade80" : score >= 60 ? "var(--ga)" : "#f87171"} />
          ))}
        </div>
        <div className="g-card-mid" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, ...CD }}>{t("overallScore")}</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: overallPct >= 75 ? "#4ade80" : overallPct >= 60 ? "var(--ga)" : "#f87171" }}>
            {overallPct}%
          </span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span className="g-pill">{cognitiveProfile.stage}</span>
        </div>
      </div>

      {/* Today's activity */}
      <div className="g-card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Activity size={18} color="var(--ga)" />
          <p style={{ fontWeight: 700, fontSize: 17, ...C }}>{t("todaysActivity")}</p>
        </div>
        {lastSession ? (
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, ...C }}>{lastSession.activity}</p>
            <p style={{ fontSize: 14, ...CD, marginTop: 4 }}>{lastSession.date}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <span className="g-pill">{lastSession.accuracy}% accuracy</span>
              <span className="g-pill">{lastSession.mistakes} mistakes</span>
              <span className="g-pill">Level {lastSession.level}</span>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 15, ...CD }}>{t("noActivities")}</p>
        )}
        <button className="btn-theme-outline" style={{ marginTop: 14, fontSize: 14, padding: "10px 16px" }}
          onClick={() => navigate("/activities")}>
          {t("startActivity")} <ChevronRight size={15} />
        </button>
      </div>

      {/* Progress trend */}
      <div className="g-card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          {trend.direction === "down"
            ? <AlertCircle size={18} color="#f87171" />
            : <CheckCircle2 size={18} color="#4ade80" />}
          <p style={{ fontWeight: 700, fontSize: 17, ...C }}>{t("progressTrend")}</p>
        </div>
        <p style={{ fontSize: 15, marginBottom: 12, ...CD }}>
          {trend.direction === "down"
            ? `Recent accuracy is ${Math.abs(trend.delta)}% lower. Consider a gentle check-in.`
            : trend.direction === "up"
              ? `Accuracy is up ${trend.delta}% — encouraging progress.`
              : "Performance has been steady across recent sessions."}
        </p>
        {combined.length > 0 && (
          <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 44 }}>
            {combined.map((s, i) => (
              <div key={i} title={`${s.activity}: ${s.accuracy}%`} style={{
                flex: 1, height: `${Math.max(8, s.accuracy * 0.44)}px`,
                background: "var(--ga)", borderRadius: 4,
                opacity: 0.4 + (i / combined.length) * 0.6,
              }} />
            ))}
          </div>
        )}
        <button className="btn-theme-outline" style={{ marginTop: 14, fontSize: 14, padding: "10px 16px" }}
          onClick={() => navigate("/progress")}>
          {t("fullProgressView")} <ChevronRight size={15} />
        </button>
      </div>

      {/* Engagement */}
      <div className="g-card" style={{ marginBottom: 18 }}>
        <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 12, ...C }}>{t("engagement")}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: engagementColor + "22", border: `2px solid ${engagementColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: engagementColor,
          }}>
            {sampleUser.streakDays}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: engagementColor, marginBottom: 2 }}>{engagementStatus}</p>
            <p style={{ fontSize: 14, ...CD }}>{sampleUser.streakDays}-{t("dayStreak")}</p>
          </div>
        </div>
      </div>

      {/* Daily Care summary */}
      <div className="g-card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Heart size={18} color="var(--ga)" />
          <p style={{ fontWeight: 700, fontSize: 17, ...C }}>{t("dailyCareSummary")}</p>
        </div>
        <p style={{ fontSize: 14, marginBottom: 12, ...CD }}>
          {doneReminders.length} of {sampleUser.reminders.length} {t("remindersCompleted")}
        </p>
        {pendingReminders.slice(0, 3).map((r) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--fg-border)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ga)", flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 15, ...C }}>{r.label}</span>
            <span style={{ fontSize: 13, ...CD }}>{r.time}</span>
          </div>
        ))}
        <button className="btn-theme-outline" style={{ marginTop: 14, fontSize: 14, padding: "10px 16px" }}
          onClick={() => navigate("/daily-care")}>
          {t("viewAllReminders")} <ChevronRight size={15} />
        </button>
      </div>

      {/* Caregiver entry */}
      <button onClick={() => navigate("/caregiver")} style={{
        display: "flex", alignItems: "center", gap: 16, width: "100%",
        background: "var(--ga)", border: "none", borderRadius: 16,
        padding: "18px 20px", cursor: "pointer", textAlign: "left", marginBottom: 18,
        transition: "opacity 0.15s ease",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, background: "var(--fg)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Users size={22} color="var(--ga)" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: "var(--fg)", margin: "0 0 3px" }}>{t("caregiverDashboard")}</p>
          <p style={{ fontSize: 13.5, color: "rgba(14,53,36,0.7)", margin: 0 }}>{t("caregiverDashboardDescription")}</p>
        </div>
        <ChevronRight size={18} color="var(--fg)" style={{ flexShrink: 0 }} />
      </button>

      <p style={{ fontSize: 13.5, color: "var(--cream-dim)", background: "rgba(14,53,36,0.45)", borderRadius: 10, padding: "12px 14px", lineHeight: 1.5 }}>
        {t("overviewNote")}
      </p>
    </div>
  );
}
