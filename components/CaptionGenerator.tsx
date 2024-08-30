'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Caption Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="imageDescription">Image Description</label>
            <Textarea
              id="imageDescription"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              rows={4}
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
            {isLoading ? 'Generating...' : 'Generate Caption'}
          </Button>
        </form>
      </CardContent>
      {caption && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Generated Caption:</h3>
            <p className="bg-gray-100 p-4 rounded">{caption}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CaptionGenerator;