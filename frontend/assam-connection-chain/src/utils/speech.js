// src/utils/speech.js
//
// Thin wrapper around the browser's built-in Text-to-Speech
// (window.speechSynthesis). No external API, no network request —
// works fully offline once the page is loaded, and simply does nothing
// if the browser doesn't support it.

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Speak a short phrase aloud. Cancels any speech already in progress so
 * lines never overlap or queue up awkwardly.
 * @param {string} text
 * @param {{ rate?: number, pitch?: number }} [opts]
 */
export function speak(text, opts = {}) {
  if (!isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.rate = opts.rate ?? 0.95;
  utterance.pitch = opts.pitch ?? 1;
  utterance.lang = 'en-IN';
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
