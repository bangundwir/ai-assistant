'use client';

import { useState } from 'react';
import { callOpenRouterAPI } from '../services/openRouterService';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Message Replier</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
            {isLoading ? 'Generating...' : 'Generate Reply'}
          </Button>
        </form>
      </CardContent>
      {reply && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Generated Reply:</h3>
            <p className="bg-gray-100 p-4 rounded">{reply}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageReplier;