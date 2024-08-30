'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Grammar Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text to check</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
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
            {isLoading ? 'Checking...' : 'Check Grammar'}
          </Button>
        </form>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Corrected Text:</h3>
            <p className="bg-gray-100 p-4 rounded">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default GrammarChecker;