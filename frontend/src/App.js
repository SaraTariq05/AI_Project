import React, { useState } from 'react';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return analysis
    ? <ResultsPage analysis={analysis} onReset={() => setAnalysis(null)} />
    : <UploadPage onAnalysis={setAnalysis} />;
}
