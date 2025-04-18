import type { AIModel, AIModels, AIModelId } from "./types";

export const AI_MODELS: AIModels = {
  "anthropic/claude-3-opus": {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    description: "Most powerful model for highly complex tasks",
    maxTokens: 4096,
    tokenLimit: 200000,
  },
  "anthropic/claude-3-sonnet": {
    id: "anthropic/claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "Excellent balance of intelligence and speed",
    maxTokens: 4096,
    tokenLimit: 150000,
  },
  "anthropic/claude-3-haiku": {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    description: "Fastest model, great for simpler tasks",
    maxTokens: 4096,
    tokenLimit: 100000,
  },
  "openai/gpt-4o": {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's most advanced multi-modal model",
    maxTokens: 4096,
    tokenLimit: 128000,
  },
  "openai/gpt-4-turbo": {
    id: "openai/gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Powerful model with strong reasoning capabilities",
    maxTokens: 4096,
    tokenLimit: 128000,
  },
  "openai/gpt-3.5-turbo": {
    id: "openai/gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective for simpler tasks",
    maxTokens: 4096,
    tokenLimit: 16000,
  },
};

export const getModel = (modelId: AIModelId): AIModel => {
  const model = AI_MODELS[modelId];
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }
  return model;
};

export const DEFAULT_MODEL_ID: AIModelId = "anthropic/claude-3-sonnet";
export const DEFAULT_SYSTEM_PROMPT = "You are a helpful, intelligent, and versatile AI assistant. Respond concisely unless asked for details."; 