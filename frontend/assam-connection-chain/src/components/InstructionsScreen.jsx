import VoiceButton from './VoiceButton.jsx';

const INSTRUCTIONS_TEXT =
  'Look at the picture on the screen. Then choose the picture that is connected to it. ' +
  'Take your time — there is no timer. If you need help, tap the hint button.';

export default function InstructionsScreen({ onContinue, soundOn }) {
  return (
    <div className="screen instructions-screen">
      <h2>How to Play</h2>
      <div className="instructions-screen__row">
        <p>{INSTRUCTIONS_TEXT}</p>
        <VoiceButton text={INSTRUCTIONS_TEXT} label="Listen to instructions" soundOn={soundOn} />
      </div>
      <ul className="instructions-screen__list">
        <li>Look at the current picture.</li>
        <li>Choose the picture that connects to it.</li>
        <li>Watch your chain grow, one link at a time.</li>
        <li>Take your time — there's no clock and no wrong way to explore.</li>
      </ul>
      <button type="button" className="btn btn--primary btn--large" onClick={onContinue}>
        Let's Begin
      </button>
    </div>
  );
}
