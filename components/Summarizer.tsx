'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');
    try {
      const systemMessage = "You are a helpful assistant that summarizes long texts.";
      const prompt = `Summarize the following text: "${text}"`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setSummary((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setSummary(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setSummary('An error occurred while summarizing the text.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Summarizer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block mb-2">Text to summarize</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-gray-800"
            rows={8}
            required
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
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Summary:</h3>
          <p className="bg-gray-200 p-4 rounded">{summary}</p>
        </div>
      )}
    </main>
  );
};

export default Summarizer;