import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // System message for brief responses to save tokens during testing
  const systemMessage = {
    role: 'system' as const,
    content: 'You are a helpful assistant. Keep responses VERY brief (1-2 sentences max) to save tokens during testing. Be concise but helpful.'
  };

  const result = streamText({
    model: openai('gpt-4o'),
    messages: [systemMessage, ...messages],
    maxTokens: 50, // Very short responses for testing
    temperature: 0.7,
  });

  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}