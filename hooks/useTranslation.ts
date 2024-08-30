'use client'; // Tambahkan ini di baris pertama

import { useState } from 'react';
import { translateText } from '../services/openRouterService';

export const useTranslation = () => {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translate = async (text: string, language: string, context: string, useStream: boolean = false) => {
    setIsLoading(true);
    setResult('');
    try {
      if (useStream) {
        const stream = await translateText(text, language, context, true) as AsyncIterable<any>;
        for await (const part of stream) {
          setResult((prev) => prev + (part.choices[0]?.delta?.content || ""));
        }
      } else {
        const translatedText = await translateText(text, language, context, false) as string;
        setResult(translatedText ?? 'Translation not available');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while generating the translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, translate };
};
