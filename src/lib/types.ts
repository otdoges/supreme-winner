export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: AIModel;
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AIModelId = 
  | "anthropic/claude-3-opus"
  | "anthropic/claude-3-sonnet"
  | "anthropic/claude-3-haiku"
  | "openai/gpt-4o"
  | "openai/gpt-4-turbo"
  | "openai/gpt-3.5-turbo"
  | "github/gpt-4.1";

export interface AIModel {
  id: AIModelId;
  name: string;
  description: string;
  maxTokens: number;
  tokenLimit: number;
}

export interface AIModels {
  [key: string]: AIModel;
}

export interface Settings {
  theme: "light" | "dark" | "system";
  fontSize: "sm" | "md" | "lg";
  messageDisplayFormat: "bubble" | "flat";
  codeBlockTheme: "github" | "vscode" | "atom-one-dark" | "dracula";
  showTimestamps: boolean;
  enableKeyboardShortcuts: boolean;
  enableVoiceInput: boolean;
}

export interface SearchResult {
  conversationId: string;
  messageId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
} 