"use server";

import { OpenAI } from "openai";
import type { AIModelId } from "./types";
import { env } from "../env";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// GitHub AI model client
const githubAI = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: env.GITHUB_TOKEN,
});

// This is a placeholder for the GitHub Marketplace AI models integration
// The actual implementation will be provided separately as mentioned in requirements
export async function streamChat(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  modelId: AIModelId
): Promise<ReadableStream> {
  // Choose the client based on the model provider
  if (modelId.startsWith("github/")) {
    return streamGitHubChat(messages, modelId);
  }
  
  // For now, we'll use OpenAI as a placeholder for other models
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

// GitHub AI chat streaming function
async function streamGitHubChat(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  modelId: AIModelId
): Promise<ReadableStream> {
  const githubModelId = modelId === "github/gpt-4.1" ? "openai/gpt-4.1" : "openai/gpt-4.1";
  
  const response = await githubAI.chat.completions.create({
    model: githubModelId,
    messages,
    temperature: 1.0,
    top_p: 1.0,
    stream: true,
  });
  
  // Convert the stream to ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Handle the stream events
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      } catch (error) {
        console.error("Error in GitHub AI stream:", error);
        controller.enqueue(new TextEncoder().encode("\n\nError: Failed to get response from GitHub AI."));
        controller.close();
      }
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
    "github/gpt-4.1": "openai/gpt-4.1",
  };
  
  return mapping[modelId] || "gpt-3.5-turbo";
} 