'use client'; // Tambahkan ini di baris pertama

import { useState } from 'react';
import TranslateForm from './TranslateForm';
import { useTranslation } from '../hooks/useTranslation';

const MainContent = () => {
  const { result, isLoading, translate } = useTranslation();
  const [useStream, setUseStream] = useState(false);

  const handleTranslate = (text: string, language: string, context: string) => {
    translate(text, language, context, useStream);
  };

  return (
    <main className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Translate</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useStream}
            onChange={(e) => setUseStream(e.target.checked)}
            className="mr-2"
          />
          Enable streaming
        </label>
      </div>
      <TranslateForm onTranslate={handleTranslate} isLoading={isLoading} />
      {result && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <p className="bg-gray-200 p-4 rounded">{result}</p>
        </div>
      )}
    </main>
  );
};

export default MainContent;
