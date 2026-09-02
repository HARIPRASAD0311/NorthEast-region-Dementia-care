import NodeCard from './NodeCard.jsx';

export default function NodeChain({ nodes }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="node-chain" aria-label="Connections discovered so far">
      {nodes.map((node, i) => (
        <div className="node-chain__item" key={`${node.id}-${i}`}>
          <NodeCard node={node} size="sm" />
          {i < nodes.length - 1 && (
            <span className="node-chain__arrow" aria-hidden="true">
              ↓
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
