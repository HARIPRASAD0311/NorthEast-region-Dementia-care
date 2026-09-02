import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";

const AccessibilityContext = createContext(null);

export function speak(text, enabled) {
  if (!enabled) return;
  if (!text) return;
  try {
    if (!window.speechSynthesis) return;
    // Cancel any in-progress speech, then defer the new utterance by one
    // tick so the browser's synthesis queue actually clears before we
    // enqueue the next item. Without the timeout, Chrome/Chromium silently
    // drops the speak() call when cancel() and speak() happen in the same
    // synchronous stack frame.
    window.speechSynthesis.cancel();
    setTimeout(() => {
      try {
        const u = new window.SpeechSynthesisUtterance(text);
        u.rate = 0.92;
        window.speechSynthesis.speak(u);
      } catch {
        // synthesis unavailable — fail silently
      }
    }, 100);
  } catch {
    // speech synthesis unsupported in this browser — voice guidance simply won't play
  }
}

export function AccessibilityProvider({ children }) {
  const [voiceOn, setVoiceOn] = useState(true);
  const [textScale, setTextScale] = useState(1); // 1 = normal, 1.15 = large, 1.3 = extra large
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${17 * textScale}px`;
  }, [textScale]);

  const toggleVoice = useCallback(() => setVoiceOn((v) => !v), []);
  // Pass voiceOn as a ref so say() always reads the current value,
  // not a stale closure captured at the time useCallback was last run.
  const voiceOnRef = useRef(voiceOn);
  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);
  const say = useCallback((text) => speak(text, voiceOnRef.current), []);

  const value = {
    voiceOn,
    toggleVoice,
    say,
    textScale,
    setTextScale,
    openPanel: () => setPanelOpen(true),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {panelOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(28,48,42,0.35)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setPanelOpen(false)}
        >
          <div
            className="card"
            style={{ width: 340, maxWidth: "90vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 19 }}>Accessibility</h3>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setPanelOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontWeight: 600, marginBottom: 8 }}>Text size</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[
                { k: 1, label: "Normal" },
                { k: 1.15, label: "Large" },
                { k: 1.3, label: "Extra large" },
              ].map(({ k, label }) => (
                <button
                  key={k}
                  className={`btn ${textScale === k ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, padding: "10px 6px", fontSize: 14 }}
                  onClick={() => setTextScale(k)}
                >
                  {label}
                </button>
              ))}
            </div>

            <p style={{ fontWeight: 600, marginBottom: 8 }}>Voice guidance</p>
            <button className={`btn btn-block ${voiceOn ? "btn-primary" : "btn-secondary"}`} onClick={toggleVoice}>
              {voiceOn ? "On — tap to turn off" : "Off — tap to turn on"}
            </button>
          </div>
        </div>
      )}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
