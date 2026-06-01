# ⚖ LegalClear — AI Legal Document Simplifier

> Your lawyer in plain English — and Urdu

A full-stack web application that analyzes legal documents, explains them in plain language, detects risky clauses, and answers questions about your document via a chat interface.

---

## Features

- **Document Input** — Paste text or upload PDF / DOCX / TXT files
- **Clause-by-Clause Breakdown** — Each clause simplified with risk badges (Safe / Caution / Danger)
- **Risk Detection** — Dangerous or one-sided terms flagged automatically
- **Key Info Extraction** — Parties, dates, obligations summarized
- **Document Chatbot** — Ask follow-up questions in natural language
- **Urdu Toggle** — Full Urdu translation of all simplified content
- **Side-by-Side View** — Original legal text vs plain English

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Python / Flask |
| AI | Google Gemini API (gemini-1.0) |
| PDF Parsing | PyPDF2 |
| DOCX Parsing | python-docx |

---

## Project Structure

```
legal-simplifier/
├── backend/
│   ├── app.py                  # Flask app factory
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/
│   │   ├── document.py         # /api/document/analyze
│   │   ├── chat.py             # /api/chat/ask
│   │   └── health.py           # /api/health
│   ├── services/
│   │   ├── analyzer.py         # Document analysis via Claude
│   │   └── chatbot.py          # Document Q&A via Claude
│   ├── utils/
│   │   └── file_parser.py      # PDF / DOCX / TXT extraction
│   └── uploads/                # Temp upload dir (auto-created)
│
├── frontend/
│   ├── public/index.html
│   ├── package.json
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── styles/globals.css
│       ├── utils/api.js
│       ├── pages/
│       │   ├── UploadPage.js / .css
│       │   └── ResultsPage.js / .css
│       └── components/
│           ├── ClauseCard.js / .css
│           ├── SummaryPanel.js / .css
│           └── ChatPanel.js / .css
│
└── README.md
```

---

## Setup & Run

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

python app.py
# Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 3. Get an API Key

1. Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an API key for Gemini
3. Paste it into `backend/.env` as `GOOGLE_API_KEY=your_google_api_key_here`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/document/analyze` | Analyze document (JSON body `{text}` or multipart file) |
| POST | `/api/chat/ask` | Chat with document (`{question, document_text, history}`) |

---

## Supported File Types

- `.txt` — Plain text
- `.pdf` — PDF documents (text-based, not scanned images)
- `.docx` — Microsoft Word documents

---

## Notes

- Max document size: 10 MB upload, 50,000 characters analyzed
- Scanned/image PDFs are not supported (no OCR)
- Always consult a licensed lawyer for serious legal matters
