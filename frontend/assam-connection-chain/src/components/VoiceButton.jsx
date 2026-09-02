import { speak, isSpeechSupported } from '../utils/speech.js';

export default function VoiceButton({ text, label = 'Listen', soundOn = true }) {
  if (!isSpeechSupported()) return null;

  return (
    <button
      type="button"
      className="voice-button"
      onClick={() => soundOn && speak(text)}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}
