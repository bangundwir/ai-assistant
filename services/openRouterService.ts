import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME,
  },
  dangerouslyAllowBrowser: true, // Enable this for client-side usage
});

export const callOpenRouterAPI = async (prompt: string, systemMessage: string, useStream: boolean = false) => {
  try {
    if (useStream) {
      return await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        stream: true,
      });
    } else {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        model: "openai/gpt-4o-mini",
      });

      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred while calling the API');
  }
};

export const translateText = async (text: string, targetLanguage: string, context: string, useStream: boolean = false) => {
  const systemMessage = `You are a helpful AI assistant. Translate the following text to ${targetLanguage}. Context: ${context}`;
  return await callOpenRouterAPI(text, systemMessage, useStream);
};
