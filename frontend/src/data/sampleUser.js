// Placeholder data standing in for the authenticated user until the
// registration/sign-in pages (built separately) are wired to a real API.
export const sampleUser = {
  id: "u_001",
  fullName: "Rina Debbarma",
  state: "Tripura",
  preferredLanguage: "Bengali",
  interactionMethod: "Both",
  dateOfBirth: "1952-04-12",
  caregiver: {
    name: "Amit Debbarma",
    relationship: "Son",
    phone: "9800000000",
    progressSharing: true,
  },
  cognitiveProfile: {
    stage: "Early-stage difficulty",
    lastAssessed: "2026-08-20",
    domains: {
      memory: 68,
      attention: 74,
      language: 81,
      reasoning: 70,
      orientation: 77,
    },
  },
  streakDays: 6,
  reminders: [
    { id: "r1", type: "Medication", label: "Morning tablet", time: "8:00 AM", done: true },
    { id: "r2", type: "Hydration", label: "Drink a glass of water", time: "11:00 AM", done: false },
    { id: "r3", type: "Activity", label: "Complete today's cognitive activity", time: "5:00 PM", done: false },
    { id: "r4", type: "Appointment", label: "Dr. Sharma follow-up", time: "Fri, 4:30 PM", done: false },
  ],
};

// Rolling history of recent sessions — feeds the adaptive engine and the
// progress trend charts.
export const sessionHistory = [
  { date: "2026-08-23", activity: "Memory Match", accuracy: 62, avgResponseMs: 4200, mistakes: 5, hintsUsed: 3, level: 2 },
  { date: "2026-08-24", activity: "Word Recall", accuracy: 70, avgResponseMs: 3900, mistakes: 3, hintsUsed: 2, level: 2 },
  { date: "2026-08-25", activity: "Pattern Sequence", accuracy: 75, avgResponseMs: 3600, mistakes: 2, hintsUsed: 1, level: 2 },
  { date: "2026-08-26", activity: "Memory Match", accuracy: 78, avgResponseMs: 3300, mistakes: 2, hintsUsed: 1, level: 3 },
  { date: "2026-08-27", activity: "Word Recall", accuracy: 81, avgResponseMs: 3100, mistakes: 1, hintsUsed: 0, level: 3 },
  { date: "2026-08-28", activity: "Pattern Sequence", accuracy: 84, avgResponseMs: 2900, mistakes: 1, hintsUsed: 0, level: 3 },
];
