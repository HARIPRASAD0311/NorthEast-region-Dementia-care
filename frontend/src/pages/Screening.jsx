import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import VoiceAssistant from "../components/VoiceAssistant.jsx";
import { useLanguage } from "../i18n.js";

export default function Screening() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const SCRIPT = t("screeningScript");

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
      <div className="activity-icon" style={{ width: 70, height: 70, margin: "0 auto 20px" }}>
        <ClipboardCheck size={32} />
      </div>
      <h1 className="section-title" style={{ fontSize: 26 }}>{t("screenIntroTitle")}</h1>
      <p className="section-subtitle" style={{ fontSize: 17 }}>
        {t("screenIntroText")}
      </p>

      <div className="disclaimer" style={{ textAlign: "left", marginBottom: 24 }}>
        {t("screenDisclaimer")}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <VoiceAssistant script={SCRIPT} />
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/assessment")}>
          {t("beginScreening")}
        </button>
      </div>
    </div>
  );
}
