import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const DEFAULT_ITEMS = [
  { id: "walk", label: "Morning walk", done: false },
  { id: "breakfast", label: "Breakfast", done: true },
  { id: "exercise", label: "Exercise", done: false },
  { id: "evening", label: "Evening activity", done: false },
];

export default function DailyChecklistCard() {
  const navigate = useNavigate();
  const [items, setItems] = useState(DEFAULT_ITEMS);

  function toggle(id) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  return (
    <div className="card">
      <p style={{ fontWeight: 700, marginBottom: 12 }}>Daily activities</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0, textAlign: "left" }}
          >
            <span
              style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${item.done ? "var(--pine)" : "var(--line)"}`, background: item.done ? "var(--pine)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              {item.done && <Check size={16} color="var(--paper)" strokeWidth={3} />}
            </span>
            <span style={{ fontSize: 15.5, color: item.done ? "var(--muted)" : "var(--ink)", textDecoration: item.done ? "line-through" : "none" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <button onClick={() => navigate("/daily-care")} style={{ background: "none", border: "none", color: "var(--pine)", fontWeight: 600, fontSize: 14.5, padding: 0, marginTop: 14 }}>
        View all →
      </button>
    </div>
  );
}
