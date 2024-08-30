'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Fill the Blank</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sentence">Sentence with [BLANK]</label>
            <Input
              type="text"
              id="sentence"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="The [BLANK] jumped over the [BLANK]."
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
            {isLoading ? 'Filling...' : 'Fill the Blank'}
          </Button>
        </form>
      </CardContent>
      {filledSentence && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Filled Sentence:</h3>
            <p className="bg-gray-100 p-4 rounded">{filledSentence}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default FillTheBlank;