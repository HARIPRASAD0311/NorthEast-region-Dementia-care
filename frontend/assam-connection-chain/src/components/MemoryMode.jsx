import { useState } from 'react';
import NodeCard from './NodeCard.jsx';
import AnswerCard from './AnswerCard.jsx';
import VoiceButton from './VoiceButton.jsx';
import { MEMORY_PAIRS, getNode } from '../data/questions.js';

const STUDY_PROMPT = 'Look at these two pictures. They are connected. Try to remember them.';
const QUESTION_PROMPT_PREFIX = 'What was connected to';

export default function MemoryMode({ soundOn, onExit, onComplete }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState('study'); // 'study' | 'question'
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);

  const round = MEMORY_PAIRS[roundIndex];
  const promptNode = getNode(round.promptId);
  const correctNode = getNode(round.correctId);

  function beginQuestion() {
    setPicked(null);
    setPhase('question');
  }

  function handleSelect(choiceId) {
    if (picked) return;
    setPicked(choiceId);
    if (choiceId === round.correctId) setScore((s) => s + 1);
    setTimeout(() => {
      if (roundIndex + 1 < MEMORY_PAIRS.length) {
        setRoundIndex((i) => i + 1);
        setPhase('study');
        setPicked(null);
      } else {
        onComplete(score + (choiceId === round.correctId ? 1 : 0), MEMORY_PAIRS.length);
      }
    }, 900);
  }

  return (
    <div className="screen memory-screen">
      <div className="game-screen__top">
        <p className="progress-label">
          Remember &amp; Connect · Round {roundIndex + 1} of {MEMORY_PAIRS.length}
        </p>
        <button type="button" className="btn btn--ghost btn--small" onClick={onExit}>
          Exit
        </button>
      </div>

      {phase === 'study' ? (
        <div className="memory-screen__study">
          <div className="game-screen__prompt-row">
            <p className="game-screen__prompt">{STUDY_PROMPT}</p>
            <VoiceButton text={STUDY_PROMPT} soundOn={soundOn} />
          </div>
          <div className="memory-screen__pair">
            <NodeCard node={promptNode} size="md" />
            <span className="node-chain__arrow" aria-hidden="true">
              →
            </span>
            <NodeCard node={correctNode} size="md" />
          </div>
          <button type="button" className="btn btn--primary btn--large" onClick={beginQuestion}>
            I Remember — Hide It
          </button>
        </div>
      ) : (
        <div className="memory-screen__question">
          <NodeCard node={promptNode} isCurrent size="lg" />
          <div className="game-screen__prompt-row">
            <p className="game-screen__prompt">
              {QUESTION_PROMPT_PREFIX} {promptNode.label}?
            </p>
            <VoiceButton text={`${QUESTION_PROMPT_PREFIX} ${promptNode.label}?`} soundOn={soundOn} />
          </div>
          <div className={`answer-grid answer-grid--${round.choiceIds.length}`}>
            {round.choiceIds.map((id) => {
              const node = getNode(id);
              let revealState = null;
              if (picked) {
                if (id === round.correctId) revealState = 'correct';
                else if (id === picked) revealState = 'incorrect';
              }
              return (
                <AnswerCard
                  key={id}
                  node={node}
                  onSelect={handleSelect}
                  revealState={revealState}
                  disabled={!!picked}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
