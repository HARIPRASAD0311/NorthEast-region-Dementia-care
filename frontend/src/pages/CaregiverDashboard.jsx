import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowUp, ArrowDown, Minus,
  Brain, Activity, Heart, Users, CalendarClock,
  AlertCircle, ChevronRight, Zap, Pill, Droplets, Puzzle,
} from "lucide-react";
import ProfileCard from "../components/ProfileCard.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import { sampleUser, sessionHistory } from "../data/sampleUser.js";
import { computeTrend } from "../services/adaptiveEngine.js";
import { loadSessions, loadReminders } from "../services/storage.js";
import { useLanguage } from "../i18n.js";

/* ── helpers ────────────────────────────────────────────────────── */
function domainLabel(val) {
  if (val >= 75) return { text: "Good", color: "#2c7a4f", bg: "#e4f4ea" };
  if (val >= 58) return { text: "Moderate", color: "#b8862f", bg: "#f3e4c8" };
  return { text: "Needs Support", color: "#9a4a32", bg: "#f6e3dc" };
}

const DOMAIN_LABELS = {
  memory: "Memory", attention: "Attention", language: "Language",
  reasoning: "Reasoning", orientation: "Orientation",
};

/* ── small section heading ──────────────────────────────────────── */
function SectionHead({ icon: Icon, title, color = "var(--pine)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon size={18} color={color} />
      <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>{title}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const stored = loadSessions([]);
  const combined = [...sessionHistory, ...stored].slice(-10);
  const trend = computeTrend(combined);
  const reminders = loadReminders(sampleUser.reminders);

  const { cognitiveProfile } = sampleUser;
  const pendingReminders = reminders.filter((r) => !r.done);
  const doneReminders = reminders.filter((r) => r.done);
  const medReminders = reminders.filter((r) => r.type === "Medication");
  const doneMed = medReminders.filter((r) => r.done).length;

  /* engagement */
  const streak = sampleUser.streakDays;
  const engagementStatus = streak >= 5 ? t("regular") : streak >= 2 ? t("needsAttention") : t("atRisk");
  const engagementColor = streak >= 5 ? "#2c7a4f" : streak >= 2 ? "#b8862f" : "#9a4a32";
  const engagementBg    = streak >= 5 ? "#e4f4ea" : streak >= 2 ? "#f3e4c8" : "#f6e3dc";

  /* attention items */
  const attentionItems = [];
  const activityReminderDone = reminders.find((r) => r.type === "Activity")?.done;
  if (!activityReminderDone) attentionItems.push("Today's cognitive activity is not yet complete.");
  const hydrationDone = reminders.find((r) => r.type === "Hydration")?.done;
  if (!hydrationDone) attentionItems.push("Hydration reminder is pending.");
  if (pendingReminders.some((r) => r.type === "Medication"))
    attentionItems.push("Medication reminder is pending.");
  if (trend.direction === "down")
    attentionItems.push(`Recent activity accuracy is ${Math.abs(trend.delta)}% lower than earlier sessions.`);

  /* recent sessions */
  const recentSessions = combined.slice(-4).reverse();

  /* appointments */
  const appointments = reminders.filter((r) => r.type === "Appointment");

  const TrendIcon = trend.direction === "up" ? ArrowUp
    : trend.direction === "down" ? ArrowDown : Minus;
  const trendColor = trend.direction === "up" ? "#2c7a4f"
    : trend.direction === "down" ? "#9a4a32" : "var(--muted)";

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", padding: "0 0 16px",
          fontSize: 15, fontWeight: 600, color: "var(--muted)", cursor: "pointer",
        }}
      >
        <ArrowLeft size={17} /> {t("backToHome")}
      </button>

      {/* Page heading */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 3 }}>{t("careOverview")}</p>
        <h1 style={{ fontSize: 24, marginBottom: 2, fontFamily: "var(--font-display)" }}>
          {t("caregiverDashboard")}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          {t("caregiverDashboardDescription")}
        </p>
      </div>

      {/* ── Patient overview ──────────────────────────────────── */}
      <ProfileCard user={sampleUser} />

      {/* Patient meta row */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8,
        margin: "12px 0 20px",
      }}>
        {[
          { label: t("age"),          value: new Date().getFullYear() - new Date(sampleUser.dateOfBirth).getFullYear() },
          { label: t("language"),     value: sampleUser.preferredLanguage },
          { label: t("region"),       value: sampleUser.state },
          { label: t("lastAssessed"), value: cognitiveProfile.lastAssessed },
        ].map(({ label, value }) => (
          <div key={label} style={{
            padding: "6px 12px", borderRadius: 999,
            background: "var(--paper-deep)", border: "1px solid var(--line)",
            fontSize: 13.5, color: "var(--ink)",
          }}>
            <span style={{ color: "var(--muted)", marginRight: 4 }}>{label}:</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Quick stats row ───────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 20,
      }}>
        {[
          { label: t("avgAccuracyLabel"), value: `${trend.recentAvg}%`, icon: Brain, trend: trend.direction, color: "var(--pine)" },
          { label: t("activityStreak"),   value: `${streak} ${t("days")}`, icon: Zap, color: "#b8862f" },
          { label: t("pendingReminders"), value: pendingReminders.length, icon: AlertCircle,
            color: pendingReminders.length > 0 ? "var(--clay)" : "#2c7a4f" },
        ].map(({ label, value, icon: Icon, trend: tr, color }) => (
          <div key={label} className="card" style={{ padding: "14px 12px", textAlign: "center" }}>
            <Icon size={20} color={color} style={{ margin: "0 auto 6px" }} />
            <p style={{ fontSize: 20, fontWeight: 800, color, margin: "0 0 3px", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{label}</p>
            {tr && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 4 }}>
                <TrendIcon size={12} color={trendColor} />
                <span style={{ fontSize: 11, color: trendColor, fontWeight: 600 }}>
                  {tr === "flat" ? t("steady") : tr === "up" ? `+${trend.delta}%` : `${trend.delta}%`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Attention items ───────────────────────────────────── */}
      {attentionItems.length > 0 && (
        <div className="card" style={{ marginBottom: 18, borderLeft: "4px solid var(--clay)" }}>
          <SectionHead icon={AlertCircle} title={t("needsAttentionSection")} color="var(--clay)" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {attentionItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: "var(--clay)",
                  marginTop: 7, flexShrink: 0,
                }} />
                <p style={{ fontSize: 14.5, color: "var(--ink)", margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cognitive performance ─────────────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={Brain} title={t("cognitivePerformanceSection")} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.entries(cognitiveProfile.domains).map(([key, val]) => {
            const { text, color, bg } = domainLabel(val);
            return (
              <div key={key} style={{
                flex: "1 1 90px", minWidth: 90,
                background: bg, borderRadius: 12,
                padding: "10px 10px",
                textAlign: "center",
                border: `1px solid ${color}33`,
              }}>
                <p style={{ fontSize: 20, fontWeight: 800, color, margin: "0 0 2px" }}>{val}%</p>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 4px", textTransform: "capitalize" }}>
                  {DOMAIN_LABELS[key] || key}
                </p>
                <span style={{
                  display: "inline-block", padding: "2px 8px", borderRadius: 999,
                  fontSize: 11, fontWeight: 700, background: color + "22", color,
                }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{
          background: "var(--paper-deep)", borderRadius: 10,
          padding: "10px 14px", display: "flex", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>{t("stage")}</span>
          <span className="pill pill-pine" style={{ fontSize: 13 }}>{cognitiveProfile.stage}</span>
        </div>
      </div>

      {/* ── Engagement ───────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={Zap} title={t("engagementSection")} color="#b8862f" />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: engagementBg, border: `2px solid ${engagementColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19, fontWeight: 800, color: engagementColor, flexShrink: 0,
          }}>
            {streak}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: engagementColor, marginBottom: 2 }}>
              {engagementStatus}
            </p>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
              {streak}-{t("dayStreak")} · {combined.length} {t("sessionsRecorded")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Activity performance trend ───────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={Activity} title={t("activityPerfTrend")} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 12px", borderRadius: 999,
            background: trendColor + "18", border: `1px solid ${trendColor}44`,
          }}>
            <TrendIcon size={13} color={trendColor} />
            <span style={{ fontSize: 13, fontWeight: 700, color: trendColor }}>
              {trend.direction === "up"   && t("upTrend").replace("{delta}", trend.delta)}
              {trend.direction === "down" && t("downTrend").replace("{delta}", Math.abs(trend.delta))}
              {trend.direction === "flat" && t("steadyTrend")}
            </span>
          </div>
        </div>
        {combined.length >= 2 && (
          <ProgressCard title="" sessions={combined.slice(-6)} />
        )}
        <button
          className="btn btn-secondary"
          style={{ marginTop: 12, fontSize: 14, padding: "10px 16px" }}
          onClick={() => navigate("/patient-details")}
        >
          {t("fullActivityHistory")} <ChevronRight size={15} />
        </button>
      </div>

      {/* ── Recent activities ─────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={Puzzle} title={t("recentActivities")} />
        {recentSessions.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 15 }}>{t("noActivitiesYet")}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentSessions.map((s, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < recentSessions.length - 1 ? "1px solid var(--line)" : "none",
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{s.activity}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                    {s.date} · {t("level")} {s.level}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontSize: 17, fontWeight: 800, margin: "0 0 2px",
                    color: s.accuracy >= 75 ? "#2c7a4f" : s.accuracy >= 55 ? "#b8862f" : "#9a4a32",
                  }}>
                    {s.accuracy}%
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{t("accuracy")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Daily Care summary ────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={Heart} title={t("todaysCare")} color="var(--clay)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
          {[
            {
              icon: Pill, label: "Medication",
              value: `${doneMed}/${medReminders.length}`,
              done: doneMed === medReminders.length,
            },
            { icon: Droplets, label: t("reminders").split(" ")[0] || "Hydration",
              value: reminders.find((r) => r.type === "Hydration")?.done ? t("done") : t("pending"),
              done: !!reminders.find((r) => r.type === "Hydration")?.done },
            { icon: Puzzle,   label: t("activity"),
              value: reminders.find((r) => r.type === "Activity")?.done  ? t("done") : t("pending"),
              done: !!reminders.find((r) => r.type === "Activity")?.done },
          ].map(({ icon: Icon, label, value, done }) => (
            <div key={label} style={{
              textAlign: "center", padding: "12px 8px",
              background: done ? "#e4f4ea" : "var(--paper-deep)",
              borderRadius: 12,
              border: `1px solid ${done ? "#2c7a4f33" : "var(--line)"}`,
            }}>
              <Icon size={18} color={done ? "#2c7a4f" : "var(--muted)"} style={{ margin: "0 auto 6px" }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: done ? "#2c7a4f" : "var(--ink)", margin: "0 0 2px" }}>
                {value}
              </p>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary"
          style={{ fontSize: 14, padding: "10px 16px" }}
          onClick={() => navigate("/daily-care")}
        >
          {t("viewDailyCareBtn")} <ChevronRight size={15} />
        </button>
      </div>

      {/* ── Appointments ─────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={CalendarClock} title={t("appointments")} />
        {appointments.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 15 }}>{t("noUpcomingAppointments")}</p>
        ) : (
          appointments.map((a) => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: "1px solid var(--line)",
            }}>
              <CalendarClock size={16} color="var(--muted)" />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{a.label}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{a.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Quick actions ─────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead icon={Zap} title={t("quickActions")} color="#b8862f" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
          { label: t("progress"),   path: "/progress",        icon: Activity },
          { label: t("dailyCare"),  path: "/daily-care",       icon: Heart },
          { label: t("activity"),   path: "/activities",       icon: Puzzle },
          { label: t("fullHistory"),path: "/patient-details",  icon: Users },
          ].map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              className="btn btn-secondary"
              style={{ padding: "12px 10px", fontSize: 14, justifyContent: "flex-start", gap: 8 }}
              onClick={() => navigate(path)}
            >
              <Icon size={16} color="var(--pine)" /> {label}
            </button>
          ))}
        </div>
      </div>

      <p className="disclaimer">
        This overview supports caregiving decisions and does not constitute a medical diagnosis. Please consult a
        healthcare professional for any clinical concerns.
      </p>
    </div>
  );
}
