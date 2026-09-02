import SafeImage from './SafeImage.jsx';
import { buildImageUrl } from '../utils/imageUtils.js';

/**
 * `revealState` is one of:
 *   null          — not yet answered
 *   'correct'     — this is the correct answer and it was revealed
 *   'incorrect'   — this was picked and was wrong
 *   'dimmed'      — an answer was given (right or wrong) and this card
 *                   is neither the picked one nor the correct one
 */
export default function AnswerCard({ node, onSelect, revealState, disabled }) {
  if (!node) return null;

  const stateClass = revealState ? `is-${revealState}` : '';

  return (
    <button
      type="button"
      className={`answer-card ${stateClass}`}
      onClick={() => onSelect(node.id)}
      disabled={disabled}
      aria-pressed={revealState === 'incorrect' || revealState === 'correct'}
    >
      <SafeImage src={buildImageUrl(node.commonsTitle)} alt={node.alt} className="answer-card__image" />
      <span className="answer-card__label">{node.label}</span>
      {revealState === 'correct' && (
        <span className="answer-card__icon" aria-hidden="true">
          ✓
        </span>
      )}
      {revealState === 'incorrect' && (
        <span className="answer-card__icon" aria-hidden="true">
          ✕
        </span>
      )}
    </button>
  );
}
