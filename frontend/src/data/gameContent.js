// Centralized game content (question rounds) for the generic mini-games.
// Placeholder content — swap for a real content set (ideally
// clinician-reviewed) before this goes anywhere near real users.
//
// Keys match activity IDs in activities.js.
// Each activity has three difficulty tiers: easy, medium, hard.
// The adaptive engine (adaptiveEngine.js) maps numeric levels 1-5 to these tiers:
//   1-2  → easy
//   3    → medium
//   4-5  → hard

// ── Difficulty tier resolver ─────────────────────────────────────
// level: number 1-5 (from adaptiveEngine / storage)
export function levelToTier(level) {
  if (level <= 2) return "easy";
  if (level <= 3) return "medium";
  return "hard";
}

// ── Choice-game round banks ──────────────────────────────────────
// Each entry: { prompt, options: string[3], correct }
// Easy  — obvious distractors, very familiar vocabulary
// Medium — moderate distractors (original content)
// Hard  — close distractors, extra options considered

export const ROUND_BANKS_BY_DIFFICULTY = {
  "word-recall": {
    easy: [
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Apple", "Table", "Window"], correct: "Apple" },
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["River", "Mountain", "Cloud"], correct: "River" },
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Chair", "Sofa", "Desk"], correct: "Chair" },
    ],
    medium: [
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Apple", "Table", "Window"], correct: "Apple" },
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Lamp", "River", "Door"], correct: "River" },
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Chair", "Cup", "Book"], correct: "Chair" },
    ],
    hard: [
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Apricot", "Apple", "Mango"], correct: "Apple" },
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Stream", "River", "Lake"], correct: "River" },
      { prompt: "Which word did we ask you to remember: Apple, Chair, River?", options: ["Bench", "Stool", "Chair"], correct: "Chair" },
    ],
  },

  "picture-naming": {
    easy: [
      { prompt: "What is this household item used for boiling water?", options: ["Kettle", "Umbrella", "Bicycle"], correct: "Kettle" },
      { prompt: "What tells you the time on the wall?", options: ["Clock", "Basket", "Mirror"], correct: "Clock" },
      { prompt: "What do you wear on your feet?", options: ["Sandal", "Pillow", "Curtain"], correct: "Sandal" },
    ],
    medium: [
      { prompt: "What is this typically called?", options: ["Teapot", "Umbrella", "Bicycle"], correct: "Teapot" },
      { prompt: "What is this typically called?", options: ["Clock", "Basket", "Mirror"], correct: "Clock" },
      { prompt: "What is this typically called?", options: ["Sandal", "Lantern", "Comb"], correct: "Lantern" },
    ],
    hard: [
      { prompt: "What is this kitchen item called — used to pour hot liquids?", options: ["Teapot", "Kettle", "Jug"], correct: "Teapot" },
      { prompt: "What is this device called — it measures and displays time?", options: ["Sundial", "Chronometer", "Clock"], correct: "Clock" },
      { prompt: "What is this called — an oil-burning light source?", options: ["Torch", "Lantern", "Beacon"], correct: "Lantern" },
    ],
  },

  "daily-routine": {
    easy: [
      { prompt: "What do you do first in the morning — before eating breakfast?", options: ["Wake up", "Cook dinner", "Go for a walk"], correct: "Wake up" },
      { prompt: "When making tea, what do you do first?", options: ["Boil water", "Drink tea", "Buy groceries"], correct: "Boil water" },
      { prompt: "What comes last when getting dressed?", options: ["Put on shoes", "Take a shower", "Brush teeth"], correct: "Put on shoes" },
    ],
    medium: [
      { prompt: "What usually comes first when making tea?", options: ["Boil water", "Pour into cup", "Add tea leaves"], correct: "Boil water" },
      { prompt: "What comes after boiling water for tea?", options: ["Add tea leaves", "Wash the cup", "Go outside"], correct: "Add tea leaves" },
      { prompt: "What is usually the last step when making tea?", options: ["Pour into cup", "Boil water", "Buy tea leaves"], correct: "Pour into cup" },
    ],
    hard: [
      { prompt: "You want to make a cup of tea. You have boiled the water. What is the very next step?", options: ["Add tea leaves", "Add sugar", "Pour into cup"], correct: "Add tea leaves" },
      { prompt: "After steeping the tea leaves, what should you do before drinking?", options: ["Remove the leaves or strainer", "Add more water", "Boil again"], correct: "Remove the leaves or strainer" },
      { prompt: "To ensure the tea is the right temperature, what is the best final check?", options: ["Taste a small sip carefully", "Add ice immediately", "Microwave it"], correct: "Taste a small sip carefully" },
    ],
  },

  "orientation-check": {
    easy: [
      { prompt: "Which of these is a time of day?", options: ["Morning", "Tuesday", "January"], correct: "Morning" },
      { prompt: "Which of these is a season?", options: ["Monsoon", "Kitchen", "Book"], correct: "Monsoon" },
      { prompt: "Where do you usually sleep at night?", options: ["Bedroom", "Market", "Bus stop"], correct: "Bedroom" },
    ],
    medium: [
      { prompt: "What time of day does breakfast usually happen?", options: ["Morning", "Midnight", "Late evening"], correct: "Morning" },
      { prompt: "Which of these is a season?", options: ["Monsoon", "Tuesday", "Kitchen"], correct: "Monsoon" },
      { prompt: "Where do you usually sleep?", options: ["Bedroom", "Market", "Bus stop"], correct: "Bedroom" },
    ],
    hard: [
      { prompt: "If it is 7 in the morning, which meal are you most likely about to have?", options: ["Breakfast", "Lunch", "Dinner"], correct: "Breakfast" },
      { prompt: "Monsoon follows which season in most of Northeast India?", options: ["Summer", "Winter", "Autumn"], correct: "Summer" },
      { prompt: "Which room in a home is specifically used for sleeping?", options: ["Bedroom", "Drawing room", "Kitchen"], correct: "Bedroom" },
    ],
  },
};

// Backwards-compatible flat export — used by Game.jsx for the current difficulty tier.
// Game.jsx calls getRoundsForActivity(activityId, level) instead of ROUND_BANKS directly.
export function getRoundsForActivity(activityId, level = 1) {
  const tiers = ROUND_BANKS_BY_DIFFICULTY[activityId];
  if (!tiers) {
    // Fall back to word-recall medium for unknown IDs.
    return ROUND_BANKS_BY_DIFFICULTY["word-recall"].medium;
  }
  const tier = levelToTier(level);
  return tiers[tier] || tiers.medium;
}

// Legacy flat export kept so nothing else in the codebase breaks.
export const ROUND_BANKS = {
  "word-recall":       ROUND_BANKS_BY_DIFFICULTY["word-recall"].medium,
  "picture-naming":    ROUND_BANKS_BY_DIFFICULTY["picture-naming"].medium,
  "daily-routine":     ROUND_BANKS_BY_DIFFICULTY["daily-routine"].medium,
  "orientation-check": ROUND_BANKS_BY_DIFFICULTY["orientation-check"].medium,
};

// ── Memory Match configuration per difficulty ────────────────────
// Easy:   4 pairs (8 cards)
// Medium: 6 pairs (12 cards) — original
// Hard:   8 pairs (16 cards)
export const MEMORY_MATCH_ICONS_ALL = ["🌸", "🍵", "🎋", "🪔", "🥁", "🌾", "🦚", "🌿"];

export function getMemoryMatchIcons(level = 1) {
  const tier = levelToTier(level);
  if (tier === "easy")   return MEMORY_MATCH_ICONS_ALL.slice(0, 4);
  if (tier === "hard")   return MEMORY_MATCH_ICONS_ALL.slice(0, 8);
  return MEMORY_MATCH_ICONS_ALL.slice(0, 6); // medium
}

// Legacy export — keeps existing imports working (medium = 6 icons, original set).
export const MEMORY_MATCH_ICONS = MEMORY_MATCH_ICONS_ALL.slice(0, 6);

// ── Pattern Sequence configuration per difficulty ────────────────
// Easy:   max 3 rounds
// Medium: max 5 rounds — original
// Hard:   max 7 rounds
export function getSequenceMaxRounds(level = 1) {
  const tier = levelToTier(level);
  if (tier === "easy") return 3;
  if (tier === "hard") return 7;
  return 5; // medium
}
