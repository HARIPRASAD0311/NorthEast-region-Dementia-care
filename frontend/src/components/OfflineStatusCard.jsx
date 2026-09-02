import { CloudOff } from "lucide-react";

export default function OfflineStatusCard({ synced = true }) {
  return (
    <div className="card">
      <p style={{ fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <CloudOff size={18} color="var(--pine)" /> Offline ready
      </p>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 12 }}>
        Core cognitive activities are available offline. Results sync automatically when the connection returns.
      </p>
      <span className="pill" style={{ background: synced ? "var(--pine-light)" : "var(--gold-light)", color: synced ? "var(--pine-dark)" : "#7a5a1f" }}>
        {synced ? "● Synced" : "● Offline — sync pending"}
      </span>
    </div>
  );
}
