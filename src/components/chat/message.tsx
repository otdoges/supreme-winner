"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { UserIcon, BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus, dracula, atomOneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { formatDate } from "../../lib/utils";
import { useStore } from "../../lib/store";
import type { Message as MessageType } from "../../lib/types";

interface MessageProps {
  message: MessageType;
  isLastMessage: boolean;
}

// Map code block themes to their corresponding styles
const codeBlockThemes = {
  github: vs,
  vscode: vscDarkPlus,
  "atom-one-dark": atomOneDark,
  dracula: dracula,
};

export function Message({ message, isLastMessage }: MessageProps) {
  const { settings } = useStore();
  
  // Determine the selected code theme
  const selectedTheme = codeBlockThemes[settings.codeBlockTheme] || vs;
  
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
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={selectedTheme}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
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