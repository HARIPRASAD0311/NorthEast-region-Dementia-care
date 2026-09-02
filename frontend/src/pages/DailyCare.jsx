import { useState } from "react";
import { Pill, Droplets, Puzzle, CalendarClock, Clock, Check } from "lucide-react";
import { sampleUser } from "../data/sampleUser.js";
import { loadReminders, saveReminders } from "../services/storage.js";
import { useLanguage } from "../i18n.js";

/* ── Per-type colour palette — each type gets its own distinct colour ── */
const TYPE_META = {
  Medication:  {
    icon: Pill,
    label: "Medication",
    solid: "#7c2d12",        // deep brick-red
    bg:   "rgba(124,45,18,0.82)",
    border: "rgba(251,146,60,0.5)",
    accent: "#fb923c",       // bright orange
  },
  Hydration:   {
    icon: Droplets,
    label: "Hydration",
    solid: "#164e63",        // deep teal-blue
    bg:   "rgba(22,78,99,0.85)",
    border: "rgba(34,211,238,0.45)",
    accent: "#22d3ee",       // cyan
  },
  Activity:    {
    icon: Puzzle,
    label: "Activity",
    solid: "#713f12",        // deep amber-brown
    bg:   "rgba(113,63,18,0.85)",
    border: "rgba(251,191,36,0.5)",
    accent: "#fbbf24",       // warm amber/gold
  },
  Appointment: {
    icon: CalendarClock,
    label: "Appointment",
    solid: "#4a1d96",        // deep purple
    bg:   "rgba(74,29,150,0.82)",
    border: "rgba(167,139,250,0.5)",
    accent: "#a78bfa",       // soft purple
  },
};

const DONE_BG     = "rgba(20,83,45,0.92)";
const DONE_BORDER = "rgba(74,222,128,0.5)";
const DONE_ACCENT = "#4ade80";

/* ── Summary mini-card ──────────────────────────────────────────── */
function SummaryCard({ type, reminders, t }) {
  const meta = TYPE_META[type];
  if (!meta) return null;
  const Icon = meta.icon;
  const items = reminders.filter(r => r.type === type);
  const done  = items.filter(r => r.done).length;
  if (items.length === 0) return null;
  const allDone = done === items.length;

  return (
    <div style={{
      background: allDone ? DONE_BG : meta.bg,
      border: `2px solid ${allDone ? DONE_BORDER : meta.border}`,
      borderRadius: 16,
      padding: "16px 14px",
      display: "flex", flexDirection: "column", gap: 6,
      minWidth: 0,
      boxShadow: `0 4px 16px rgba(0,0,0,0.35)`,
    }}>
      <Icon size={22} color={allDone ? DONE_ACCENT : meta.accent} />
      <p style={{ fontSize: 22, fontWeight: 900, color: allDone ? DONE_ACCENT : meta.accent, margin: 0, lineHeight: 1 }}>
        {done}/{items.length}
      </p>
      <p style={{ fontSize: 13, color: "#fff", margin: 0, fontWeight: 700 }}>{meta.label}</p>
      <p style={{ fontSize: 11.5, color: allDone ? DONE_ACCENT : "rgba(255,255,255,0.7)", margin: 0, fontWeight: 600 }}>
        {allDone ? t("allDoneCheck") : `${items.length - done} ${t("remaining")}`}
      </p>
    </div>
  );
}

/* ── Reminder row ───────────────────────────────────────────────── */
function ReminderRow({ reminder, onToggle, t }) {
  const meta = TYPE_META[reminder.type] || TYPE_META.Activity;
  const Icon = meta.icon;
  const isDone = reminder.done;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      background: isDone ? DONE_BG : meta.bg,
      border: `2px solid ${isDone ? DONE_BORDER : meta.border}`,
      borderRadius: 14,
      boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
      opacity: isDone ? 0.8 : 1,
    }}>
      <div style={{
        width: 42, height: 42, flexShrink: 0,
        borderRadius: 12,
        background: `${isDone ? DONE_ACCENT : meta.accent}22`,
        border: `1.5px solid ${isDone ? DONE_ACCENT : meta.accent}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={19} color={isDone ? DONE_ACCENT : meta.accent} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontWeight: 700, fontSize: 15, color: "#fff", margin: "0 0 3px",
          textDecoration: isDone ? "line-through" : "none",
          opacity: isDone ? 0.7 : 1,
        }}>
          {reminder.label}
        </p>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", margin: 0 }}>
          {meta.label} · {reminder.time}
        </p>
      </div>

      <button
        onClick={() => onToggle(reminder.id)}
        aria-pressed={isDone}
        title={isDone ? t("markedDone") : t("markAsDone")}
        style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
          border: `2px solid ${isDone ? DONE_ACCENT : meta.accent}`,
          background: isDone ? `${DONE_ACCENT}33` : `${meta.accent}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Check size={17} color={isDone ? DONE_ACCENT : meta.accent} />
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function DailyCare() {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState(() => loadReminders(sampleUser.reminders));

  function toggle(id) {
    const updated = reminders.map(r => r.id === id ? { ...r, done: !r.done } : r);
    setReminders(updated);
    saveReminders(updated);
  }

  const doneCount = reminders.filter(r => r.done).length;
  const total     = reminders.length;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const pending   = reminders.filter(r => !r.done);
  const upcoming  = [...pending].sort((a, b) => a.time.localeCompare(b.time));

  const CARE_TYPES = ["Medication", "Hydration", "Activity", "Appointment"];
  const grouped = CARE_TYPES
    .map(type => ({ type, items: reminders.filter(r => r.type === type) }))
    .filter(g => g.items.length > 0);

  const pctColor = pct === 100 ? DONE_ACCENT : pct >= 60 ? "#fbbf24" : "#f87171";

  const solidCard = (extra = {}) => ({
    background: "rgba(10,40,26,0.94)",
    border: "1.5px solid rgba(199,168,90,0.35)",
    borderRadius: 16,
    padding: "18px 18px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    marginBottom: 18,
    ...extra,
  });

  const remaining = total - doneCount;

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <p className="g-label" style={{ marginBottom: 6 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="g-page-title">{t("dailyCareTitle")}</h1>
        <p className="g-page-sub">
          {t("remindersCompletedToday").replace("{done}", doneCount).replace("{total}", total)}
        </p>
      </div>

      {/* ── Summary cards ─────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: 10, marginBottom: 18,
      }}>
        {CARE_TYPES.map(type => (
          <SummaryCard key={type} type={type} reminders={reminders} t={t} />
        ))}
      </div>

      {/* ── Overall progress ──────────────────────────────── */}
      <div style={solidCard()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: "#fff", margin: 0 }}>{t("todaysProgress")}</p>
          <span style={{ fontSize: 24, fontWeight: 900, color: pctColor }}>{pct}%</span>
        </div>
        <div style={{ height: 12, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${pctColor}, ${pctColor}cc)`,
            borderRadius: 999, transition: "width 0.5s ease",
          }} />
        </div>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", margin: 0 }}>
          {pct === 100
            ? t("allCareTasksCompleted")
            : (remaining === 1
                ? t("tasksStillToGo").replace("{remaining}", remaining)
                : t("tasksStillToGoPlural").replace("{remaining}", remaining))}
        </p>
      </div>

      {/* ── Upcoming ──────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <div style={solidCard()}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Clock size={18} color="#fbbf24" />
            <p style={{ fontWeight: 700, fontSize: 16, color: "#fff", margin: 0 }}>{t("upcoming")}</p>
          </div>
          {upcoming.map((r, i) => {
            const meta = TYPE_META[r.type] || TYPE_META.Activity;
            const Icon = meta.icon;
            return (
              <div key={r.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
                borderBottom: i < upcoming.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `${meta.accent}22`,
                  border: `1.5px solid ${meta.accent}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={17} color={meta.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "#fff", margin: 0 }}>{r.label}</p>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>{meta.label}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: meta.accent, whiteSpace: "nowrap" }}>
                  {r.time}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Grouped care list ─────────────────────────────── */}
      {grouped.map(({ type, items }) => {
        const meta = TYPE_META[type] || TYPE_META.Activity;
        const Icon = meta.icon;
        const groupDone = items.filter(r => r.done).length;
        const allDone   = groupDone === items.length;

        return (
          <div key={type} style={{ marginBottom: 22 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", marginBottom: 8,
              background: meta.bg,
              border: `2px solid ${meta.border}`,
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={17} color={meta.accent} />
                <p style={{ fontWeight: 700, fontSize: 15, color: "#fff", margin: 0 }}>{meta.label}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: allDone ? DONE_ACCENT : meta.accent }}>
                {groupDone}/{items.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map(r => <ReminderRow key={r.id} reminder={r} onToggle={toggle} t={t} />)}
            </div>
          </div>
        );
      })}

      {pending.length === 0 && (
        <div style={{ textAlign: "center", padding: "18px 0 8px" }}>
          <p style={{ fontSize: 17, color: DONE_ACCENT, fontWeight: 800 }}>{t("allDoneToday")}</p>
        </div>
      )}

      <p style={{
        fontSize: 13.5, color: "rgba(255,255,255,0.5)",
        background: "rgba(0,0,0,0.35)", borderRadius: 10,
        padding: "12px 14px", lineHeight: 1.5,
      }}>
        {t("dailyCareDisclaimer")}
      </p>
    </div>
  );
}
