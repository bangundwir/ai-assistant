'use client'; // Tambahkan ini di baris pertama

import { useState } from 'react';
import TranslateForm from './TranslateForm';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const MainContent = () => {
  const { result, isLoading, translate } = useTranslation();
  const [useStream, setUseStream] = useState(false);

  const handleTranslate = (text: string, language: string, context: string) => {
    translate(text, language, context, useStream);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Translate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <Checkbox
            id="useStream"
            checked={useStream}
            onCheckedChange={(checked) => setUseStream(checked as boolean)}
          />
          <Label htmlFor="useStream">Enable streaming</Label>
        </div>
        <TranslateForm onTranslate={handleTranslate} isLoading={isLoading} />
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Result:</h3>
            <p className="bg-gray-100 p-4 rounded">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MainContent;
