import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const analyzeText = (text) =>
  API.post('/document/analyze', { text }).then(r => r.data);

export const analyzeFile = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return API.post('/document/analyze', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};

export const askQuestion = (question, document_text, history) =>
  API.post('/chat/ask', { question, document_text, history }).then(r => r.data);
