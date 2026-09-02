import PageHeader from "../components/PageHeader.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import { sampleUser } from "../data/sampleUser.js";
import { useAccessibility } from "../components/AccessibilityControls.jsx";
import { useLanguage } from "../i18n.js";

export default function Profile() {
  const { voiceOn, toggleVoice, textScale, setTextScale } = useAccessibility();
  const { t } = useLanguage();
  const { caregiver } = sampleUser;

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title={t("profileTitle")} subtitle={t("profileSubtitle")} />

      <div style={{ marginBottom: 20 }}><ProfileCard user={sampleUser} /></div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 700, marginBottom: 14 }}>{t("accessibilityPreferences")}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span>{t("voiceGuidance")}</span>
          <button className={`btn ${voiceOn ? "btn-primary" : "btn-secondary"}`} onClick={toggleVoice}>
            {voiceOn ? t("on") : t("off")}
          </button>
        </div>
        <div>
          <p style={{ marginBottom: 8 }}>{t("textSize")}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ k: 1, l: t("normal") }, { k: 1.15, l: t("large") }, { k: 1.3, l: t("extraLarge") }].map(({ k, l }) => (
              <button key={k} className={`btn ${textScale === k ? "btn-primary" : "btn-secondary"}`} style={{ flex: 1 }} onClick={() => setTextScale(k)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 700, marginBottom: 10 }}>{t("trustedPerson")}</p>
        {caregiver ? (
          <>
            <p style={{ fontWeight: 600 }}>{caregiver.name} <span style={{ color: "var(--muted)", fontWeight: 400 }}>· {caregiver.relationship}</span></p>
            <p style={{ color: "var(--muted)", fontSize: 15 }}>{caregiver.phone}</p>
            <span className={`pill ${caregiver.progressSharing ? "pill-pine" : "pill-clay"}`} style={{ marginTop: 10 }}>
              {caregiver.progressSharing ? t("progressSharingOn") : t("progressSharingOff")}
            </span>
          </>
        ) : (
          <p style={{ color: "var(--muted)" }}>{t("noCaregiverConnected")}</p>
        )}
      </div>
    </div>
  );
}
