import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import CognitiveScoreCard from "../components/CognitiveScoreCard.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import { sampleUser, sessionHistory } from "../data/sampleUser.js";
import { loadSessions } from "../services/storage.js";
import { useLanguage } from "../i18n.js";

export default function PatientDetails() {
  const stored = loadSessions([]);
  const { t } = useLanguage();
  const combined = [...sessionHistory, ...stored].slice(-14);

  return (
    <div>
      <Link to="/caregiver" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--pine)", fontWeight: 600, textDecoration: "none", marginBottom: 16 }}>
        <ChevronLeft size={18} /> {t("backToCaregiverView")}
      </Link>
      <PageHeader title={sampleUser.fullName} subtitle={`${sampleUser.state} · ${t("lastAssessed")} ${sampleUser.cognitiveProfile.lastAssessed}`} />

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <ProgressCard title={t("accuracyAcrossSessions")} sessions={combined} />
        <CognitiveScoreCard domains={sampleUser.cognitiveProfile.domains} />
      </div>

      <div className="card">
        <p style={{ fontWeight: 700, marginBottom: 12 }}>{t("allSessions")}</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--muted)", borderBottom: `1px solid var(--line)` }}>
              <th style={{ padding: "8px 6px" }}>{t("date")}</th>
              <th style={{ padding: "8px 6px" }}>{t("activityCol")}</th>
              <th style={{ padding: "8px 6px" }}>{t("accuracyCol")}</th>
              <th style={{ padding: "8px 6px" }}>{t("mistakesCol")}</th>
              <th style={{ padding: "8px 6px" }}>{t("levelCol")}</th>
            </tr>
          </thead>
          <tbody>
            {combined.slice().reverse().map((s, i) => (
              <tr key={i} style={{ borderBottom: `1px solid var(--line)` }}>
                <td style={{ padding: "8px 6px" }}>{s.date}</td>
                <td style={{ padding: "8px 6px" }}>{s.activity}</td>
                <td style={{ padding: "8px 6px" }}>{s.accuracy}%</td>
                <td style={{ padding: "8px 6px" }}>{s.mistakes}</td>
                <td style={{ padding: "8px 6px" }}>{s.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
