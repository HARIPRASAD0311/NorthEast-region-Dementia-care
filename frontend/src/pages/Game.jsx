import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getActivity } from "../data/activities.js";
import {
  getRoundsForActivity,
  getMemoryMatchIcons,
  getSequenceMaxRounds,
} from "../data/gameContent.js";
import { loadGameLevel } from "../services/storage.js";
import { useLanguage } from "../i18n.js";
import VoiceAssistant from "../components/VoiceAssistant.jsx";
import { HelpCircle } from "lucide-react";

export default function Game() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const activity = getActivity(activityId);

  if (!activity) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <p>Activity not found.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/activities")}>{t("backToActivities")}</button>
      </div>
    );
  }

  const currentLevel = loadGameLevel(activityId, activity.baseLevel || 1);

  if (activity.type === "match")    return <MemoryMatchGame activity={activity} currentLevel={currentLevel} t={t} />;
  if (activity.type === "sequence") return <SequenceGame    activity={activity} currentLevel={currentLevel} t={t} />;

  const rounds = getRoundsForActivity(activityId, currentLevel);
  return <ChoiceGame activity={activity} rounds={rounds} currentLevel={currentLevel} t={t} />;
}

// ---- Generic multiple-choice mini-game (word recall, naming, routine, orientation) ----
function ChoiceGame({ activity, rounds, currentLevel, t }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [roundStart, setRoundStart] = useState(Date.now());
  const [responseTimes, setResponseTimes] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const round = rounds[i];

  useEffect(() => { setRoundStart(Date.now()); setSelected(null); setShowHint(false); }, [i]);

  function choose(opt) {
    if (selected) return;
    setSelected(opt);
    setResponseTimes((t) => [...t, Date.now() - roundStart]);
    const isCorrect = opt === round.correct;
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setMistakes((m) => m + 1);

    setTimeout(() => {
      if (i === rounds.length - 1) {
        finish(isCorrect);
      } else {
        setI((n) => n + 1);
      }
    }, 700);
  }

  function finish(lastCorrect) {
    const totalCorrect = correctCount + (lastCorrect ? 1 : 0);
    const accuracy = Math.round((totalCorrect / rounds.length) * 100);
    const avgResponseMs = Math.round(responseTimes.reduce((s, v) => s + v, 0) / (responseTimes.length || 1)) || 0;
    navigate(`/game-result/${activity.id}`, {
      state: { accuracy, mistakes, avgResponseMs, hintsUsed, activityTitle: activity.title, currentLevel },
    });
  }

  return (
    <div style={{ maxWidth: 560, margin: "20px auto" }}>
      <div className="game-hud">
        <span style={{ color: "var(--muted)", fontWeight: 600 }}>
          {t("roundOf").replace("{current}", i + 1).replace("{total}", rounds.length)}
        </span>
        <button className="icon-btn" onClick={() => { setShowHint(true); setHintsUsed((h) => h + 1); }} title="Get a hint">
          <HelpCircle size={18} />
        </button>
      </div>
      <div className="progress-bar-track" style={{ marginBottom: 18 }}>
        <div className="progress-bar-fill" style={{ width: `${(i / rounds.length) * 100}%` }} />
      </div>

      <div className="card game-stage">
        <h2 style={{ fontSize: 21 }}>{round.prompt}</h2>
        {showHint && <p style={{ color: "var(--gold)", fontWeight: 600 }}>Hint: it starts with "{round.correct[0]}"</p>}
        <div className="game-option-grid">
          {round.options.map((opt) => {
            let cls = "game-option";
            if (selected) {
              if (opt === round.correct) cls += " correct";
              else if (opt === selected) cls += " incorrect";
            }
            return (
              <button key={opt} className={cls} onClick={() => choose(opt)} disabled={!!selected}>
                {opt}
              </button>
            );
          })}
        </div>
        <VoiceAssistant script={round.prompt} />
      </div>
    </div>
  );
}

// ---- Memory Match: flip-card pair matching ----
function MemoryMatchGame({ activity, currentLevel, t }) {
  const navigate = useNavigate();
  const icons = getMemoryMatchIcons(currentLevel);

  const cards = useMemo(() => {
    const pairs = [...icons, ...icons]
      .map((icon, idx) => ({ id: idx, icon }))
      .sort(() => Math.random() - 0.5);
    return pairs;
  }, []);                          // icons is stable within a render

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [moves, setMoves] = useState(0);

  const flip = useCallback((idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].icon)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].icon === cards[b].icon) {
        setMatched((m) => [...m, cards[a].icon]);
        setFlipped([]);
      } else {
        setMistakes((m) => m + 1);
        setTimeout(() => setFlipped([]), 700);
      }
    }
  }, [flipped, matched, cards]);

  useEffect(() => {
    if (matched.length === icons.length) {
      const elapsedMs = Date.now() - startTime;
      const accuracy = Math.max(20, Math.round(100 - (mistakes / (moves || 1)) * 60));
      navigate(`/game-result/${activity.id}`, {
        state: { accuracy, mistakes, avgResponseMs: Math.round(elapsedMs / (moves || 1)), hintsUsed: 0, activityTitle: activity.title, currentLevel },
      });
    }
  }, [matched]);

  return (
    <div style={{ maxWidth: 480, margin: "20px auto" }}>
      <div className="game-hud">
        <span style={{ color: "var(--muted)", fontWeight: 600 }}>
          {t("pairsFound").replace("{found}", matched.length).replace("{total}", icons.length)}
        </span>
        <span style={{ color: "var(--muted)", fontWeight: 600 }}>{t("mistakes")}: {mistakes}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {cards.map((c, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(c.icon);
          return (
            <button
              key={c.id}
              onClick={() => flip(idx)}
              style={{
                aspectRatio: "1", fontSize: 28, borderRadius: 14,
                border: `2px solid var(--line)`,
                background: isFlipped ? "var(--pine-light)" : "var(--white)",
              }}
            >
              {isFlipped ? c.icon : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Pattern Sequence: repeat a growing "Simon says" sequence ----
function SequenceGame({ activity, currentLevel, t }) {
  const navigate = useNavigate();
  const SHAPES = ["●", "▲", "■", "◆"];
  const MAX_ROUNDS = getSequenceMaxRounds(currentLevel);

  const [sequence, setSequence] = useState([Math.floor(Math.random() * 4)]);
  const [userInput, setUserInput] = useState([]);
  const [showing, setShowing] = useState(true);
  const [round, setRound] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    setShowing(true);
    const timer = setTimeout(() => setShowing(false), 900 + sequence.length * 500);
    return () => clearTimeout(timer);
  }, [sequence]);

  function press(idx) {
    if (showing) return;
    const next = [...userInput, idx];
    setUserInput(next);
    const expected = sequence[next.length - 1];
    if (idx !== expected) {
      setMistakes((m) => m + 1);
      setUserInput([]);
      return;
    }
    if (next.length === sequence.length) {
      if (round >= MAX_ROUNDS) {
        const accuracy = Math.max(20, Math.round(100 - (mistakes / MAX_ROUNDS) * 40));
        navigate(`/game-result/${activity.id}`, {
          state: { accuracy, mistakes, avgResponseMs: Math.round((Date.now() - startTime) / round), hintsUsed: 0, activityTitle: activity.title, currentLevel },
        });
        return;
      }
      setRound((r) => r + 1);
      setUserInput([]);
      setSequence((s) => [...s, Math.floor(Math.random() * 4)]);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "20px auto", textAlign: "center" }}>
      <p style={{ color: "var(--muted)", fontWeight: 600, marginBottom: 14 }}>
        {t("roundOf").replace("{current}", round).replace("{total}", MAX_ROUNDS)}
      </p>
      <p style={{ marginBottom: 20 }}>{showing ? t("watchSequence") : t("repeatNow")}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, maxWidth: 260, margin: "0 auto" }}>
        {SHAPES.map((shape, idx) => (
          <button
            key={idx}
            onClick={() => press(idx)}
            disabled={showing}
            style={{
              fontSize: 34, padding: "28px 0", borderRadius: 16,
              border: `2px solid var(--line)`,
              background: "var(--white)",
              opacity: showing ? 0.6 : 1,
            }}
          >
            {shape}
          </button>
        ))}
      </div>
      {showing && <SequencePlayback sequence={sequence} shapes={SHAPES} />}
    </div>
  );
}

function SequencePlayback({ sequence, shapes }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    const interval = setInterval(() => setStep((s) => (s + 1 < sequence.length ? s + 1 : s)), 500);
    return () => clearInterval(interval);
  }, [sequence]);
  return (
    <p style={{ marginTop: 18, fontSize: 30, letterSpacing: 8 }}>
      {shapes[sequence[step]]}
    </p>
  );
}
