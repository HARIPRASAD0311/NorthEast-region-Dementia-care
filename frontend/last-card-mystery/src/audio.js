/**
 * audio.js
 * ------------------------------------------------------------------
 * Optional, non-blocking sound feedback.
 *
 * This prototype generates short, gentle tones with the WebAudio API
 * so the game works fully offline with ZERO audio files required.
 *
 * TO USE REAL SOUND FILES INSTEAD:
 *   Drop .mp3/.wav files into assets/sounds/ (e.g. card-play.mp3,
 *   correct.mp3, incorrect.mp3, button.mp3, countdown.mp3) and swap
 *   the body of `play()` for an <audio> element / HTMLAudioElement
 *   per sound key. The public play(name) API below does not need to
 *   change, so no other file is affected.
 * ------------------------------------------------------------------
 */
import { state } from './gameState.js';

let ctx = null;
function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

const TONE_PRESETS = {
  button: { freq: 440, duration: 0.08, type: 'sine', gain: 0.06 },
  cardPlay: { freq: 330, duration: 0.12, type: 'sine', gain: 0.07 },
  countdown: { freq: 520, duration: 0.1, type: 'sine', gain: 0.06 },
  correct: { freq: [523, 659, 784], duration: 0.14, type: 'sine', gain: 0.08 },
  incorrect: { freq: [300, 200], duration: 0.18, type: 'sine', gain: 0.08 }
};

function beep({ freq, duration, type, gain }, delay = 0) {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gainNode.gain.value = gain;
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  const startAt = audioCtx.currentTime + delay;
  osc.start(startAt);
  gainNode.gain.setValueAtTime(gain, startAt);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.stop(startAt + duration + 0.02);
}

export function play(name) {
  if (!state.soundOn) return;
  const preset = TONE_PRESETS[name];
  if (!preset) return;

  try {
    if (Array.isArray(preset.freq)) {
      preset.freq.forEach((f, i) => beep({ ...preset, freq: f }, i * preset.duration * 0.8));
    } else {
      beep(preset);
    }
  } catch (err) {
    // Autoplay restrictions or unsupported browser — fail silently.
    console.warn('Audio unavailable:', err);
  }
}

export function toggleSound() {
  state.soundOn = !state.soundOn;
  return state.soundOn;
}
