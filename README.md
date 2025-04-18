# Next.js AI Chat Application

A robust AI chatbot application built with Next.js, featuring a modern UI, streaming responses, and powerful features.

## Features

- 🤖 Integration with AI models through GitHub Marketplace
- 💬 Modern chat interface with message bubbles and typing indicators
- 🔄 Real-time streaming responses
- 📊 Complete markdown and code syntax highlighting support
- 🎙️ Voice input capabilities
- 📱 Fully responsive design across all devices
- 💾 Persistent conversation history with local storage
- 🔀 Multiple chat sessions/conversations management
- ⚙️ Custom system prompts configuration
- 📤 Chat export functionality (PDF, PNG, JSON, Markdown)
- 🧩 Code execution sandbox for generated code
- 🧠 Context management with adjustable token windows
- 🎨 Custom themes and UI personalization
- ⌨️ Keyboard shortcuts for power users
- 🔍 Message search and filtering

## Technologies Used

- Next.js 14+ with App Router
- TypeScript for type safety
- Server components and streaming SSR
- Tailwind CSS for styling
- Zustand for state management
- Radix UI for accessible components
- LocalStorage/IndexedDB for client-side persistence

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-chat-app-next.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ai-chat-app-next
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your API keys for the AI models you want to use

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key (for Claude models)

## Usage

### Creating a New Conversation

Click the "+" button in the top-right corner to start a new conversation.

### Changing AI Models

1. Click the "More Options" button (three dots) in the conversation header
2. Select "Change Model"
3. Choose from the available AI models

### Customizing System Prompts

1. Click the "More Options" button in the conversation header
2. Select "Edit System Prompt"
3. Customize the prompt that defines the AI's behavior

### Exporting Conversations

1. Click the "More Options" button in the conversation header
2. Select "Export Conversation"
3. Choose from PDF, PNG, JSON, or Markdown formats

### Voice Input

Click the microphone button in the chat input to use voice-to-text (requires browser permission).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
