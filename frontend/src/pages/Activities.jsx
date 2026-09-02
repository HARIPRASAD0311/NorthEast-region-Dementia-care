import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { ACTIVITIES, CATEGORIES } from "../data/activities.js";
import { useLanguage } from "../i18n.js";

/* ── Category config using theme tokens ─────────────────────────── */
const CATEGORY_META = {
  training: {
    icon: "Brain",
    domains: ["Memory", "Attention", "Sequencing", "Pattern recognition"],
  },
  stimulation: {
    icon: "Sparkles",
    domains: ["Recognition", "Matching", "Orientation", "Visual identification"],
  },
  rehabilitation: {
    icon: "HeartHandshake",
    domains: ["Recall", "Everyday tasks", "Sequencing", "Functional activities"],
  },
};

/* ── Domain tag ─────────────────────────────────────────────────── */
function DomainTag({ label }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      background: "var(--ga-dim)", color: "var(--ga-light)",
      border: "1px solid var(--fg-border)",
    }}>
      {label}
    </span>
  );
}

function CategoryCard({ category, count, onClick, t }) {
  const meta = CATEGORY_META[category.id] || CATEGORY_META.training;
  const Icon = Icons[meta.icon] || Icons.Brain;
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      aria-label={`Open ${category.label}`}
      style={{ display:"flex", flexDirection:"column", alignItems:"flex-start",
        width:"100%", textAlign:"left", cursor:"pointer",
        background: hovered ? "rgba(26,77,53,0.95)" : "rgba(14,53,36,0.82)",
        border:`1.5px solid ${hovered ? "var(--ga)" : "var(--fg-border)"}`,
        borderRadius:20, padding:"26px 22px",
        transition:"border-color 0.18s, background 0.18s, transform 0.15s, box-shadow 0.15s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.28)" : "0 4px 16px rgba(0,0,0,0.16)",
        backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)", gap:0 }}>
      <div className="g-icon-badge" style={{ marginBottom:16 }}>
        <Icon size={26} color="var(--ga)" strokeWidth={1.8} />
      </div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:21, fontWeight:700,
        color:"var(--cream)", margin:"0 0 8px", lineHeight:1.2 }}>
        {category.label}
      </h2>
      <p style={{ fontSize:14, color:"var(--cream-dim)", lineHeight:1.55, margin:"0 0 14px" }}>
        {category.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
        {meta.domains.map(d => <DomainTag key={d} label={d} />)}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", marginTop:"auto" }}>
        <span style={{ fontSize:13, fontWeight:600, color:"var(--cream-dim)" }}>
          {count} {count === 1 ? "activity" : "activities"}
        </span>
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:14, fontWeight:700, color:"var(--ga)" }}>
          {t("explore")} <Icons.ArrowRight size={15} color="var(--ga)" />
        </span>
      </div>
    </button>
  );
}

function GameCard({ activity, onSelect, t }) {
  const Icon = Icons[activity.icon] || Icons.Puzzle;
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={() => onSelect(activity)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      aria-label={`Start ${activity.title}`}
      style={{ display:"flex", alignItems:"center", gap:16,
        width:"100%", textAlign:"left", cursor:"pointer",
        background: hovered ? "rgba(26,77,53,0.95)" : "rgba(14,53,36,0.82)",
        border:`1.5px solid ${hovered ? "var(--ga)" : "var(--fg-border)"}`,
        borderRadius:16, padding:"16px 18px",
        transition:"border-color 0.15s, background 0.15s, transform 0.12s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 22px rgba(0,0,0,0.22)" : "0 3px 10px rgba(0,0,0,0.12)",
        backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)" }}>
      <div className="g-icon-badge" style={{ flexShrink:0 }}>
        <Icon size={22} color="var(--ga)" strokeWidth={1.8} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:700, fontSize:17, color:"var(--cream)", margin:"0 0 4px" }}>{activity.title}</p>
        <p style={{ fontSize:13.5, color:"var(--cream-dim)", margin:0, lineHeight:1.4,
          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {activity.description}
        </p>
        <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
          <span className="g-pill">{t("level")} {activity.baseLevel}</span>
          {activity.badge && <span className="g-pill">{activity.badge}</span>}
        </div>
      </div>
      <Icons.ChevronRight size={20} color="var(--ga-light)" style={{ flexShrink:0 }} />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function Activities() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);

  function handleSelectActivity(activity) {
    if (activity.type === "last-card-mystery") navigate("/last-card-mystery");
    else if (activity.type === "assam-connection-chain") navigate("/assam-connection-chain");
    else navigate(`/game/${activity.id}`);
  }

  const categoryGames = selectedCategory
    ? ACTIVITIES.filter((a) => a.category === selectedCategory)
    : [];
  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  if (!selectedCategory) {
    return (
      <div>
        <div style={{ marginBottom: 26 }}>
          <p className="g-label" style={{ marginBottom: 6 }}>{t("cognitiveActivities")}</p>
          <h1 className="g-page-title">{t("chooseCategory")}</h1>
          <p className="g-page-sub">{t("selectActivity")}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat} t={t}
              count={ACTIVITIES.filter(a => a.category === cat.id).length}
              onClick={() => setSelectedCategory(cat.id)} />
          ))}
        </div>
      </div>
    );
  }

  const meta = CATEGORY_META[selectedCategory] || CATEGORY_META.training;
  const Icon = Icons[meta.icon] || Icons.Brain;

  return (
    <div>
      <button onClick={() => setSelectedCategory(null)} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "none", border: "none", padding: "0 0 16px",
        fontSize: 15, fontWeight: 600, color: "var(--ga)", cursor: "pointer",
      }}>
        <Icons.ArrowLeft size={17} color="var(--ga)" />
        {t("backToActivities")}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <div className="g-icon-badge">
          <Icon size={22} color="var(--ga)" strokeWidth={1.8} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, color: "var(--cream)", margin: "0 0 3px" }}>
            {activeCategory?.label}
          </h1>
          <p style={{ color: "var(--cream-dim)", fontSize: 14, margin: 0 }}>
            {categoryGames.length === 1
              ? t("activityAvailable")
              : t("activitiesAvailable").replace("{count}", categoryGames.length)}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categoryGames.map(activity => (
          <GameCard key={activity.id} activity={activity} t={t} onSelect={handleSelectActivity} />
        ))}
      </div>
    </div>
  );
}
