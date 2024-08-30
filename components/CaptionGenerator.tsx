'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';

const CaptionGenerator = () => {
  const [imageDescription, setImageDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCaption('');
    try {
      const systemMessage = "You are a helpful assistant that generates creative captions for images based on descriptions.";
      const prompt = `Generate a creative caption for an image with the following description: "${imageDescription}"`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setCaption((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setCaption(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setCaption('An error occurred while generating the caption.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Caption Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="imageDescription" className="block mb-2">Image Description</label>
          <textarea
            id="imageDescription"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-gray-800"
            rows={4}
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
          {isLoading ? 'Generating...' : 'Generate Caption'}
        </button>
      </form>
      {caption && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Caption:</h3>
          <p className="bg-gray-200 p-4 rounded">{caption}</p>
        </div>
      )}
    </main>
  );
};

export default CaptionGenerator;