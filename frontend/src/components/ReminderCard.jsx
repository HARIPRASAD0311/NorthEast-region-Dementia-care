import { Pill, Droplets, Puzzle, CalendarClock, Check } from "lucide-react";

const ICONS = { Medication: Pill, Hydration: Droplets, Activity: Puzzle, Appointment: CalendarClock };

export default function ReminderCard({ reminder, onToggle }) {
  const Icon = ICONS[reminder.type] || Puzzle;
  return (
    <div
      className="card"
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", opacity: reminder.done ? 0.6 : 1 }}
    >
      <div className="activity-icon" style={{ width: 42, height: 42 }}><Icon size={20} /></div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600 }}>{reminder.label}</p>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{reminder.type} · {reminder.time}</p>
      </div>
      <button
        className={`icon-btn${reminder.done ? " active" : ""}`}
        onClick={() => onToggle(reminder.id)}
        aria-pressed={reminder.done}
        title={reminder.done ? "Marked done" : "Mark as done"}
      >
        <Check size={18} />
      </button>
    </div>
  );
}
