"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { UserIcon, BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import { vs, vscDarkPlus, dracula, atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useStore } from "../../lib/store";
import type { Message as MessageType } from "../../lib/types";

// Helper function to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

interface MessageProps {
  message: MessageType;
  isLastMessage: boolean;
}

// Create a type declaration for codeBlockThemes
type CodeBlockTheme = "github" | "vscode" | "atom-one-dark" | "dracula";
type CodeBlockThemeMap = {
  [key in CodeBlockTheme]: any;  
};

// Map code block themes to their corresponding styles
const codeBlockThemes: CodeBlockThemeMap = {
  github: vs,
  vscode: vscDarkPlus,
  "atom-one-dark": atomDark,
  dracula: dracula,
};

export function Message({ message, isLastMessage }: MessageProps) {
  const { settings } = useStore();
  
  // Determine the selected code theme
  const selectedTheme = codeBlockThemes[settings.codeBlockTheme as CodeBlockTheme] || vs;
  
  return (
    <div 
      className={cn(
        "group relative flex w-full items-start gap-4 px-4 py-6",
        message.role === "assistant" ? "bg-muted/40" : "bg-background",
        settings.messageDisplayFormat === "bubble" ? "rounded-lg mb-2" : "border-b"
      )}
      id={message.id}
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {message.role === "user" ? (
          <UserIcon className="h-5 w-5" />
        ) : (
          <BotIcon className="h-5 w-5" />
        )}
      </div>
      
      {/* Message content with markdown */}
      <div className="flex min-h-[32px] w-full flex-col gap-1">
        {/* Role & timestamp */}
        <div className="flex items-center gap-2">
          <div className="font-semibold capitalize">
            {message.role === "assistant" ? "AI" : "You"}
          </div>
          {settings.showTimestamps && (
            <div className="text-xs text-muted-foreground">
              {formatDate(message.createdAt)}
            </div>
          )}
        </div>
        
        {/* Message content */}
        <div className={cn(
          "prose prose-neutral dark:prose-invert w-full max-w-none",
          settings.fontSize === "sm" && "prose-sm",
          settings.fontSize === "lg" && "prose-lg",
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ className, children, ...rest }) {
                const match = /language-(\w+)/.exec(className || "");
                if (!match) {
                  return (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                }
                
                // Only use necessary props for SyntaxHighlighter
                const syntaxProps: SyntaxHighlighterProps = {
                  style: selectedTheme,
                  language: match[1],
                  PreTag: "div",
                  children: String(children).replace(/\n$/, "")
                };
                
                return <SyntaxHighlighter {...syntaxProps} />;
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 