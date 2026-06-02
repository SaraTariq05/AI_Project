import { useState } from 'react';
import T from './theme';
import InputPanel   from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import ChatPanel    from './components/ChatPanel';
import { analyzeDocument } from './api';

export default function App() {
  const [docText,   setDocText]   = useState('');
  const [results,   setResults]   = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error,     setError]     = useState('');
  const [urduMode,  setUrduMode]  = useState(false);

  async function handleAnalyze() {
    if (!docText.trim()) { setError('Please paste or upload a document first.'); return; }
    setError(''); setAnalyzing(true); setResults(null);
    try {
      const data = await analyzeDocument(docText);
      if (data.success) setResults(data);
      else setError(data.error || 'Analysis failed.');
    } catch (e) {
      setError(`Cannot reach the backend. Make sure Flask is running on port 5000. (${e.message})`);
    }
    setAnalyzing(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: T.bg }}>

      {/* ── Top bar ── */}
      <div style={{
        background: T.surface, borderBottom: `1px solid ${T.border}`,
        padding: '0 20px', height: 60, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: T.gold,
            borderRadius: 9, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
          }}>⚖</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: T.gold, lineHeight: 1 }}>
              LegalLens
            </div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>
              AI Legal Document Simplifier
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setUrduMode(u => !u)}
            style={{
              background: urduMode ? T.gold : 'transparent',
              color: urduMode ? T.bg : T.gold,
              border: `1.5px solid ${T.gold}`,
              borderRadius: 20, padding: '6px 16px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Outfit',sans-serif", transition: 'all .2s',
            }}
          >
            🇵🇰 {urduMode ? 'اردو ON' : 'اردو'}
          </button>
        </div>
      </div>

      {/* ── Three-column layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: input */}
        <InputPanel
          docText={docText}
          setDocText={setDocText}
          onAnalyze={handleAnalyze}
          analyzing={analyzing}
          error={error}
          results={results}
        />

        {/* Middle: results */}
        <ResultsPanel
          results={results}
          analyzing={analyzing}
          urduMode={urduMode}
        />

        {/* Right: chat */}
        <div style={{ width: 300, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <ChatPanel docText={docText} />
        </div>

      </div>
    </div>
  );
}
