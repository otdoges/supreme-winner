import OpenAI from "openai";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

async function main(): Promise<void> {
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
  } catch (error: unknown) {
    console.error("Error testing GitHub AI:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && 'response' in error) {
      const apiError = error as unknown as { response: { status: number; data: unknown } };
      console.error("Response status:", apiError.response?.status);
      console.error("Response data:", apiError.response?.data);
    }
  }
}

main().catch((err: unknown) => {
  console.error("The test encountered an error:", err instanceof Error ? err.message : String(err));
}); 