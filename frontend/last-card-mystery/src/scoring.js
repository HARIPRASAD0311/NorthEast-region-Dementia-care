/**
 * scoring.js
 * ------------------------------------------------------------------
 * Deliberately simple scoring model.
 *
 *   score = 0                                  if answer is wrong
 *   score = basePoints(difficulty) + speedBonus if answer is correct
 *
 * Speed bonus: up to +50, linearly decreasing to 0 over 10 seconds.
 * ------------------------------------------------------------------
 */
import { getDifficulty } from './data/difficultySettings.js';

const MAX_SPEED_BONUS = 50;
const SPEED_BONUS_WINDOW_SECONDS = 10;

export function computeScore(difficultyKey, isCorrect, responseTimeSeconds) {
  if (!isCorrect) return 0;

  const base = getDifficulty(difficultyKey).basePoints;
  const clampedTime = Math.max(0, Math.min(responseTimeSeconds, SPEED_BONUS_WINDOW_SECONDS));
  const speedBonus = Math.round(
    MAX_SPEED_BONUS * (1 - clampedTime / SPEED_BONUS_WINDOW_SECONDS)
  );

  return base + speedBonus;
}

export function computeAccuracyPercent(isCorrect) {
  // Single-question mystery round -> binary accuracy for this prototype.
  return isCorrect ? 100 : 0;
}
