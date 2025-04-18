// ESM format
import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

async function main() {
  if (!token) {
    console.error("GitHub token not found. Please ensure GITHUB_TOKEN is set in your .env file.");
    process.exit(1);
  }

  console.log("Testing GitHub AI integration...");
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of France?" }
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