import { Globe, Mic, Brain, CloudOff, Users } from "lucide-react";

const ITEMS = [
  { icon: Globe, label: "Multilingual", sub: "Supported regional languages" },
  { icon: Mic, label: "Voice assistant", sub: "Voice-guided navigation" },
  { icon: Brain, label: "Adaptive AI", sub: "Personalized cognitive activities" },
  { icon: CloudOff, label: "Offline support", sub: "Activities without continuous internet" },
  { icon: Users, label: "Caregiver support", sub: "Connected caregiver assistance" },
];

export default function BottomInfoBar() {
  return (
    <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: "18px 24px", marginTop: 4 }}>
      {ITEMS.map(({ icon: Icon, label, sub }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 180px" }}>
          <Icon size={18} color="var(--pine)" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{label}</p>
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
