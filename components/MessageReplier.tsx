'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';

const MessageReplier = () => {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);
  const [allowImprovisation, setAllowImprovisation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setReply('');
    try {
      const systemMessage = `You are a helpful assistant that generates appropriate replies to messages. ${
        context ? `Context: ${context}` : ''
      } ${allowImprovisation ? 'You may improvise and add relevant information.' : 'Stick closely to the given message.'}`;
      const prompt = `Generate a reply to the following message: "${message}"`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setReply((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setReply(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setReply('An error occurred while generating the reply.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Message Replier</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block mb-2">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
        <div className="flex items-center space-x-4">
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowImprovisation"
              checked={allowImprovisation}
              onChange={(e) => setAllowImprovisation(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="allowImprovisation">Allow improvisation</label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Reply'}
        </button>
      </form>
      {reply && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Reply:</h3>
          <p className="bg-gray-200 p-4 rounded">{reply}</p>
        </div>
      )}
    </main>
  );
};

export default MessageReplier;