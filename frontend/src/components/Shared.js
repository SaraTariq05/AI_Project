import T from '../theme';

/* ── Spinner ── */
export function Spinner({ size = 18, color = T.gold }) {
  return (
    <div
      className="spin"
      style={{
        width: size, height: size, flexShrink: 0,
        borderRadius: '50%',
        border: `2.5px solid ${color}30`,
        borderTopColor: color,
      }}
    />
  );
}

/* ── Risk badge ── */
export function Badge({ level }) {
  const map = {
    safe:    { label: '✓ Safe',     color: T.safe,    bg: T.safeBg },
    caution: { label: '⚡ Caution', color: T.caution, bg: T.cautionBg },
    danger:  { label: '⚠ Danger',  color: T.danger,  bg: T.dangerBg },
  };
  const b = map[level] || map.caution;
  return (
    <span style={{
      background: b.bg, color: b.color,
      border: `1px solid ${b.color}40`,
      borderRadius: 20, padding: '3px 11px',
      fontSize: 11, fontWeight: 700,
      letterSpacing: 1, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {b.label}
    </span>
  );
}

/* ── Stat box ── */
export function StatBox({ num, label, color }) {
  return (
    <div style={{
      flex: 1, background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12, padding: '14px 10px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color }}>
        {num}
      </div>
      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ── Section label ── */
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 2,
      textTransform: 'uppercase', color: T.muted, marginBottom: 6,
    }}>
      {children}
    </div>
  );
}
