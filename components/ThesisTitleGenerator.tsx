'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const ThesisTitleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);
  const [allowImprovisation, setAllowImprovisation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTitles([]);
    try {
      const systemMessage = `You are a helpful assistant that generates thesis titles based on given topics. ${
        context ? `Context: ${context}` : ''
      } ${allowImprovisation ? 'You may improvise and add relevant information.' : 'Stick closely to the given topic.'}`;
      const prompt = `Generate 5 thesis titles for the following topic: "${topic}"`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        let fullResponse = '';
        for await (const part of stream) {
          fullResponse += part.choices[0]?.delta?.content || "";
          setTitles(fullResponse.split('\n').filter(title => title.trim() !== ''));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setTitles(response.split('\n').filter(title => title.trim() !== ''));
      }
    } catch (error) {
      console.error('Error:', error);
      setTitles(['An error occurred while generating thesis titles.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Thesis Title Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Thesis Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useStream"
                checked={useStream}
                onCheckedChange={(checked) => setUseStream(checked as boolean)}
              />
              <Label htmlFor="useStream">Enable streaming</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowImprovisation"
                checked={allowImprovisation}
                onCheckedChange={(checked) => setAllowImprovisation(checked as boolean)}
              />
              <Label htmlFor="allowImprovisation">Allow improvisation</Label>
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Titles'}
          </Button>
        </form>
      </CardContent>
      {titles.length > 0 && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Generated Titles:</h3>
            <ul className="list-decimal list-inside bg-gray-100 p-4 rounded">
              {titles.map((title, index) => (
                <li key={index} className="mb-2">{title}</li>
              ))}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ThesisTitleGenerator;