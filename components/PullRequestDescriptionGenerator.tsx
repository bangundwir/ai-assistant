'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Pull Request Description Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="changes">Code Changes</label>
            <Textarea
              id="changes"
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
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
            <label htmlFor="useStream">Enable streaming</label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Description'}
          </Button>
        </form>
      </CardContent>
      {description && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Generated Description:</h3>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{description}</pre>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PullRequestDescriptionGenerator;