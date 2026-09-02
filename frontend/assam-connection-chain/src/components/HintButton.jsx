import { useState } from 'react';

export default function HintButton({ hintText }) {
  const [open, setOpen] = useState(false);

  if (!hintText) return null;

  return (
    <div className="hint-wrap">
      <button
        type="button"
        className="hint-button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span aria-hidden="true">💡</span> Hint
      </button>
      {open && <p className="hint-text">{hintText}</p>}
    </div>
  );
}
