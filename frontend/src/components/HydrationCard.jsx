import { useState } from "react";
import { Droplets } from "lucide-react";

export default function HydrationCard({ target = 7 }) {
  const [glasses, setGlasses] = useState(5);
  return (
    <div className="card">
      <p style={{ fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <Droplets size={18} color="var(--pine)" /> Hydration
      </p>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>Today's progress</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {Array.from({ length: target }).map((_, i) => (
          <Droplets key={i} size={22} color={i < glasses ? "var(--pine)" : "var(--line)"} fill={i < glasses ? "var(--pine)" : "none"} />
        ))}
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{glasses} / {target} glasses</p>
      <button className="btn btn-secondary btn-block" onClick={() => setGlasses((g) => Math.min(target, g + 1))}>
        + Add water
      </button>
    </div>
  );
}
