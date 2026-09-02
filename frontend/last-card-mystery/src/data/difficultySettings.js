/**
 * difficultySettings.js
 * ------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for difficulty tuning.
 * Change numbers here to rebalance the whole game — nothing else
 * needs to be touched.
 * ------------------------------------------------------------------
 */
export const DIFFICULTY_SETTINGS = {
  easy: {
    key: 'easy',
    label: 'EASY',
    cardCount: 3,
    memorizeSeconds: 8,
    basePoints: 100,
    description: '3 cards · Longer memory time'
  },
  medium: {
    key: 'medium',
    label: 'MEDIUM',
    cardCount: 5,
    memorizeSeconds: 6,
    basePoints: 200,
    description: '5 cards · Moderate memory time'
  },
  hard: {
    key: 'hard',
    label: 'HARD',
    cardCount: 7,
    memorizeSeconds: 4,
    basePoints: 300,
    description: '7 cards · Short memory time'
  }
};

export function getDifficulty(key) {
  return DIFFICULTY_SETTINGS[key];
}
