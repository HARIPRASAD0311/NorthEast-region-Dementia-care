import { useNavigate } from "react-router-dom";
import { Mic, Users, LifeBuoy, ChevronRight } from "lucide-react";
import { useAccessibility } from "./AccessibilityControls.jsx";

export default function QuickAccessCard() {
  const navigate = useNavigate();
  const { say } = useAccessibility();

  const items = [
    { icon: Mic, label: "Voice assistant help", action: () => say("You can say things like, start my activity, or, show my reminders.") },
    { icon: Users, label: "Caregiver dashboard", action: () => navigate("/caregiver") },
    { icon: LifeBuoy, label: "Emergency contact", action: () => navigate("/profile") },
  ];

  return (
    <div className="card">
      <p style={{ fontWeight: 700, marginBottom: 12 }}>Quick access</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", background: "none", border: "none", textAlign: "left", borderRadius: 8 }}
          >
            <Icon size={19} color="var(--pine)" />
            <span style={{ flex: 1, fontSize: 15 }}>{label}</span>
            <ChevronRight size={16} color="var(--muted)" />
          </button>
        ))}
      </div>
    </div>
  );
}
