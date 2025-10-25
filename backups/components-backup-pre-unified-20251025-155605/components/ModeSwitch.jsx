import React from 'react';
const ModeSwitch = ({
  mode,
  setMode,
  modes = ['list', 'url'],
  labels = ['لیست', 'URL'],
  ariaLabel = 'Mode switch'
}) => (
  <div className="harmony-mode-switch" role="tablist" aria-label={ariaLabel}>
    {modes.map((modeValue, index) => {
      const isActive = mode === modeValue;
      return (
        <button
          key={modeValue}
          type="button"
          role="tab"
          aria-selected={isActive}
          className={`harmony-mode-btn ${isActive ? 'active' : ''}`}
          onClick={() => setMode && setMode(modeValue)}
        >
          {labels[index] || modeValue}
        </button>
      );
    })}
  </div>
);

export default ModeSwitch;
