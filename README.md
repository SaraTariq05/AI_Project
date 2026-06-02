# ⚖ LegalLens — AI Legal Document Simplifier
**Your lawyer in plain English — and Urdu**
Powered by Groq (LLaMA 3 70B) · Flask · React

---

## Project Structure

```
legallens/
├── backend/
│   ├── app.py              ← Flask API (all AI logic)
│   ├── requirements.txt
│   └── .env                ← put your GROQ_API_KEY here
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── api.js
        ├── theme.js
        └── components/
            ├── Shared.js
            ├── InputPanel.js
            ├── ClauseCard.js
            ├── ResultsPanel.js
            └── ChatPanel.js
```

---

## ⚡ Quick Start

### 1. Get a Free Groq API Key
1. Visit https://console.groq.com
2. Sign up (no credit card needed)
3. API Keys → Create API Key
4. Copy the key (starts with `gsk_`)

### 2. Backend

```bash
cd legallens/backend

# Install Python dependencies
pip install -r requirements.txt

# Add your key to .env
echo "GROQ_API_KEY=gsk_your_key_here" > .env

# Start Flask
python app.py
```
Flask runs on **http://localhost:5000**

### 3. Frontend

```bash
cd legallens/frontend

# Install Node dependencies
npm install

# Start React dev server
npm start
```
React runs on **http://localhost:3000** and proxies API calls to Flask automatically.

---

## Features

| Feature | Description |
|---|---|
| 📄 Document Upload | Upload .txt or paste any legal text |
| 🤖 AI Analysis | Document type, parties, dates, obligations |
| 📋 Clause Breakdown | 6-12 key clauses with original + plain English |
| 🔴 Risk Detection | Safe / Caution / Danger per clause with reason |
| 👥 Obligations | Side-by-side what each party must do |
| ⚠ Penalties | All consequences highlighted |
| 💬 AI Chat | Ask anything about the document (multi-turn) |
| 🇵🇰 Urdu Toggle | On-demand Urdu translation per clause |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Check server is running |
| POST | /api/analyze | Full document analysis |
| POST | /api/translate | Translate text to Urdu |
| POST | /api/chat | Document Q&A chatbot |

---

## Notes
- Groq free tier: 6,000 tokens/min, 14,400 requests/day — enough for normal use
- Max document length: ~14,000 characters (trimmed automatically)
- ⚠ This tool is for educational/informational purposes. Always consult a qualified lawyer.
