import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const analyzeDocument = (text) =>
  api.post('/analyze', { text }).then(r => r.data);

export const translateText = (text) =>
  api.post('/translate', { text }).then(r => r.data);

export const chatWithDoc = (question, document_text, history) =>
  api.post('/chat', { question, document_text, history }).then(r => r.data);

export const healthCheck = () =>
  api.get('/health').then(r => r.data);
