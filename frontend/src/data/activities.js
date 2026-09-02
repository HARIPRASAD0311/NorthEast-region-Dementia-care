// Activity catalog. `render` type tells the Game page which engine to load.
// "last-card-mystery" type routes to the dedicated game wrapper.
export const CATEGORIES = [
  { id: "training", label: "Cognitive Training", description: "Targeted, repeated practice for a specific skill." },
  { id: "stimulation", label: "Cognitive Stimulation", description: "Broader engagement across memory, language and reasoning." },
  { id: "rehabilitation", label: "Cognitive Rehabilitation", description: "Supports everyday functional abilities." },
];

export const ACTIVITIES = [
  {
    id: "assam-connection-chain",
    title: "Assam Connection Chain",
    category: "stimulation",
    icon: "Link2",
    description: "Connect real photographs of Assamese culture, wildlife, and nature in a gentle visual-association chain — no timers, no penalties.",
    domains: ["memory", "attention", "reasoning"],
    type: "assam-connection-chain",
    baseLevel: 1,
    badge: "Cultural",
  },
  {
    id: "last-card-mystery",
    title: "Last Card Mystery",
    category: "stimulation",
    icon: "Layers",
    description: "A cultural memory challenge. Study your opponent's cards, track what's played, and identify the final hidden card.",
    domains: ["memory", "attention", "reasoning"],
    type: "last-card-mystery",
    baseLevel: 1,
    badge: "Cultural",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    category: "stimulation",
    icon: "Grid3x3",
    description: "Find matching pairs of familiar objects to build short-term recall.",
    domains: ["memory"],
    type: "match",
    baseLevel: 1,
  },
  {
    id: "word-recall",
    title: "Word Recall",
    category: "training",
    icon: "MessageCircle",
    description: "Listen to a short list of words and recall as many as you can.",
    domains: ["memory", "language"],
    type: "recall",
    baseLevel: 1,
  },
  {
    id: "pattern-sequence",
    title: "Pattern Sequence",
    category: "training",
    icon: "Waypoints",
    description: "Repeat a growing sequence of shapes in the correct order.",
    domains: ["attention", "reasoning"],
    type: "sequence",
    baseLevel: 1,
  },
  {
    id: "daily-routine",
    title: "Daily Routine Steps",
    category: "rehabilitation",
    icon: "ListChecks",
    description: "Put everyday routine steps (like making tea) back in order.",
    domains: ["reasoning", "orientation"],
    type: "order",
    baseLevel: 1,
  },
  {
    id: "picture-naming",
    title: "Picture Naming",
    category: "stimulation",
    icon: "Image",
    description: "Name familiar objects and places shown on screen.",
    domains: ["language"],
    type: "naming",
    baseLevel: 1,
  },
  {
    id: "orientation-check",
    title: "Today & Me",
    category: "rehabilitation",
    icon: "CalendarCheck",
    description: "Gentle questions about the day, place and familiar people.",
    domains: ["orientation"],
    type: "orientation",
    baseLevel: 1,
  },
];

export function getActivity(id) {
  return ACTIVITIES.find((a) => a.id === id);
}
