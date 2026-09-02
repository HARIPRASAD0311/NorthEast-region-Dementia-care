import SafeImage from './SafeImage.jsx';
import { buildImageUrl } from '../utils/imageUtils.js';

export default function NodeCard({ node, isCurrent = false, size = 'md' }) {
  if (!node) return null;
  return (
    <div className={`node-card node-card--${size} ${isCurrent ? 'is-current' : ''}`}>
      {isCurrent && <span className="node-card__badge">CURRENT</span>}
      <SafeImage src={buildImageUrl(node.commonsTitle)} alt={node.alt} className="node-card__image" />
      <p className="node-card__label">{node.label}</p>
    </div>
  );
}
