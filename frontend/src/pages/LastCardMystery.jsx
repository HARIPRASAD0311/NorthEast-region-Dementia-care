/**
 * LastCardMystery.jsx
 * ------------------------------------------------------------------
 * React wrapper for the vanilla-JS "Last Card Mystery" game.
 *
 * Key challenges solved:
 *  1. game.js captures `document.getElementById('app')` at module load
 *     time → we dynamically import AFTER the #app div is in the DOM.
 *  2. The game's CSS uses generic class names (.btn, .card) that clash
 *     with the React app → we inject a <link> tag only while this
 *     route is mounted and remove it on unmount.
 * ------------------------------------------------------------------
 */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LastCardMystery() {
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    // Inject the game's CSS as a scoped stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/lcm-styles.css";
    link.id = "lcm-stylesheet";
    document.head.appendChild(link);

    if (!started.current) {
      started.current = true;
      // Dynamic import so game.js runs AFTER the #app div exists in the DOM.
      Promise.all([
        import("../../last-card-mystery/src/gameState.js"),
        import("../../last-card-mystery/src/game.js"),
      ]).then(([gameStateModule, gameModule]) => {
        gameStateModule.goTo("home");
        gameModule.start();
      });
    }

    return () => {
      // Remove the injected stylesheet when leaving the game.
      const el = document.getElementById("lcm-stylesheet");
      if (el) el.remove();
      started.current = false;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Back button — fixed overlay so user can exit at any time */}
      <button
        onClick={() => navigate("/activities")}
        aria-label="Back to Activities"
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 200,
          background: "white",
          border: "2px solid #E4D9C3",
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <ArrowLeft size={18} />
        Activities
      </button>

      {/* The vanilla game engine mounts into this div */}
      <div id="app" role="main" aria-live="polite" />
    </div>
  );
}
