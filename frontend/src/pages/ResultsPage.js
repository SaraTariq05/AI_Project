import React, { useState } from 'react';
import ClauseCard from '../components/ClauseCard';
import ChatPanel from '../components/ChatPanel';
import SummaryPanel from '../components/SummaryPanel';
import './ResultsPage.css';

const RISK_COLORS = { low: 'safe', medium: 'caution', high: 'danger' };
const RISK_LABELS = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

export default function ResultsPage({ analysis, onReset }) {
  const [urdu, setUrdu] = useState(false);
  const [activeTab, setActiveTab] = useState('clauses'); // 'clauses' | 'summary' | 'chat'

  const riskColor = RISK_COLORS[analysis.overall_risk] || 'caution';

  return (
    <div className="results-page">
      {/* Top navbar */}
      <header className="results-header">
        <div className="header-left">
          <button className="back-btn" onClick={onReset}>← New Document</button>
          <div className="doc-type-badge">{analysis.document_type}</div>
        </div>
        <div className="header-center">
          <span className="logo-text-sm">⚖ LegalClear</span>
        </div>
        <div className="header-right">
          <button
            className={`urdu-toggle ${urdu ? 'active' : ''}`}
            onClick={() => setUrdu(!urdu)}
          >
            {urdu ? '🇬🇧 English' : '🇵🇰 اردو'}
          </button>
          <div className={`overall-risk risk-${riskColor}`}>
            {RISK_LABELS[analysis.overall_risk]}
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="results-tabs">
        {[
          { id: 'clauses', label: `📋 Clauses (${analysis.clauses?.length || 0})` },
          { id: 'summary', label: '📊 Summary' },
          { id: 'chat', label: '💬 Ask Anything' },
        ].map(t => (
          <button
            key={t.id}
            className={`results-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="results-body">
        {activeTab === 'clauses' && (
          <div className="clauses-grid">
            {(analysis.clauses || []).map(clause => (
              <ClauseCard key={clause.id} clause={clause} urdu={urdu} />
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <SummaryPanel analysis={analysis} urdu={urdu} />
        )}

        {activeTab === 'chat' && (
          <ChatPanel documentText={analysis.original_text} />
        )}
      </div>
    </div>
  );
}
