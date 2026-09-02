import { useEffect, useMemo, useState } from 'react';
import NodeCard from './NodeCard.jsx';
import NodeChain from './NodeChain.jsx';
import AnswerCard from './AnswerCard.jsx';
import HintButton from './HintButton.jsx';
import VoiceButton from './VoiceButton.jsx';
import ProgressBar from './ProgressBar.jsx';
import LevelComplete from './LevelComplete.jsx';
import { LEVELS, TOTAL_LEVELS, getNode } from '../data/questions.js';
import { speak } from '../utils/speech.js';

const PROMPT_TEXT = 'Which picture is connected to this?';
const ENCOURAGE_CORRECT = ['Wonderful! You found the connection.', 'Lovely! That connects perfectly.', 'Yes! Beautifully done.'];
const ENCOURAGE_INCORRECT = ["Good try. Let's look again.", 'Almost — take another look.', 'No trouble, try once more.'];

export default function GameScreen({ startLevel = 1, soundOn, reduceMotion, onExit, onAllLevelsComplete }) {
  const [levelIndex, setLevelIndex] = useState(startLevel - 1);
  const [stepIndex, setStepIndex] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongPicks, setWrongPicks] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [phase, setPhase] = useState('question'); // 'question' | 'levelComplete'
  const [levelStartScore, setLevelStartScore] = useState(0);

  const level = LEVELS[levelIndex];
  const step = level?.steps[stepIndex];

  // Start each level with just its first node discovered.
  useEffect(() => {
    setDiscoveredIds([level.chain[0]]);
    setStepIndex(0);
    setWrongPicks([]);
    setFeedback(null);
    setPhase('question');
    setScore((currentScore) => {
      setLevelStartScore(currentScore);
      return currentScore;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  const currentNode = getNode(step?.promptId);
  const chainNodes = useMemo(() => discoveredIds.map(getNode), [discoveredIds]);

  useEffect(() => {
    if (phase === 'question' && soundOn && currentNode) {
      speak(`${currentNode.label}. ${PROMPT_TEXT}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex, stepIndex, phase]);

  function handleSelect(choiceId) {
    if (feedback === 'correct') return; // already advancing
    if (choiceId === step.correctId) {
      setFeedback('correct');
      setScore((s) => s + 1);
      if (soundOn) speak(ENCOURAGE_CORRECT[stepIndex % ENCOURAGE_CORRECT.length]);
      const delay = reduceMotion ? 300 : 900;
      setTimeout(() => {
        setDiscoveredIds((ids) => [...ids, choiceId]);
        if (stepIndex + 1 < level.steps.length) {
          setStepIndex((i) => i + 1);
          setWrongPicks([]);
          setFeedback(null);
        } else {
          setPhase('levelComplete');
        }
      }, delay);
    } else {
      setFeedback('incorrect');
      setWrongPicks((w) => [...w, choiceId]);
      if (soundOn) speak(ENCOURAGE_INCORRECT[stepIndex % ENCOURAGE_INCORRECT.length]);
      setTimeout(() => setFeedback(null), reduceMotion ? 200 : 700);
    }
  }

  function goNextLevel() {
    if (levelIndex + 1 < TOTAL_LEVELS) {
      setLevelIndex((i) => i + 1);
    } else {
      onAllLevelsComplete(score);
    }
  }

  function replayLevel() {
    setDiscoveredIds([level.chain[0]]);
    setStepIndex(0);
    setWrongPicks([]);
    setFeedback(null);
    setPhase('question');
    setScore(levelStartScore);
  }

  if (phase === 'levelComplete') {
    return (
      <LevelComplete
        level={level.level}
        chainNodes={chainNodes}
        onNext={goNextLevel}
        onReplay={replayLevel}
        isFinalLevel={levelIndex + 1 >= TOTAL_LEVELS}
      />
    );
  }

  return (
    <div className="screen game-screen">
      <div className="game-screen__top">
        <ProgressBar current={level.level} total={TOTAL_LEVELS} stepLabel={`Step ${stepIndex + 1} of ${level.steps.length}`} />
        <button type="button" className="btn btn--ghost btn--small" onClick={onExit}>
          Exit
        </button>
      </div>

      <NodeChain nodes={chainNodes} />

      <div className="game-screen__current">
        <NodeCard node={currentNode} isCurrent size="lg" />
        <div className="game-screen__prompt-row">
          <p className="game-screen__prompt">{PROMPT_TEXT}</p>
          <VoiceButton text={`${currentNode.label}. ${PROMPT_TEXT}`} soundOn={soundOn} />
        </div>
        <HintButton hintText={currentNode.hint} />
      </div>

      <div className={`answer-grid answer-grid--${step.choiceIds.length}`}>
        {step.choiceIds.map((id) => {
          const node = getNode(id);
          let revealState = null;
          if (feedback === 'correct' && id === step.correctId) revealState = 'correct';
          else if (wrongPicks.includes(id)) revealState = 'incorrect';
          return (
            <AnswerCard
              key={id}
              node={node}
              onSelect={handleSelect}
              revealState={revealState}
              disabled={wrongPicks.includes(id) || feedback === 'correct'}
            />
          );
        })}
      </div>
    </div>
  );
}
