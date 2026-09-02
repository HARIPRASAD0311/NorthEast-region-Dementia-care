/**
 * ai.js
 * ------------------------------------------------------------------
 * Simple, transparent RULE-BASED AI. No machine learning.
 *
 * Responsibilities:
 *   1. Deal itself a random hand from the active cultural deck.
 *   2. On its turn, choose one card from its own hand to play.
 *   3. (Flavor only, not scored) Offer a guess about the player's
 *      final remaining card, using basic elimination logic — mirrors
 *      exactly what we're asking the human to do, so the AI "feels"
 *      like a fair opponent rather than a black box.
 * ------------------------------------------------------------------
 */

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Deal `count` random cards (with repetition allowed across the two
 * hands, but no duplicates WITHIN a single hand) from the deck. */
export function dealHand(deckCards, count) {
  const shuffled = shuffle(deckCards);
  return shuffled.slice(0, count).map((c) => ({ ...c }));
}

/**
 * AI picks a card to play from its remaining hand.
 * Rule: play uniformly at random among remaining cards.
 * (Kept deliberately simple & understandable, per spec — no hidden
 * "smart" behavior that would make the AI feel unfair.)
 */
export function aiChooseCardToPlay(aiHand) {
  const idx = Math.floor(Math.random() * aiHand.length);
  return aiHand[idx];
}

/**
 * Flavor feature: AI "guesses" the player's last card using pure
 * elimination — the one card in the player's ORIGINAL hand that was
 * never played. This is always correct (the AI has perfect memory,
 * as a computer would) and is shown purely to add opponent presence;
 * it does not affect scoring.
 */
export function aiPredictPlayerLastCard(playerOriginalHand, playerPlayedIds) {
  return playerOriginalHand.find((c) => !playerPlayedIds.includes(c.id)) || null;
}
