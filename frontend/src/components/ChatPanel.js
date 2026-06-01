import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../utils/api';
import './ChatPanel.css';

const SUGGESTED = [
  'What are my main obligations?',
  'Are there any unfair clauses?',
  'What happens if I break this contract?',
  'When does this agreement end?',
];

export default function ChatPanel({ documentText }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I've read your document. Ask me anything about it — clauses, obligations, risks, or specific terms." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (question) => {
    const q = (question || input).trim();
    if (!q || loading) return;

    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { answer } = await askQuestion(q, documentText, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠ Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg msg-${m.role}`}>
            <span className="msg-avatar">{m.role === 'assistant' ? '⚖' : '👤'}</span>
            <div className="msg-bubble">
              <p>{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg msg-assistant">
            <span className="msg-avatar">⚖</span>
            <div className="msg-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="suggestions">
          {SUGGESTED.map(s => (
            <button key={s} className="suggestion-btn" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={2}
          placeholder="Ask anything about this document…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={() => send()}
          disabled={!input.trim() || loading}
        >→</button>
      </div>
    </div>
  );
}
