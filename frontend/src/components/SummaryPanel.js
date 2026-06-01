import React from 'react';
import './SummaryPanel.css';

export default function SummaryPanel({ analysis, urdu }) {
  const { summary, summary_urdu, parties, key_dates, key_obligations,
          red_flags, recommendations, clauses } = analysis;

  const dangerCount = (clauses || []).filter(c => c.risk_level === 'danger').length;
  const cautionCount = (clauses || []).filter(c => c.risk_level === 'caution').length;
  const safeCount = (clauses || []).filter(c => c.risk_level === 'safe').length;

  return (
    <div className="summary-panel">
      {/* Overview */}
      <div className="summary-section">
        <h2 className="section-heading">Document Overview</h2>
        <p className="summary-text">{urdu ? summary_urdu : summary}</p>
      </div>

      {/* Risk stats */}
      <div className="risk-stats">
        <div className="stat stat-danger">
          <span className="stat-num">{dangerCount}</span>
          <span className="stat-label">Dangerous Clauses</span>
        </div>
        <div className="stat stat-caution">
          <span className="stat-num">{cautionCount}</span>
          <span className="stat-label">Caution Clauses</span>
        </div>
        <div className="stat stat-safe">
          <span className="stat-num">{safeCount}</span>
          <span className="stat-label">Safe Clauses</span>
        </div>
      </div>

      <div className="summary-grid">
        {/* Parties */}
        {parties?.length > 0 && (
          <div className="summary-card">
            <h3 className="card-heading">👥 Parties Involved</h3>
            <ul className="list-items">
              {parties.map((p, i) => (
                <li key={i}>
                  <span className="item-label">{p.role}</span>
                  <span className="item-value">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Dates */}
        {key_dates?.length > 0 && (
          <div className="summary-card">
            <h3 className="card-heading">📅 Key Dates</h3>
            <ul className="list-items">
              {key_dates.map((d, i) => (
                <li key={i}>
                  <span className="item-label">{d.label}</span>
                  <span className="item-value">{d.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Party 1 Obligations */}
        {key_obligations?.party1 && (
          <div className="summary-card">
            <h3 className="card-heading">📌 {key_obligations.party1.name}'s Obligations</h3>
            <ul className="bullet-list">
              {(key_obligations.party1.obligations || []).map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Party 2 Obligations */}
        {key_obligations?.party2 && (
          <div className="summary-card">
            <h3 className="card-heading">📌 {key_obligations.party2.name}'s Obligations</h3>
            <ul className="bullet-list">
              {(key_obligations.party2.obligations || []).map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Red Flags */}
        {red_flags?.length > 0 && (
          <div className="summary-card card-danger-tint">
            <h3 className="card-heading">🚨 Red Flags</h3>
            <ul className="bullet-list danger-list">
              {red_flags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="summary-card card-accent-tint">
            <h3 className="card-heading">💡 Recommendations</h3>
            <ul className="bullet-list accent-list">
              {recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
