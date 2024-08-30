'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const EmailGenerator = () => {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useStream, setUseStream] = useState(false);
  const [allowImprovisation, setAllowImprovisation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmail('');
    try {
      const systemMessage = `You are a helpful assistant that generates professional emails based on given topics. ${
        context ? `Context: ${context}` : ''
      } ${allowImprovisation ? 'You may improvise and add relevant information.' : 'Stick closely to the given topic.'}`;
      const prompt = `Generate a professional email about the following topic: ${topic}`;
      
      if (useStream) {
        const stream = await callOpenRouterAPI(prompt, systemMessage, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setEmail((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const response = await callOpenRouterAPI(prompt, systemMessage, false) as string;
        setEmail(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setEmail('An error occurred while generating the email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl">Email Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Email Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Generating...' : 'Generate Email'}
          </Button>
        </form>
      </CardContent>
      {email && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Generated Email:</h3>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm overflow-x-auto">{email}</pre>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default EmailGenerator;