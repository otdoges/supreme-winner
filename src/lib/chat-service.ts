"use server";

import { OpenAI } from "openai";
import type { AIModelId } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// This is a placeholder for the GitHub Marketplace AI models integration
// The actual implementation will be provided separately as mentioned in requirements
export async function streamChat(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  modelId: AIModelId
): Promise<ReadableStream> {
  // For now, we'll use OpenAI as a placeholder
  // In the real implementation, this would route to different providers based on modelId
  
  const response = await openai.chat.completions.create({
    model: mapToProviderModel(modelId),
    messages,
    stream: true,
  });
  
  // Convert the stream to ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      // Handle the stream events
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });
  
  return stream;
}

// Maps our model IDs to the provider-specific model identifiers
function mapToProviderModel(modelId: AIModelId): string {
  // This is a simplified mapping, would be expanded in the real implementation
  const mapping: Record<AIModelId, string> = {
    "anthropic/claude-3-opus": "claude-3-opus-20240229",
    "anthropic/claude-3-sonnet": "claude-3-sonnet-20240229",
    "anthropic/claude-3-haiku": "claude-3-haiku-20240307",
    "openai/gpt-4o": "gpt-4o-2024-05-13",
    "openai/gpt-4-turbo": "gpt-4-turbo-2024-04-09",
    "openai/gpt-3.5-turbo": "gpt-3.5-turbo",
  };
  
  return mapping[modelId] || "gpt-3.5-turbo";
} 