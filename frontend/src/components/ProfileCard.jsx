export default function ProfileCard({ user }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--pine)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)" }}
      >
        {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 18 }}>{user.fullName}</p>
        <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{user.state} · {user.preferredLanguage}</p>
      </div>
    </div>
  );
}
