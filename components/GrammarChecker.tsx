'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
    try {
      const systemMessage = `You are a helpful assistant that checks and corrects grammar in the given text. ${
        context ? `Context: ${context}` : ''
      }`;
      const prompt = `Check and correct the grammar in the following text: "${text}"`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setResult((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setResult(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while checking the grammar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Grammar Checker</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block mb-2">Text to check</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-gray-800"
            rows={5}
            required
          />
        </div>
        <div>
          <label htmlFor="context" className="block mb-2">Context (optional)</label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-gray-800"
            rows={3}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useStream"
            checked={useStream}
            onChange={(e) => setUseStream(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="useStream">Enable streaming</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Checking...' : 'Check Grammar'}
        </button>
      </form>
      {result && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Corrected Text:</h3>
          <p className="bg-gray-200 p-4 rounded">{result}</p>
        </div>
      )}
    </main>
  );
};

export default GrammarChecker;