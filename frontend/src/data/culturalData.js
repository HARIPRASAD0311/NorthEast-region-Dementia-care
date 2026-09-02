// Lightweight per-state personalization data. Deliberately abstract
// (accent colour + a short familiar greeting) rather than literal cultural
// symbols, to avoid misrepresenting any state's specific traditions.
export const CULTURAL_THEMES = {
  "Arunachal Pradesh": { accent: "#8a6d3b", greeting: "Welcome back" },
  Assam: { accent: "#b8862f", greeting: "Xagatam, welcome back" },
  Manipur: { accent: "#9a4a32", greeting: "Welcome back" },
  Meghalaya: { accent: "#2c6e49", greeting: "Khublei, welcome back" },
  Mizoram: { accent: "#3d6b4f", greeting: "Welcome back" },
  Nagaland: { accent: "#b8862f", greeting: "Welcome back" },
  Sikkim: { accent: "#4a6f8a", greeting: "Welcome back" },
  Tripura: { accent: "#9a4a32", greeting: "Welcome back" },
};

export function getTheme(state) {
  return CULTURAL_THEMES[state] || { accent: "#2c4a3e", greeting: "Welcome back" };
}
