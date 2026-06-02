import { useState } from 'react';
import T from '../theme';
import { Spinner, StatBox } from './Shared';
import ClauseCard from './ClauseCard';

export default function ResultsPanel({ results, analyzing, urduMode }) {

  const [tab, setTab] = useState('clauses');

  const counts = results ? {
    safe:    results.clauses.filter(c => c.risk_level === 'safe').length,
    caution: results.clauses.filter(c => c.risk_level === 'caution').length,
    danger:  results.clauses.filter(c => c.risk_level === 'danger').length,
  } : null;

  /* ── Loading ── */
  if (analyzing) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className="pulse" style={{ fontSize: 52 }}>⚖</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: T.gold }}>Analysing document…</div>
      <div style={{ fontSize: 13, color: T.muted }}>Detecting clauses · Assessing risks · Simplifying language</div>
      <Spinner size={28} />
    </div>
  );

  /* ── Empty state ── */
  if (!results) return (
    <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
      <div style={{ width: 100, height: 100, background: T.surface, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, marginBottom: 24, border: `2px solid ${T.gold}40` }}>⚖</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: T.gold, marginBottom: 12 }}>Your Legal Translator</div>
      <div style={{ color: T.muted, fontSize: 14, maxWidth: 400, lineHeight: 1.8, marginBottom: 28 }}>
        Paste any legal document — rental agreement, employment contract, court notice, NDA —
        and get an instant plain-English breakdown with AI risk assessment.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 460 }}>
        {['📋 Clause Breakdown','🔴 Risk Detection','👥 Party Obligations','⚠ Penalty Alerts','💬 AI Chat','🇵🇰 Urdu Translation'].map(f => (
          <div key={f} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: '6px 14px', fontSize: 12 }}>{f}</div>
        ))}
      </div>
    </div>
  );

  const { document_info: info, clauses } = results;

  /* ── Results ── */
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Summary card */}
      <div className="fade-up" style={{
        background: `linear-gradient(135deg,${T.surface} 0%,${T.card} 100%)`,
        border: `1px solid ${T.gold}55`, borderRadius: 16, padding: 24,
        borderLeft: `4px solid ${T.gold}`,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: T.gold, marginBottom: 8 }}>
          {info.document_type}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, lineHeight: 1.7, color: T.text, marginBottom: 16 }}>
          {info.summary}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {info.parties?.map((p, i) => (
            <Chip key={i} label={p.role} value={p.name} />
          ))}
          {info.key_dates?.slice(0, 3).map((d, i) => (
            <Chip key={i} label={d.label} value={d.date} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up" style={{ display: 'flex', gap: 12 }}>
        <StatBox num={counts.safe}    label="Safe Clauses" color={T.safe} />
        <StatBox num={counts.caution} label="Caution"      color={T.caution} />
        <StatBox num={counts.danger}  label="Danger"       color={T.danger} />
        <StatBox num={clauses.length} label="Total"        color={T.gold} />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: T.surface, padding: 4, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {[['clauses','📋 Clauses'],['obligations','👥 Obligations'],['penalties','⚠ Penalties']].map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              flex: 1, background: tab === id ? T.gold : 'transparent',
              color: tab === id ? T.bg : T.muted,
              border: 'none', borderRadius: 8, padding: '8px 10px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Outfit',sans-serif", transition: 'all .2s',
            }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Clauses tab */}
      {tab === 'clauses' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {clauses.map(c => <ClauseCard key={c.id} clause={c} urduMode={urduMode} />)}
        </div>
      )}

      {/* Obligations tab */}
      {tab === 'obligations' && (
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {info.key_obligations && Object.entries(info.key_obligations).map(([party, items], i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.gold, marginBottom: 14 }}>
                {i === 0 ? '🏠' : '👤'} {party.replace(/_/g,' ')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(items || []).map((item, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.6 }}>
                    <span style={{ color: T.gold, flexShrink: 0 }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Penalties tab */}
      {tab === 'penalties' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {info.penalties?.length > 0 ? info.penalties.map((p, i) => (
            <div key={i} style={{
              background: T.dangerBg, border: `1px solid ${T.danger}30`,
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', gap: 12, fontSize: 13, lineHeight: 1.6,
            }}>
              <span style={{ color: T.danger, flexShrink: 0 }}>⚠</span>
              {p}
            </div>
          )) : (
            <div style={{ textAlign: 'center', color: T.muted, padding: 48, fontSize: 13 }}>
              No specific penalties identified.
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 11, color: T.muted, padding: '6px 0 16px' }}>
        ⚠ For informational purposes only. Consult a qualified lawyer for actual legal advice.
      </div>
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div style={{ background: '#0b0f1a', borderRadius: 8, padding: '8px 12px', border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}
