'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Summarizer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text to summarize</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useStream"
              checked={useStream}
              onCheckedChange={(checked) => setUseStream(checked as boolean)}
            />
            <Label htmlFor="useStream">Enable streaming</Label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </Button>
        </form>
      </CardContent>
      {summary && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Summary:</h3>
            <p className="bg-gray-100 p-4 rounded">{summary}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Summarizer;