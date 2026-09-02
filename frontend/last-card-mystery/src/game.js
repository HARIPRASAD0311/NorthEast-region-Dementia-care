/**
 * game.js
 * ------------------------------------------------------------------
 * Screen controller. Plain DOM rendering (no framework) — chosen
 * deliberately over Phaser/React for this prototype because the
 * whole experience is large accessible buttons + photographs, not
 * canvas sprite animation. Every screen is a pure render() function;
 * state lives in gameState.js.
 * ------------------------------------------------------------------
 */
import { state, resetForNewRound, goTo } from './gameState.js';
import { culturalDecks, getDeckList, getDeck } from './data/culturalDecks.js';
import { DIFFICULTY_SETTINGS, getDifficulty } from './data/difficultySettings.js';
import { dealHand, aiChooseCardToPlay, aiPredictPlayerLastCard } from './ai.js';
import { computeScore, computeAccuracyPercent } from './scoring.js';
import { logPerformance } from './analytics.js';
import { play, toggleSound } from './audio.js';

const app = document.getElementById('app');

// Keep originals around for the whole round (hands get mutated as cards are played)
let aiOriginalHand = [];
let playerOriginalHand = [];
let playerPlayedIds = [];
let aiTurnLock = false;

export function start() {
  render();
}

function render() {
  switch (state.screen) {
    case 'home': return renderHome();
    case 'stateSelect': return renderStateSelect();
    case 'difficulty': return renderDifficulty();
    case 'memory': return renderMemoryPhase();
    case 'gameplay': return renderGameplay();
    case 'mystery': return renderMystery();
    case 'results': return renderResults();
    case 'howToPlay': return renderHowToPlay();
    default: return renderHome();
  }
}

/* ------------------------------------------------------------------ */
/* Shared chrome                                                      */
/* ------------------------------------------------------------------ */

function soundToggleHtml() {
  return `
    <button class="sound-toggle" id="soundToggle" aria-label="Toggle sound">
      ${state.soundOn ? '🔊 Sound ON' : '🔇 Sound OFF'}
    </button>`;
}

function bindSoundToggle() {
  document.getElementById('soundToggle')?.addEventListener('click', () => {
    toggleSound();
    play('button');
    render();
  });
}

/* ------------------------------------------------------------------ */
/* SCREEN 1 — HOME                                                    */
/* ------------------------------------------------------------------ */

function renderHome() {
  app.innerHTML = `
    <div class="screen home-screen">
      ${soundToggleHtml()}
      <div class="home-center">
        <div class="motif" aria-hidden="true">◆ ◇ ◆</div>
        <h1 class="app-title">LAST CARD MYSTERY</h1>
        <p class="app-subtitle">A Cultural Memory Challenge</p>
        <div class="home-buttons">
          <button class="btn btn-primary btn-xl" id="startBtn">START GAME</button>
          <button class="btn btn-secondary btn-lg" id="howToBtn">HOW TO PLAY</button>
        </div>
      </div>
    </div>
  `;
  bindSoundToggle();
  document.getElementById('startBtn').addEventListener('click', () => {
    play('button');
    goTo('stateSelect');
    render();
  });
  document.getElementById('howToBtn').addEventListener('click', () => {
    play('button');
    goTo('howToPlay');
    render();
  });
}

function renderHowToPlay() {
  app.innerHTML = `
    <div class="screen simple-screen">
      ${soundToggleHtml()}
      <h1 class="screen-title">How To Play</h1>
      <ol class="howto-list">
        <li><strong>OBSERVE</strong> — Watch the Computer's cards carefully during the memory phase.</li>
        <li><strong>REMEMBER</strong> — The cards are then turned face down.</li>
        <li><strong>TRACK</strong> — As cards are played, remember which ones leave the Computer's hand.</li>
        <li><strong>ELIMINATE</strong> — Use what remains to narrow down the possibilities.</li>
        <li><strong>GUESS</strong> — When only one card remains, tell us what it is!</li>
      </ol>
      <button class="btn btn-primary btn-lg" id="backHomeBtn">BACK TO HOME</button>
    </div>
  `;
  bindSoundToggle();
  document.getElementById('backHomeBtn').addEventListener('click', () => {
    play('button');
    goTo('home');
    render();
  });
}

/* ------------------------------------------------------------------ */
/* SCREEN 2 — STATE SELECTION                                         */
/* ------------------------------------------------------------------ */

function renderStateSelect() {
  const decks = getDeckList();
  app.innerHTML = `
    <div class="screen simple-screen">
      ${soundToggleHtml()}
      <h1 class="screen-title">Choose Your Cultural Deck</h1>
      <div class="state-grid">
        ${decks.map((d) => `
          <button class="state-card ${d.available ? '' : 'disabled'}" data-state="${d.key}" ${d.available ? '' : 'disabled'}>
            <span class="state-name">${d.name}</span>
            <span class="state-tag">${d.available ? d.tagline : 'Coming Soon'}</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-lg back-btn" id="backBtn">BACK</button>
    </div>
  `;
  bindSoundToggle();
  document.querySelectorAll('.state-card:not(.disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      play('button');
      state.stateKey = btn.dataset.state;
      goTo('difficulty');
      render();
    });
  });
  document.getElementById('backBtn').addEventListener('click', () => {
    play('button');
    goTo('home');
    render();
  });
}

/* ------------------------------------------------------------------ */
/* SCREEN 3 — DIFFICULTY                                              */
/* ------------------------------------------------------------------ */

function renderDifficulty() {
  const opts = Object.values(DIFFICULTY_SETTINGS);
  app.innerHTML = `
    <div class="screen simple-screen">
      ${soundToggleHtml()}
      <h1 class="screen-title">Choose Difficulty</h1>
      <div class="difficulty-grid">
        ${opts.map((o) => `
          <button class="difficulty-card diff-${o.key}" data-diff="${o.key}">
            <span class="difficulty-label">${o.label}</span>
            <span class="difficulty-desc">${o.description}</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-lg back-btn" id="backBtn">BACK</button>
    </div>
  `;
  bindSoundToggle();
  document.querySelectorAll('.difficulty-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      play('button');
      state.difficultyKey = btn.dataset.diff;
      beginRound();
    });
  });
  document.getElementById('backBtn').addEventListener('click', () => {
    play('button');
    goTo('stateSelect');
    render();
  });
}

/* ------------------------------------------------------------------ */
/* ROUND SETUP                                                        */
/* ------------------------------------------------------------------ */

function beginRound() {
  resetForNewRound();
  const deck = getDeck(state.stateKey);
  const diff = getDifficulty(state.difficultyKey);

  aiOriginalHand = dealHand(deck.cards, diff.cardCount);
  playerOriginalHand = dealHand(deck.cards, diff.cardCount);
  playerPlayedIds = [];

  state.aiHand = [...aiOriginalHand];
  state.playerHand = [...playerOriginalHand];

  goTo('memory');
  render();
}

/* ------------------------------------------------------------------ */
/* SCREEN 4 — MEMORY PHASE                                            */
/* ------------------------------------------------------------------ */

function renderMemoryPhase() {
  const diff = getDifficulty(state.difficultyKey);
  let secondsLeft = diff.memorizeSeconds;

  app.innerHTML = `
    <div class="screen memory-screen">
      ${soundToggleHtml()}
      <h1 class="screen-title">REMEMBER THESE CARDS</h1>
      <p class="memory-subtitle">These are your opponent's cards. Study them closely.</p>
      <div class="memory-card-row" id="memoryRow">
        ${state.aiHand.map((c) => cardFaceHtml(c)).join('')}
      </div>
      <div class="countdown-wrap">
        <div class="countdown-circle" id="countdown">${secondsLeft}</div>
      </div>
    </div>
  `;
  bindSoundToggle();

  const countdownEl = document.getElementById('countdown');
  const timer = setInterval(() => {
    secondsLeft -= 1;
    play('countdown');
    if (secondsLeft <= 0) {
      clearInterval(timer);
      goTo('gameplay');
      render();
      return;
    }
    countdownEl.textContent = secondsLeft;
  }, 1000);
}

/* ------------------------------------------------------------------ */
/* SCREEN 5 — GAMEPLAY                                                */
/* ------------------------------------------------------------------ */

function renderGameplay() {
  const lastPlay = state.playArea[state.playArea.length - 1];

  app.innerHTML = `
    <div class="screen gameplay-screen">
      ${soundToggleHtml()}

      <section class="hand-zone computer-zone">
        <h2 class="zone-label">COMPUTER <span class="zone-count">(${state.aiHand.length} card${state.aiHand.length === 1 ? '' : 's'})</span></h2>
        <div class="hand-row" id="aiHandRow">
          ${state.aiHand.map(() => cardBackHtml()).join('')}
        </div>
        <p class="ai-status" id="aiStatus">&nbsp;</p>
      </section>

      <section class="play-area-zone">
        <h2 class="zone-label subtle">PLAY AREA</h2>
        <div class="play-area" id="playArea">
          ${lastPlay ? cardFaceHtml(lastPlay.card, lastPlay.by) : '<div class="play-area-empty">Cards played will appear here</div>'}
        </div>
      </section>

      <section class="hand-zone player-zone">
        <h2 class="zone-label">YOU <span class="zone-count">(${state.playerHand.length} card${state.playerHand.length === 1 ? '' : 's'})</span></h2>
        <div class="hand-row" id="playerHandRow">
          ${state.playerHand.map((c) => cardFaceHtml(c, null, true)).join('')}
        </div>
        <p class="gameplay-hint">Tap a card to play it</p>
      </section>
    </div>
  `;
  bindSoundToggle();

  document.querySelectorAll('#playerHandRow .card.selectable').forEach((cardEl) => {
    cardEl.addEventListener('click', () => onPlayerPlaysCard(cardEl.dataset.cardId));
  });
}

function onPlayerPlaysCard(cardId) {
  if (aiTurnLock) return;
  aiTurnLock = true;
  play('cardPlay');

  const cardIdx = state.playerHand.findIndex((c) => c.id === cardId);
  if (cardIdx === -1) { aiTurnLock = false; return; }
  const [playedCard] = state.playerHand.splice(cardIdx, 1);
  playerPlayedIds.push(playedCard.id);
  state.playArea.push({ by: 'player', card: playedCard });
  state.turnCount += 1;

  render();
  const statusEl = document.getElementById('aiStatus');
  if (statusEl) statusEl.textContent = 'Computer is thinking...';

  // Slight delay so the player can consciously register the AI's move (elder-friendly pacing)
  setTimeout(() => {
    const aiCard = aiChooseCardToPlay(state.aiHand);
    const idx = state.aiHand.findIndex((c) => c.id === aiCard.id);
    state.aiHand.splice(idx, 1);
    state.aiHandRevealedIds.add(aiCard.id);
    state.playArea.push({ by: 'computer', card: aiCard });
    play('cardPlay');

    render();
    aiTurnLock = false;

    // Briefly show the revealed AI card, then re-hide the play area status,
    // and check for end-of-round conditions.
    setTimeout(() => {
      if (state.aiHand.length === 1 && state.playerHand.length === 1) {
        goTo('mystery');
        render();
      } else if (state.aiHand.length === 0 || state.playerHand.length === 0) {
        // Safety fallback if hand sizes ever diverge — go straight to results.
        finishWithoutMystery();
      }
    }, 1400);
  }, 900);
}

function finishWithoutMystery() {
  state.isCorrect = false;
  state.responseTimeSeconds = 0;
  state.score = 0;
  goTo('results');
  render();
}

/* ------------------------------------------------------------------ */
/* SCREEN 6 — FINAL MYSTERY ROUND                                     */
/* ------------------------------------------------------------------ */

function renderMystery() {
  const remainingAiCard = state.aiHand[0];
  state.correctCardId = remainingAiCard.id;
  state.mysteryStartTime = Date.now();

  // Choices = the AI's ORIGINAL hand (the player must recall + eliminate from these)
  const choices = shuffleForDisplay(aiOriginalHand);

  app.innerHTML = `
    <div class="screen mystery-screen">
      ${soundToggleHtml()}
      <h1 class="screen-title mystery-title">WHAT CARD IS STILL IN<br/>THE COMPUTER'S HAND?</h1>
      <p class="mystery-sub">Only one card remains. Use what you remember and what you saw played.</p>
      <div class="mystery-grid">
        ${choices.map((c) => `
          <button class="mystery-choice" data-choice="${c.id}">
            <img src="${c.image}" alt="${c.name}" class="mystery-img" />
            <span class="mystery-name">${c.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  bindSoundToggle();

  document.querySelectorAll('.mystery-choice').forEach((btn) => {
    btn.addEventListener('click', () => onMysteryAnswer(btn.dataset.choice));
  });
}

function shuffleForDisplay(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function onMysteryAnswer(chosenId) {
  const responseTimeSeconds = (Date.now() - state.mysteryStartTime) / 1000;
  const isCorrect = chosenId === state.correctCardId;

  state.answeredCardId = chosenId;
  state.isCorrect = isCorrect;
  state.responseTimeSeconds = responseTimeSeconds;
  state.score = computeScore(state.difficultyKey, isCorrect, responseTimeSeconds);

  play(isCorrect ? 'correct' : 'incorrect');

  const finalCard = aiOriginalHand.find((c) => c.id === state.correctCardId);
  const aiGuessAboutPlayer = aiPredictPlayerLastCard(playerOriginalHand, playerPlayedIds);

  app.innerHTML = `
    <div class="screen mystery-result-screen">
      ${soundToggleHtml()}
      <h1 class="feedback-banner ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
        ${isCorrect ? 'CORRECT!' : 'NOT QUITE'}
      </h1>
      <div class="final-card-reveal">
        <img src="${finalCard.image}" alt="${finalCard.name}" class="final-card-img" />
        <p class="final-card-label">The final card was: <strong>${finalCard.name.toUpperCase()}</strong></p>
      </div>
      ${aiGuessAboutPlayer ? `<p class="ai-flavor-text">Computer guessed your last card was: <strong>${aiGuessAboutPlayer.name}</strong></p>` : ''}
      <button class="btn btn-primary btn-lg" id="continueBtn">CONTINUE</button>
    </div>
  `;
  bindSoundToggle();

  document.getElementById('continueBtn').addEventListener('click', () => {
    play('button');
    logPerformance({
      state: state.stateKey,
      difficulty: state.difficultyKey,
      score: state.score,
      correct: state.isCorrect,
      responseTime: Number(state.responseTimeSeconds.toFixed(2)),
      memorizationTime: getDifficulty(state.difficultyKey).memorizeSeconds,
      cardsUsed: getDifficulty(state.difficultyKey).cardCount,
      mistakes: state.mistakes
    });
    goTo('results');
    render();
  });
}

/* ------------------------------------------------------------------ */
/* SCREEN 7 — RESULTS                                                 */
/* ------------------------------------------------------------------ */

function renderResults() {
  const diff = getDifficulty(state.difficultyKey);
  const accuracy = computeAccuracyPercent(state.isCorrect);

  app.innerHTML = `
    <div class="screen results-screen">
      ${soundToggleHtml()}
      <h1 class="screen-title">WELL DONE!</h1>
      <div class="results-grid">
        <div class="result-card">
          <span class="result-label">MEMORY ACCURACY</span>
          <span class="result-value">${accuracy}%</span>
        </div>
        <div class="result-card">
          <span class="result-label">RESPONSE TIME</span>
          <span class="result-value">${state.responseTimeSeconds?.toFixed(1) ?? '0.0'}s</span>
        </div>
        <div class="result-card result-card-score">
          <span class="result-label">SCORE</span>
          <span class="result-value">${state.score}</span>
        </div>
        <div class="result-card">
          <span class="result-label">DIFFICULTY</span>
          <span class="result-value">${diff.label}</span>
        </div>
      </div>
      <div class="results-buttons">
        <button class="btn btn-primary btn-lg" id="playAgainBtn">PLAY AGAIN</button>
        <button class="btn btn-secondary btn-lg" id="changeDeckBtn">CHANGE DECK</button>
        <button class="btn btn-tertiary btn-lg" id="homeBtn">HOME</button>
      </div>
    </div>
  `;
  bindSoundToggle();

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    play('button');
    beginRound();
  });
  document.getElementById('changeDeckBtn').addEventListener('click', () => {
    play('button');
    goTo('stateSelect');
    render();
  });
  document.getElementById('homeBtn').addEventListener('click', () => {
    play('button');
    goTo('home');
    render();
  });
}

/* ------------------------------------------------------------------ */
/* Card rendering helpers                                             */
/* ------------------------------------------------------------------ */

function cardFaceHtml(card, byWhom = null, selectable = false) {
  return `
    <div class="card ${selectable ? 'selectable' : ''} ${byWhom ? `played-by-${byWhom}` : ''}" data-card-id="${card.id}">
      <img src="${card.image}" alt="${card.name}" class="card-img" />
      <span class="card-label">${card.name}</span>
    </div>
  `;
}

function cardBackHtml() {
  return `
    <div class="card card-back" aria-hidden="true">
      <div class="card-back-motif">◆</div>
    </div>
  `;
}
