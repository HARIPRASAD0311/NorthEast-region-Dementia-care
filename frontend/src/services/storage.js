// Centralized storage access. In production, swap the bodies of these
// functions for real API calls (e.g. POST /api/sessions) without touching
// any page or component — they only ever import from here.
const KEYS = {
  sessions: "limbo_sessions",
  reminders: "limbo_reminders",
  assessment: "app_assessment",
};

export function loadSessions(fallback = []) {
  try {
    const raw = localStorage.getItem(KEYS.sessions);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveSession(session) {
  const current = loadSessions([]);
  const updated = [...current, session];
  try {
    localStorage.setItem(KEYS.sessions, JSON.stringify(updated));
  } catch {
    // storage unavailable (private browsing, quota) — fail silently, in-memory state still works this session
  }
  return updated;
}

export function loadReminders(fallback = []) {
  try {
    const raw = localStorage.getItem(KEYS.reminders);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveReminders(reminders) {
  try {
    localStorage.setItem(KEYS.reminders, JSON.stringify(reminders));
  } catch {
    // ignore
  }
}

// ── Assessment persistence ───────────────────────────────────────
// Saves the completed assessment result so the cognitive profile
// survives a page refresh. Shape: { answers: {}, completedAt: ISO, aiAnalysis: {} | null }
export function loadAssessment(fallback = null) {
  try {
    const raw = localStorage.getItem(KEYS.assessment);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveAssessment(answers, aiAnalysis = null) {
  try {
    const existing = loadAssessment({});
    localStorage.setItem(
      KEYS.assessment,
      JSON.stringify({
        ...existing,
        answers,
        completedAt: new Date().toISOString(),
        aiAnalysis,
      })
    );
  } catch {
    // ignore
  }
}

export function saveAssessmentAnalysis(aiAnalysis) {
  try {
    const existing = loadAssessment({});
    localStorage.setItem(
      KEYS.assessment,
      JSON.stringify({ ...existing, aiAnalysis })
    );
  } catch {
    // ignore
  }
}

// ── Per-activity difficulty persistence ─────────────────────────
// Stores { [activityId]: level } where level is 1–5 (matches adaptiveEngine).
// Falls back to defaultLevel (1) for any unknown activity.
const GAME_LEVELS_KEY = "app_game_levels";

export function loadGameLevel(activityId, defaultLevel = 1) {
  try {
    const raw = localStorage.getItem(GAME_LEVELS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const val = map[activityId];
    return typeof val === "number" ? val : defaultLevel;
  } catch {
    return defaultLevel;
  }
}

export function saveGameLevel(activityId, level) {
  try {
    const raw = localStorage.getItem(GAME_LEVELS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[activityId] = level;
    localStorage.setItem(GAME_LEVELS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}
