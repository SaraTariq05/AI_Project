import { useState, useEffect } from 'react';
import T from '../theme';
import { Badge, Spinner, SectionLabel } from './Shared';
import { translateText } from '../api';

export default function ClauseCard({ clause, urduMode }) {
  const [open,        setOpen]        = useState(false);
  const [urdu,        setUrdu]        = useState(null);
  const [loadingUrdu, setLoadingUrdu] = useState(false);

  const riskColor = { safe: T.safe, caution: T.caution, danger: T.danger }[clause.risk_level] || T.caution;
  const riskBg    = { safe: T.safeBg, caution: T.cautionBg, danger: T.dangerBg }[clause.risk_level] || T.cautionBg;

  useEffect(() => {
    if (urduMode && open && !urdu && !loadingUrdu) fetchUrdu();
  }, [urduMode, open]);

  async function fetchUrdu() {
    setLoadingUrdu(true);
    try {
      const res = await translateText(clause.simplified);
      setUrdu(res.urdu || 'ترجمہ دستیاب نہیں');
    } catch { setUrdu('ترجمہ دستیاب نہیں'); }
    setLoadingUrdu(false);
  }

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${open ? riskColor + '70' : T.border}`,
      borderRadius: 12, overflow: 'hidden', transition: 'border-color .25s',
    }}>
      {/* ── Header row ── */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}
      >
        <div style={{ width: 3, height: 38, background: riskColor, borderRadius: 4, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
            #{clause.id} · {clause.category}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {clause.simplified}
          </div>
        </div>
        <Badge level={clause.risk_level} />
        <div style={{ color: T.muted, fontSize: 12, flexShrink: 0 }}>{open ? '▲' : '▼'}</div>
      </div>

      {/* ── Expanded body ── */}
      {open && (
        <div
          className="fade-up"
          style={{ borderTop: `1px solid ${T.border}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {/* Original */}
          <div>
            <SectionLabel>Original Legal Text</SectionLabel>
            <div style={{
              fontSize: 13, color: T.muted, fontStyle: 'italic', lineHeight: 1.7,
              background: T.surface, padding: '10px 14px', borderRadius: 8,
              borderLeft: `3px solid ${T.border}`,
            }}>
              {clause.original}
            </div>
          </div>

          {/* Plain English */}
          <div>
            <SectionLabel>Plain English</SectionLabel>
            <div style={{
              fontSize: 14, lineHeight: 1.7, background: riskBg,
              padding: '10px 14px', borderRadius: 8,
              borderLeft: `3px solid ${riskColor}`, color: T.text,
            }}>
              {clause.simplified}
            </div>
          </div>

          {/* Urdu */}
          {urduMode && (
            <div>
              <SectionLabel>اردو ترجمہ</SectionLabel>
              <div style={{
                background: riskBg, padding: '10px 14px', borderRadius: 8,
                borderLeft: `3px solid ${riskColor}`,
                display: 'flex', justifyContent: 'flex-end',
              }}>
                {loadingUrdu
                  ? <Spinner size={20} />
                  : <span className="urdu">{urdu || '…'}</span>}
              </div>
            </div>
          )}

          {/* Risk reason */}
          <div style={{
            display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12,
            color: T.muted, background: T.surface, padding: '8px 12px', borderRadius: 8,
          }}>
            <span style={{ color: riskColor }}>
              {clause.risk_level === 'safe' ? '✓' : clause.risk_level === 'caution' ? '⚡' : '⚠'}
            </span>
            {clause.risk_reason}
          </div>
        </div>
      )}
    </div>
  );
}
