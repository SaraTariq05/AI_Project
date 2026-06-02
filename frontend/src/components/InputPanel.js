import { useRef } from 'react';
import T from '../theme';
import { Spinner } from './Shared';

const SAMPLE = `RESIDENTIAL TENANCY AGREEMENT

This Rental Agreement is entered into on January 1, 2025, between Ahmad Khan ("Landlord") and Sara Ali ("Tenant").

1. PREMISES: The Landlord agrees to rent the premises at House #5, Street 12, F-7/2, Islamabad to the Tenant for residential use only.

2. TERM: The tenancy commences February 1, 2025 and terminates January 31, 2026. The Tenant must vacate immediately without notice if they miss any payment.

3. RENT: Tenant agrees to pay PKR 45,000 per month, due on the 1st. A late fee of PKR 2,000 per day will be charged after the 5th of the month.

4. SECURITY DEPOSIT: Tenant shall pay PKR 90,000 on signing. The Landlord may deduct any amount from the deposit for any reason at the Landlord's sole discretion without providing receipts.

5. UTILITIES: Tenant is responsible for all utilities and maintenance of all appliances. The Landlord bears no responsibility for any infrastructure failures.

6. SUBLETTING: Tenant is strictly prohibited from subletting or allowing any other person to reside without prior written consent.

7. EARLY TERMINATION: If the Tenant vacates before end of term, the Tenant forfeits the entire security deposit and must pay 3 months rent as penalty.

8. ENTRY: The Landlord reserves the right to enter the premises at any time without prior notice for inspection or any other purpose.

9. PETS: No pets of any kind are permitted. Violation results in immediate eviction without deposit refund.

10. GOVERNING LAW: This agreement is governed by the laws of Pakistan.`;

export default function InputPanel({ docText, setDocText, onAnalyze, analyzing, error, results }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setDocText(ev.target.result);
    reader.readAsText(file);
  }

  return (
    <div style={{
      width: 300, background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700 }}>
          Document Input
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Paste or upload your legal document</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
          style={{
            border: `2px dashed ${T.border}`, borderRadius: 12,
            padding: '22px 14px', textAlign: 'center', cursor: 'pointer',
            background: T.card, transition: 'border-color .2s',
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 6 }}>📄</div>
          <div style={{ fontSize: 12, color: T.muted }}>Drop .txt file or</div>
          <div style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>click to browse</div>
        </div>
        <input type="file" ref={fileRef} accept=".txt,.text" onChange={handleFile} style={{ display: 'none' }} />

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 11, color: T.muted }}>or paste text</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        {/* Textarea */}
        <textarea
          value={docText}
          onChange={e => setDocText(e.target.value)}
          placeholder="Paste your rental agreement, employment contract, court notice, NDA…"
          style={{
            width: '100%', minHeight: 160,
            background: T.card, border: `1.5px solid ${T.border}`,
            borderRadius: 10, padding: '11px 13px',
            color: T.text, fontSize: 12.5,
            fontFamily: "'Outfit',sans-serif",
            resize: 'vertical', outline: 'none', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = T.gold}
          onBlur={e => e.target.style.borderColor = T.border}
        />

        {/* Sample button */}
        <button
          onClick={() => setDocText(SAMPLE)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: '9px 12px',
            color: T.muted, fontSize: 12, cursor: 'pointer',
            fontFamily: "'Outfit',sans-serif", textAlign: 'left', transition: 'all .2s',
          }}
        >
          📋 Load Sample: Rental Agreement (Pakistan)
        </button>

        {/* Error */}
        {error && (
          <div style={{
            background: T.dangerBg, border: `1px solid ${T.danger}40`,
            borderRadius: 8, padding: '10px 12px',
            fontSize: 12, color: T.danger, lineHeight: 1.6,
          }}>
            {error}
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={onAnalyze}
          disabled={analyzing || !docText.trim()}
          style={{
            background: analyzing || !docText.trim() ? T.border : T.gold,
            color: analyzing || !docText.trim() ? T.muted : T.bg,
            border: 'none', borderRadius: 10, padding: 13,
            fontSize: 14, fontWeight: 700, cursor: analyzing ? 'not-allowed' : 'pointer',
            fontFamily: "'Outfit',sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, transition: 'background .2s',
          }}
        >
          {analyzing ? <><Spinner size={16} color={T.muted} /> Analyzing…</> : '🔍 Analyze Document'}
        </button>

        {results && (
          <div style={{ fontSize: 11, color: T.muted, textAlign: 'center', lineHeight: 1.6 }}>
            ✓ Done · {results.clauses.length} clauses identified
          </div>
        )}
      </div>
    </div>
  );
}
