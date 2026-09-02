// This is intentionally a rules engine, not a trained model, for the MVP.
// It is transparent and explainable — important for a health-adjacent
// product where you may need to justify a recommendation to a caregiver
// or clinician. Swap the internals for a learned model later without
// changing the function signature callers depend on.

const THRESHOLDS = {
  levelUpAccuracy: 80,
  levelUpMaxMistakes: 1,
  levelDownAccuracy: 50,
  levelDownMinMistakes: 4,
  slowResponseMs: 4500,
};

/**
 * Given the result of one completed session and the activity's current
 * level, returns the next level (1-5) plus a short human-readable reason.
 */
export function computeNextLevel(currentLevel, result) {
  const { accuracy, mistakes, avgResponseMs, hintsUsed } = result;
  const clamp = (n) => Math.max(1, Math.min(5, n));

  if (accuracy >= THRESHOLDS.levelUpAccuracy && mistakes <= THRESHOLDS.levelUpMaxMistakes && hintsUsed === 0) {
    return {
      nextLevel: clamp(currentLevel + 1),
      direction: "up",
      reason: `Accuracy of ${accuracy}% with minimal mistakes — increasing challenge.`,
    };
  }

  if (accuracy <= THRESHOLDS.levelDownAccuracy || mistakes >= THRESHOLDS.levelDownMinMistakes) {
    return {
      nextLevel: clamp(currentLevel - 1),
      direction: "down",
      reason: `Accuracy of ${accuracy}% with ${mistakes} mistakes — easing difficulty to rebuild confidence.`,
    };
  }

  if (avgResponseMs > THRESHOLDS.slowResponseMs) {
    return {
      nextLevel: currentLevel,
      direction: "hold",
      reason: "Response time was slower than usual — keeping the same level for now.",
    };
  }

  return {
    nextLevel: currentLevel,
    direction: "hold",
    reason: "Performance is steady — staying at the current level.",
  };
}

/**
 * Rolls a session history array up into a simple trend used by
 * Progress.jsx and CaregiverDashboard.jsx. Never returns alarming or
 * urgency-framed language — trend data is for caregivers/clinicians,
 * this function itself stays neutral so callers decide tone per audience.
 */
export function computeTrend(history) {
  if (!history || history.length < 2) return { direction: "flat", delta: 0 };
  const recent = history.slice(-3);
  const earlier = history.slice(-6, -3);
  const avg = (arr) => arr.reduce((s, r) => s + r.accuracy, 0) / (arr.length || 1);
  const recentAvg = avg(recent);
  const earlierAvg = earlier.length ? avg(earlier) : recentAvg;
  const delta = Math.round(recentAvg - earlierAvg);
  return {
    direction: delta > 3 ? "up" : delta < -3 ? "down" : "flat",
    delta,
    recentAvg: Math.round(recentAvg),
  };
}
