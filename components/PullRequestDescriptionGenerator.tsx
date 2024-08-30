'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';

const PullRequestDescriptionGenerator = () => {
  const [changes, setChanges] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDescription('');
    try {
      const systemMessage = "You are a helpful assistant that generates pull request descriptions based on code changes.";
      const prompt = `Generate a pull request description for the following changes:\n${changes}`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setDescription((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setDescription(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setDescription('An error occurred while generating the pull request description.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Pull Request Description Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="changes" className="block mb-2">Code Changes</label>
          <textarea
            id="changes"
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
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
          {isLoading ? 'Generating...' : 'Generate Description'}
        </button>
      </form>
      {description && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Description:</h3>
          <pre className="bg-gray-200 p-4 rounded whitespace-pre-wrap">{description}</pre>
        </div>
      )}
    </main>
  );
};

export default PullRequestDescriptionGenerator;