import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import InstructionsScreen from './components/InstructionsScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import MemoryMode from './components/MemoryMode.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { TOTAL_LEVELS } from './data/questions.js';

const VIEWS = {
  WELCOME: 'welcome',
  INSTRUCTIONS: 'instructions',
  CHAIN: 'chain',
  MEMORY: 'memory',
  RESULT: 'result'
};

export default function App() {
  const [view, setView] = useState(VIEWS.WELCOME);
  const [pendingMode, setPendingMode] = useState('chain'); // which mode Instructions leads into
  const [soundOn, setSoundOn] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [result, setResult] = useState({ mode: 'chain', score: 0, totalPossible: TOTAL_LEVELS, roundsOrLevels: 0 });

  function goInstructions(mode) {
    setPendingMode(mode);
    setView(VIEWS.INSTRUCTIONS);
  }

  function startFromInstructions() {
    setView(pendingMode === 'memory' ? VIEWS.MEMORY : VIEWS.CHAIN);
  }

  function handleChainComplete(finalScore) {
    setResult({ mode: 'chain', score: finalScore, totalPossible: sumConnections(TOTAL_LEVELS), roundsOrLevels: TOTAL_LEVELS });
    setView(VIEWS.RESULT);
  }

  function handleMemoryComplete(finalScore, totalRounds) {
    setResult({ mode: 'memory', score: finalScore, totalPossible: totalRounds, roundsOrLevels: totalRounds });
    setView(VIEWS.RESULT);
  }

  return (
    <div className={`app ${reduceMotion ? 'reduce-motion' : ''}`}>
      <header className="app__topbar">
        <span className="app__title">🌿 Assam Connection Chain</span>
        <div className="app__settings">
          <button
            type="button"
            className="settings-toggle"
            onClick={() => setSoundOn((v) => !v)}
            aria-pressed={soundOn}
          >
            Sound: {soundOn ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            className="settings-toggle"
            onClick={() => setReduceMotion((v) => !v)}
            aria-pressed={reduceMotion}
          >
            Reduce Motion: {reduceMotion ? 'On' : 'Off'}
          </button>
        </div>
      </header>

      <main className="app__main">
        {view === VIEWS.WELCOME && (
          <WelcomeScreen onStartChain={() => goInstructions('chain')} onStartMemory={() => goInstructions('memory')} />
        )}

        {view === VIEWS.INSTRUCTIONS && (
          <InstructionsScreen onContinue={startFromInstructions} soundOn={soundOn} />
        )}

        {view === VIEWS.CHAIN && (
          <GameScreen
            soundOn={soundOn}
            reduceMotion={reduceMotion}
            onExit={() => setView(VIEWS.WELCOME)}
            onAllLevelsComplete={handleChainComplete}
          />
        )}

        {view === VIEWS.MEMORY && (
          <MemoryMode soundOn={soundOn} onExit={() => setView(VIEWS.WELCOME)} onComplete={handleMemoryComplete} />
        )}

        {view === VIEWS.RESULT && (
          <ResultScreen
            mode={result.mode}
            score={result.score}
            totalPossible={result.totalPossible}
            roundsOrLevels={result.roundsOrLevels}
            onPlayAgain={() => goInstructions(result.mode)}
            onMemoryMode={() => goInstructions('memory')}
            onBackHome={() => setView(VIEWS.WELCOME)}
          />
        )}
      </main>
    </div>
  );
}

// Total possible score across all 10 levels = total number of connections
// (1 + 2 + ... + 10 = 55), matching one star per correct connection.
function sumConnections(totalLevels) {
  return (totalLevels * (totalLevels + 1)) / 2;
}
