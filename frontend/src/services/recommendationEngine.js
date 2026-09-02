import { ACTIVITIES } from "../data/activities.js";

// Recommends the next activity by finding the cognitive domain with the
// lowest score in the user's profile and suggesting an activity that
// targets it. Simple, explainable, and easy to demo — a reasonable
// starting point before a more sophisticated engine is warranted.
export function recommendNextActivity(cognitiveProfile, recentActivityIds = []) {
  const domains = cognitiveProfile?.domains || {};
  const weakestDomain = Object.entries(domains).sort((a, b) => a[1] - b[1])[0]?.[0];

  const candidates = ACTIVITIES.filter(
    (a) => a.domains.includes(weakestDomain) && !recentActivityIds.includes(a.id)
  );

  const pick = candidates[0] || ACTIVITIES.find((a) => a.domains.includes(weakestDomain)) || ACTIVITIES[0];

  return {
    activity: pick,
    reason: weakestDomain
      ? `Recommended to support your ${weakestDomain} score, currently your lowest area.`
      : "Recommended to keep a good mix of activities this week.",
  };
}
