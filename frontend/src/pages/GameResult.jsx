import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowUp, ArrowDown, Minus, Home } from "lucide-react";
import { computeNextLevel } from "../services/adaptiveEngine.js";
import { saveSession, saveGameLevel } from "../services/storage.js";
import { getActivity } from "../data/activities.js";
import { useLanguage } from "../i18n.js";

export default function GameResult() {
  const { activityId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const activity = getActivity(activityId);

  if (!state) { navigate("/activities"); return null; }

  const { accuracy, mistakes, avgResponseMs, hintsUsed, activityTitle, currentLevel } = state;
  const levelUsed = typeof currentLevel === "number" ? currentLevel : (activity?.baseLevel || 1);
  const adaptation = computeNextLevel(levelUsed, { accuracy, mistakes, avgResponseMs, hintsUsed });

  saveSession({ date: new Date().toISOString().slice(0,10), activity: activityTitle,
    accuracy, mistakes, avgResponseMs, hintsUsed, level: adaptation.nextLevel });
  saveGameLevel(activityId, adaptation.nextLevel);

  const DirIcon = adaptation.direction === "up" ? ArrowUp
    : adaptation.direction === "down" ? ArrowDown : Minus;

  return (
    <div style={{ maxWidth:520, margin:"30px auto", textAlign:"center" }}>
      <div className="result-hero">
        <div className="result-ring" style={{ "--pct": accuracy }}>
          <div className="result-ring-inner">
            <span style={{ fontSize:30, fontWeight:700, fontFamily:"var(--font-display)" }}>{accuracy}%</span>
            <span style={{ fontSize:13, color:"var(--muted)" }}>{t("accuracy")}</span>
          </div>
        </div>
        <h1 className="section-title" style={{ fontSize:24 }}>
          {t("gameComplete").replace("{title}", activityTitle)}
        </h1>
      </div>

      <div className="grid grid-3" style={{ marginBottom:20 }}>
        <div className="card" style={{ padding:14 }}>
          <p style={{ fontSize:22, fontWeight:700 }}>{mistakes}</p>
          <p style={{ fontSize:13, color:"var(--muted)" }}>{t("mistakes")}</p>
        </div>
        <div className="card" style={{ padding:14 }}>
          <p style={{ fontSize:22, fontWeight:700 }}>{(avgResponseMs/1000).toFixed(1)}s</p>
          <p style={{ fontSize:13, color:"var(--muted)" }}>{t("avgResponse")}</p>
        </div>
        <div className="card" style={{ padding:14 }}>
          <p style={{ fontSize:22, fontWeight:700 }}>{hintsUsed}</p>
          <p style={{ fontSize:13, color:"var(--muted)" }}>{t("hintsUsed")}</p>
        </div>
      </div>

      <div className="card" style={{ textAlign:"left", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div className="icon-btn active" style={{ width:34, height:34 }}><DirIcon size={16} /></div>
          <p style={{ fontWeight:700 }}>
            {adaptation.direction === "up"   && t("levelIncreased")}
            {adaptation.direction === "down" && t("levelAdjustedDown")}
            {adaptation.direction === "hold" && t("levelStaysSame")}
          </p>
        </div>
        <p style={{ color:"var(--muted)", fontSize:15 }}>{adaptation.reason}</p>
      </div>

      <div style={{ display:"flex", gap:12 }}>
        <button className="btn btn-secondary btn-block" onClick={() => navigate("/activities")}>
          {t("moreActivities")}
        </button>
        <button className="btn btn-primary btn-block" onClick={() => navigate("/dashboard")}>
          <Home size={18} /> {t("dashboard")}
        </button>
      </div>
    </div>
  );
}
