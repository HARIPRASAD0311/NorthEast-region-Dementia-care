/**
 * AssamConnectionChain.jsx
 * ------------------------------------------------------------------
 * React wrapper for the "Assam Connection Chain" vanilla-React game.
 *
 * The game manages all its own view state internally (welcome →
 * instructions → chain/memory → result). We mount its App component
 * directly, inject its CSS while the route is active, and intercept
 * the "Back to Activities" action from ResultScreen so it navigates
 * properly within the main app instead of trying to reset an internal
 * state that no longer exists.
 * ------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AssamConnectionChain() {
  const navigate = useNavigate();
  const [GameApp, setGameApp] = useState(null);
  const linkRef = useRef(null);

  useEffect(() => {
    /* Inject the game's CSS (scoped to this route only) */
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/acc-styles.css";
    link.id = "acc-stylesheet";
    document.head.appendChild(link);
    linkRef.current = link;

    /* Dynamically import the game's App component after mount */
    import("../../assam-connection-chain/src/App.jsx").then((mod) => {
      setGameApp(() => mod.default);
    });

    return () => {
      linkRef.current?.remove();
      linkRef.current = null;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Fixed back button — always accessible */}
      <button
        onClick={() => navigate("/activities")}
        aria-label="Back to Activities"
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 300,
          background: "white",
          border: "2px solid #d8cdb8",
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          fontFamily: "inherit",
        }}
      >
        <ArrowLeft size={18} />
        Activities
      </button>

      {/* Game mounts here once loaded */}
      {GameApp ? (
        <GameApp />
      ) : (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", fontSize: 17, color: "#6b6355",
        }}>
          Loading…
        </div>
      )}
    </div>
  );
}
