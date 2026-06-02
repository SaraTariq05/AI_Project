import { useState, useRef, useEffect } from 'react';
import T from '../theme';
import { Spinner } from './Shared';
import { chatWithDoc } from '../api';

const SUGGESTED = [
  "What are my rights as a tenant?",
  "Is the late fee clause fair?",
  "Can the landlord enter without notice?",
  "What happens if I break the lease early?",
];

export default function ChatPanel({ docText }) {
  const [msgs,    setMsgs]    = useState([]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const hasDoc = !!docText.trim();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  async function send(text) {
    const q = (text || input).trim();
    if (!q || loading || !hasDoc) return;
    setInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: q, time };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = msgs.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const res = await chatWithDoc(q, docText, history);
      setMsgs(prev => [...prev, {
        role: 'assistant', content: res.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (e) {
      setMsgs(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}`, time: '--:--' }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: T.surface }}>

      {/* header */}
      <div style={{ padding: '16px 18px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: T.gold }}>
          ⚖ Ask Your Document
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>AI-powered legal Q&amp;A</div>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: 10, color: T.muted, textAlign: 'center',
          }}>
            <div style={{ fontSize: 38 }}>💬</div>
            <p style={{ fontSize: 13, maxWidth: 180, lineHeight: 1.6 }}>
              {hasDoc ? 'Ask anything about your document' : 'Upload a document first'}
            </p>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
            <div style={{
              maxWidth: '86%', padding: '9px 13px',
              borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              fontSize: 13, lineHeight: 1.6,
              background: m.role === 'user' ? T.gold : T.card,
              color: m.role === 'user' ? T.bg : T.text,
              border: m.role === 'assistant' ? `1px solid ${T.border}` : 'none',
            }}>
              {m.content}
            </div>
            <div style={{ fontSize: 10, color: T.muted, padding: '0 4px' }}>{m.time}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Spinner size={14} />
            <span style={{ fontSize: 12, color: T.muted }}>Thinking…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* suggested questions */}
      {hasDoc && msgs.length === 0 && (
        <div style={{ padding: '0 14px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
            Try asking
          </div>
          {SUGGESTED.map((q, i) => (
            <button
              key={i} onClick={() => send(q)}
              style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: '7px 11px', fontSize: 12, color: T.text, cursor: 'pointer',
                textAlign: 'left', fontFamily: "'Outfit',sans-serif", transition: 'border-color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* input row */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!hasDoc || loading}
          placeholder={hasDoc ? 'Ask about this document…' : 'Upload a document first'}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
          style={{
            flex: 1, background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: '8px 11px', color: T.text,
            fontSize: 13, fontFamily: "'Outfit',sans-serif",
            resize: 'none', minHeight: 38, maxHeight: 90, outline: 'none',
          }}
        />
        <button
          onClick={() => send()}
          disabled={!hasDoc || loading || !input.trim()}
          style={{
            width: 38, height: 38, flexShrink: 0,
            background: input.trim() && hasDoc && !loading ? T.gold : T.border,
            color: T.bg, border: 'none', borderRadius: 8,
            cursor: 'pointer', fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'background .2s',
          }}
        >
          {loading ? <Spinner size={14} color={T.bg} /> : '→'}
        </button>
      </div>
    </div>
  );
}
