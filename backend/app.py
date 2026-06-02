from flask import Flask, request, jsonify
from flask_cors import CORS
import json, re
from groq import Groq

from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise Exception("GROQ_API_KEY not found in .env file")

client = Groq(api_key=API_KEY)
MODEL = "llama-3.3-70b-versatile"


# ─────────────────────────────────────────
# SAFE JSON EXTRACTOR (FIXED)
# ─────────────────────────────────────────
def extract_json(text: str):
    if not text:
        return None

    text = re.sub(r"```json|```", "", text).strip()

    # try full parse first
    try:
        return json.loads(text)
    except:
        pass

    # fallback: extract first JSON block
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != -1:
            return json.loads(text[start:end])
    except:
        pass

    # fallback for list
    try:
        start = text.find("[")
        end = text.rfind("]") + 1
        if start != -1 and end != -1:
            return json.loads(text[start:end])
    except:
        pass

    return None


# ─────────────────────────────────────────
# GROQ CALL
# ─────────────────────────────────────────
def call_groq(system, user, max_tokens=2000):
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        max_tokens=max_tokens,
        temperature=0.2,
    )
    return resp.choices[0].message.content


# ─────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


# ─────────────────────────────────────────
# ANALYZE DOCUMENT (FIXED + STABLE)
# ─────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    text = text[:12000]

    # ── META PROMPT (STRONG JSON FORCE) ──
    meta_prompt = f"""
You are a strict JSON generator.

Return ONLY valid JSON.

Schema:
{{
  "document_type": "string",
  "summary": "string",
  "parties": [],
  "key_dates": [],
  "key_obligations": {[]},
  "penalties": []
}}

Document:
{text}
"""

    try:
        raw = call_groq("Return only JSON.", meta_prompt)
        print("META RAW:", raw)

        doc_info = extract_json(raw)

        if not doc_info:
            raise Exception("Invalid JSON")

    except Exception as e:
        print("Meta error:", e)
        doc_info = {
            "document_type": "Unknown",
            "summary": "Analysis failed",
            "parties": [],
            "key_dates": [],
            "key_obligations": {},
            "penalties": []
        }

    # ── CLAUSE PROMPT (STRONG FIX) ──
    clause_prompt = f"""
You are a strict JSON generator.

Return ONLY a JSON array.

Each item:
{{
  "id": number,
  "original": "text",
  "simplified": "plain English",
  "risk_level": "safe | caution | danger",
  "risk_reason": "short reason",
  "category": "Payment | Termination | Liability | Other"
}}

Return 6-12 clauses only.

Document:
{text}
"""

    try:
        raw = call_groq("Return only JSON array.", clause_prompt, 2500)
        print("CLAUSE RAW:", raw)

        clauses = extract_json(raw)

        if not isinstance(clauses, list):
            raise Exception("Not list")

    except Exception as e:
        print("Clause error:", e)
        clauses = [{
            "id": 1,
            "original": "Error parsing clauses",
            "simplified": "Try again",
            "risk_level": "caution",
            "risk_reason": "Backend parsing issue",
            "category": "Other"
        }]

    return jsonify({
        "success": True,
        "document_info": doc_info,
        "clauses": clauses
    })


# ─────────────────────────────────────────
# TRANSLATE
# ─────────────────────────────────────────
@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json() or {}
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        urdu = call_groq(
            "Translate English to Urdu. Return only translation.",
            text,
            600
        )
        return jsonify({"success": True, "urdu": urdu})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────
# CHAT
# ─────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}

    question = data.get("question", "")
    doc_text = data.get("document_text", "")
    history = data.get("history", [])

    if not question or not doc_text:
        return jsonify({"error": "Missing fields"}), 400

    system = f"""
You are a legal assistant.

Document:
{doc_text[:8000]}
"""

    messages = [{"role": "system", "content": system}]

    for m in history[-6:]:
        messages.append({"role": m["role"], "content": m["content"]})

    messages.append({"role": "user", "content": question})

    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=600,
            temperature=0.4,
        )

        return jsonify({
            "success": True,
            "answer": resp.choices[0].message.content
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)