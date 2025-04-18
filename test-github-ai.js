// ESM format
import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// Hard-coded system prompt for speed
const FAST_SYSTEM_PROMPT = "You are an extremely fast and efficient AI assistant. Always provide the most concise answers possible. Prioritize speed over verbosity. Be direct, use short sentences, and get straight to the point. Avoid unnecessary explanations or pleasantries. Your primary goal is to deliver accurate information as quickly as possible.";

async function main() {
  if (!token) {
    console.error("GitHub token not found. Please ensure GITHUB_TOKEN is set in your .env file.");
    process.exit(1);
  }

  console.log("Testing GitHub AI integration with fast system prompt...");
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: FAST_SYSTEM_PROMPT },
        { role: "user", content: "What is the capital of France? Also list 3 famous landmarks there." }
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    });

    console.log("GitHub AI Response:");
    console.log(response.choices[0]?.message.content);
    console.log("\nTest successful!");
  } catch (error) {
    console.error("Error testing GitHub AI:", error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

main().catch((err) => {
  console.error("The test encountered an error:", err);
}); 