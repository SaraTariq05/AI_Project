import React, { useState } from 'react';
import './ClauseCard.css';

const RISK_META = {
  safe:    { label: 'Safe',    emoji: '✓', class: 'badge-safe' },
  caution: { label: 'Caution', emoji: '⚠', class: 'badge-caution' },
  danger:  { label: 'Danger',  emoji: '✕', class: 'badge-danger' },
};

export default function ClauseCard({ clause, urdu }) {
  const [expanded, setExpanded] = useState(false);
  const meta = RISK_META[clause.risk_level] || RISK_META.caution;

  return (
    <div className={`clause-card card-${clause.risk_level}`}>
      <div className="clause-header" onClick={() => setExpanded(!expanded)}>
        <div className="clause-title-row">
          <span className="clause-num">#{clause.id}</span>
          <h3 className="clause-title">{clause.title}</h3>
        </div>
        <div className="clause-header-right">
          <span className={`risk-badge ${meta.class}`}>
            {meta.emoji} {meta.label}
          </span>
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      <div className="clause-simplified">
        <p>{urdu ? clause.simplified_urdu : clause.simplified}</p>
      </div>

      {expanded && (
        <div className="clause-expanded">
          <div className="clause-original">
            <p className="section-label">Original Text</p>
            <p className="original-text">{clause.original_text}</p>
          </div>
          {clause.risk_reason && (
            <div className={`risk-reason reason-${clause.risk_level}`}>
              <strong>{meta.emoji} Why {meta.label}:</strong> {clause.risk_reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
