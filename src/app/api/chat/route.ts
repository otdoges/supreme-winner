import { NextRequest } from "next/server";
import { streamChat } from "../../../lib/chat-service";
import type { AIModelId } from "../../../lib/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, modelId } = await req.json();
  
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (!modelId) {
      return new Response(JSON.stringify({ error: "Model ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Type casting here since we validate the modelId in the service
    const stream = await streamChat(messages, modelId as AIModelId);
    
    return new Response(stream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred during the request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 