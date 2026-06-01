import React, { useState, useRef } from 'react';
import { analyzeText, analyzeFile } from '../utils/api';
import './UploadPage.css';

const SAMPLE_TEXT = `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is entered into on 1st January 2024 between Ahmed Khan ("Landlord") residing at House 5, Street 3, F-7, Islamabad, and Sara Malik ("Tenant") residing at Flat 2B, Blue Area, Islamabad.

1. PROPERTY: Landlord agrees to rent Flat No. 4, Block C, Gulberg Residency, Lahore ("Property") to Tenant.

2. TERM: The tenancy shall commence on 1st February 2024 and continue for a period of twelve (12) months, ending on 31st January 2025, unless terminated earlier in accordance with this Agreement.

3. RENT: Tenant agrees to pay PKR 45,000 per month as rent, due on the 1st of each month. A late fee of PKR 2,000 shall be charged for payments received after the 5th of the month.

4. SECURITY DEPOSIT: Tenant shall pay a security deposit of PKR 90,000 (two months' rent) upon signing. This deposit shall be returned within 30 days of vacating, subject to deductions for damages beyond normal wear and tear.

5. UTILITIES: Tenant is responsible for all utility bills including electricity, gas, water, and internet. Landlord shall maintain the main structure and major appliances.

6. NO SUBLETTING: Tenant shall not sublet or assign the Property without prior written consent of the Landlord. Violation of this clause shall result in immediate termination.

7. TERMINATION: Either party may terminate this agreement with 60 days written notice. Landlord reserves the right to terminate immediately if rent is unpaid for more than 15 days.

8. GOVERNING LAW: This Agreement shall be governed by the laws of Pakistan.`;

export default function UploadPage({ onAnalysis }) {
  const [mode, setMode] = useState('paste'); // 'paste' | 'upload'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleSubmit = async () => {
    setError('');
    if (mode === 'paste' && text.trim().length < 50) {
      return setError('Please paste a legal document (minimum 50 characters).');
    }
    if (mode === 'upload' && !file) {
      return setError('Please select a file to upload.');
    }
    setLoading(true);
    try {
      const result = mode === 'paste'
        ? await analyzeText(text)
        : await analyzeFile(file);
      onAnalysis(result);
    } catch (e) {
      setError(e.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setMode('upload'); }
  };

  return (
    <div className="upload-page">
      <div className="upload-bg-grid" />

      <header className="upload-header">
        <div className="logo">
          <span className="logo-icon">⚖</span>
          <span className="logo-text">LegalClear</span>
        </div>
        <p className="logo-tagline">Your lawyer in plain English — and Urdu</p>
      </header>

      <main className="upload-main">
        <div className="hero-text">
          <h1>Understand any legal document<br /><em>in minutes</em></h1>
          <p>Paste or upload a rental agreement, employment contract, or court notice. We'll break it down clause by clause, flag risky terms, and answer your questions.</p>
        </div>

        <div className="upload-card">
          <div className="mode-tabs">
            <button
              className={`tab ${mode === 'paste' ? 'active' : ''}`}
              onClick={() => setMode('paste')}
            >✏ Paste Text</button>
            <button
              className={`tab ${mode === 'upload' ? 'active' : ''}`}
              onClick={() => setMode('upload')}
            >📎 Upload File</button>
          </div>

          {mode === 'paste' ? (
            <div className="paste-area">
              <textarea
                className="doc-textarea"
                placeholder="Paste your legal document here…"
                value={text}
                onChange={e => setText(e.target.value)}
                rows={12}
              />
              <div className="paste-actions">
                <span className="char-count">{text.length.toLocaleString()} chars</span>
                <button
                  className="btn-secondary"
                  onClick={() => setText(SAMPLE_TEXT)}
                >Load sample rental agreement</button>
              </div>
            </div>
          ) : (
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <span className="file-icon">📄</span>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                  <button className="btn-link" onClick={e => { e.stopPropagation(); setFile(null); }}>Remove</button>
                </>
              ) : (
                <>
                  <span className="drop-icon">⬆</span>
                  <p>Drop your file here or <strong>click to browse</strong></p>
                  <p className="drop-hint">Supports PDF, DOCX, TXT — up to 10 MB</p>
                </>
              )}
            </div>
          )}

          {error && <p className="error-msg">⚠ {error}</p>}

          <button
            className="btn-analyze"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Analyzing document…</>
            ) : (
              '→ Analyze Document'
            )}
          </button>
        </div>

        <div className="features">
          {[
            { icon: '🔍', title: 'Clause Breakdown', desc: 'Every clause simplified into plain language' },
            { icon: '🚨', title: 'Risk Detection', desc: 'Dangerous or one-sided terms flagged instantly' },
            { icon: '💬', title: 'Ask Anything', desc: 'Chat with the document — get instant answers' },
            { icon: '🇵🇰', title: 'Urdu Support', desc: 'Full Urdu translation with one toggle' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
