export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 16, flexWrap: "wrap" }}>
      <div>
        <h1 className="section-title" style={{ fontSize: 26 }}>{title}</h1>
        {subtitle && <p className="section-subtitle" style={{ marginBottom: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
