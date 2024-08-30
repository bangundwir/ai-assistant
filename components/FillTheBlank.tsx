'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';

const FillTheBlank = () => {
  const [sentence, setSentence] = useState('');
  const [filledSentence, setFilledSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFilledSentence('');
    try {
      const systemMessage = "You are a helpful assistant that fills in the blanks in sentences. Replace [BLANK] with appropriate words or phrases.";
      const prompt = `Fill in the blanks for the following sentence: "${sentence}"`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setFilledSentence((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setFilledSentence(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setFilledSentence('An error occurred while filling in the blanks.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Fill the Blank</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sentence" className="block mb-2">Sentence with [BLANK]</label>
          <input
            type="text"
            id="sentence"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-gray-800"
            placeholder="The [BLANK] jumped over the [BLANK]."
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
          {isLoading ? 'Filling...' : 'Fill the Blank'}
        </button>
      </form>
      {filledSentence && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Filled Sentence:</h3>
          <p className="bg-gray-200 p-4 rounded">{filledSentence}</p>
        </div>
      )}
    </main>
  );
};

export default FillTheBlank;