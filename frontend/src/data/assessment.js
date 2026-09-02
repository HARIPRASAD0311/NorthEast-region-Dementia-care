// Centralized assessment data.
// Move these values to a backend/CMS later without touching Assessment.jsx.

// Cognitive domains evaluated during the assessment intro screen.
export const ASSESSMENT_DOMAINS = [
  "Memory",
  "Attention",
  "Recognition",
  "Reasoning",
  "Orientation",
];

// Short screening questions. Each option array should have 3 items.
// Replace with clinician-reviewed content before going to production.
export const ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    prompt: "What day of the week is it today?",
    options: ["Today's actual day", "A different day", "Not sure"],
  },
  {
    id: "q2",
    prompt: "Can you recall these three words in a moment: Apple, Chair, River?",
    options: ["I remember all three", "I remember one or two", "I don't recall them"],
  },
  {
    id: "q3",
    prompt: "Which of these is a fruit?",
    options: ["Apple", "Chair", "River"],
  },
  {
    id: "q4",
    prompt: "How was your sleep last night?",
    options: ["Restful", "Somewhat restful", "Not restful"],
  },
];
