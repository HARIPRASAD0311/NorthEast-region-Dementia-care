/**
 * analytics.js
 * ------------------------------------------------------------------
 * FUTURE ADAPTIVE ENGINE HOOK.
 *
 * For this prototype we do NOT talk to a backend. We simply:
 *   1. console.log the performance record (so it's visible in devtools)
 *   2. append it to localStorage under 'lcm_performance_log' so a
 *      developer can inspect session history across reloads.
 *
 * TO CONNECT A REAL BACKEND LATER:
 *   Replace the body of `logPerformance()` with something like:
 *
 *     await fetch('https://your-api.example.com/performance', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(record)
 *     });
 *
 *   No other file needs to change — every screen already calls
 *   this single function.
 * ------------------------------------------------------------------
 */

const STORAGE_KEY = 'lcm_performance_log';

/**
 * @param {{
 *   state: string,
 *   difficulty: string,
 *   score: number,
 *   correct: boolean,
 *   responseTime: number,
 *   memorizationTime: number,
 *   cardsUsed: number,
 *   mistakes: number
 * }} record
 */
export function logPerformance(record) {
  const withMeta = {
    ...record,
    timestamp: new Date().toISOString()
  };

  // 1. Visible log for developers / demo purposes.
  console.log('[Last Card Mystery] Performance record:', withMeta);

  // 2. Persist locally so history survives a page reload.
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push(withMeta);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Could not persist performance log to localStorage:', err);
  }

  return withMeta;
}

export function getPerformanceLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
