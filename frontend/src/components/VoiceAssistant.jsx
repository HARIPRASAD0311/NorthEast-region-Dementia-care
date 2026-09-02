import { Volume2 } from "lucide-react";
import { useAccessibility } from "./AccessibilityControls.jsx";

// Drop this on any page with a `script` — the text that should be read
// aloud when the user taps it. Keeps voice guidance consistent without
// every page reimplementing speech synthesis calls.
export default function VoiceAssistant({ script, label = "Listen" }) {
  const { say } = useAccessibility();
  return (
    <button className="btn btn-secondary" onClick={() => say(script)}>
      <Volume2 size={18} />
      {label}
    </button>
  );
}
