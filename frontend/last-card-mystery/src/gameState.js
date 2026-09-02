/**
 * gameState.js
 * ------------------------------------------------------------------
 * Central, single mutable state object for the current session.
 * Every screen reads/writes through the helpers here so state is
 * never scattered across the codebase.
 * ------------------------------------------------------------------
 */

export const state = {
  screen: 'home',           // current screen id
  stateKey: null,           // selected cultural deck, e.g. 'assam'
  difficultyKey: null,      // 'easy' | 'medium' | 'hard'

  aiHand: [],                // array of card objects, in original order
  aiHandRevealedIds: new Set(), // ids the player has SEEN played (elimination memory aid)
  playerHand: [],

  playArea: [],              // { by: 'player'|'computer', card }[]
  soundOn: true,

  turnCount: 0,
  mistakes: 0,

  // final mystery round
  correctCardId: null,
  answeredCardId: null,
  isCorrect: null,
  mysteryStartTime: null,
  responseTimeSeconds: null,

  // scoring
  score: 0,

  // performance log entry (see analytics.js)
  sessionStart: null
};

export function resetForNewRound() {
  state.aiHand = [];
  state.aiHandRevealedIds = new Set();
  state.playerHand = [];
  state.playArea = [];
  state.turnCount = 0;
  state.mistakes = 0;
  state.correctCardId = null;
  state.answeredCardId = null;
  state.isCorrect = null;
  state.mysteryStartTime = null;
  state.responseTimeSeconds = null;
  state.score = 0;
  state.sessionStart = Date.now();
}

export function goTo(screen) {
  state.screen = screen;
}
