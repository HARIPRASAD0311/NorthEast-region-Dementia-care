import { Volume2, Settings } from "lucide-react";
import { useAccessibility } from "./AccessibilityControls.jsx";

export default function Topbar({ title }) {
  const { voiceOn, toggleVoice, openPanel } = useAccessibility();

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <button
          className={`icon-btn${voiceOn ? " active" : ""}`}
          onClick={toggleVoice}
          aria-pressed={voiceOn}
          title={voiceOn ? "Voice guidance is on" : "Voice guidance is off"}
        >
          <Volume2 size={20} />
        </button>
        <button className="icon-btn" onClick={openPanel} title="Accessibility settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
