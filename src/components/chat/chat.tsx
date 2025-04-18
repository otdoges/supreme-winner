"use client";

import React, { useState, useRef, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import type { VirtuosoHandle } from "react-virtuoso";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Message } from "./message";
import { ChatInput } from "./chat-input";
import { useStore } from "../../lib/store";
import { useChat } from "ai/react";
import { SystemPromptDialog } from "./system-prompt";
import { ModelSelector } from "./model-selector";
import { ExportDialog } from "./export-dialog";
import { SettingsDialog } from "./settings";
import { 
  ArrowDownIcon, 
  Bot, 
  Download, 
  Menu, 
  MoreVertical, 
  PlusIcon, 
  Settings,
  Cpu,
  MessageSquare
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Chat() {
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const router = useRouter();
  
  const { 
    activeConversationId, 
    getActiveConversation, 
    createConversation, 
    addMessage, 
    updateMessage
  } = useStore();
  
  const conversation = getActiveConversation();
  
  // Initialize chat if there's no active conversation
  useEffect(() => {
    if (!activeConversationId) {
      createConversation();
    }
  }, [activeConversationId, createConversation]);
  
  // Set up chat with AI SDK
  const {
    messages: aiMessages,
    isLoading,
    handleSubmit,
    stop,
    setMessages,
  } = useChat({
    api: "/api/chat",
    id: activeConversationId || undefined,
    body: {
      modelId: conversation?.model.id,
    },
    onFinish: (message) => {
      if (conversation) {
        addMessage(conversation.id, {
          content: message.content,
          role: "assistant",
        });
      }
    },
    onError: (error) => {
      console.error("Error in AI chat:", error);
      if (conversation) {
        addMessage(conversation.id, {
          content: "Sorry, there was an error processing your request. Please try again.",
          role: "assistant",
        });
      }
    }
  });
  
  // Sync messages with AI SDK when conversation changes
  useEffect(() => {
    if (conversation) {
      const formattedMessages = conversation.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
      }));
      setMessages(formattedMessages);
    }
  }, [conversation?.id, setMessages]);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (aiMessages.length > 0 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: aiMessages.length - 1,
        behavior: "smooth",
      });
    }
  }, [aiMessages.length]);
  
  // Handle scroll events to show/hide scroll to bottom button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = 
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    
    setShowScrollButton(!isAtBottom);
  };
  
  // Handler for the scroll to bottom button
  const scrollToBottom = () => {
    virtuosoRef.current?.scrollToIndex({
      index: aiMessages.length - 1,
      behavior: "smooth",
    });
  };
  
  // Submit a new user message
  const onSubmitMessage = (content: string) => {
    if (!conversation) return;
    
    // Add the message to the store
    addMessage(conversation.id, {
      content,
      role: "user",
    });
    
    // Create a simplified message array for the API call
    const apiMessages = conversation.messages.map(msg => ({
      content: msg.content,
      role: msg.role
    }));
    
    // Add the new user message
    apiMessages.push({ content, role: "user" });
    
    // Submit to the AI using the API call
    handleSubmit(
      new SubmitEvent("submit") as any, 
      { 
        data: { 
          messages: apiMessages,
          modelId: conversation.model.id
        } 
      }
    );
  };
  
  // Create a new conversation
  const handleNewConversation = () => {
    createConversation();
  };
  
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <h2 className="text-lg font-semibold">{conversation.title}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            className="h-8 w-8"
            aria-label="New Chat"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More Options">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowModelSelector(true)}>
                <Cpu className="mr-2 h-4 w-4" />
                <span>Change Model</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSystemPrompt(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Edit System Prompt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowExport(true)}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export Conversation</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-hidden" id="chat-messages" onScroll={handleScroll}>
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              Ask me anything about code, writing, research, or any topic you'd like assistance with.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {["Explain recursion with an example", 
                "Write a React component for a file uploader", 
                "Create a SQLite database schema for a blog", 
                "Generate a regex to validate email addresses"].map((suggestion) => (
                <Button 
                  key={suggestion}
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => onSubmitMessage(suggestion)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={conversation.messages}
            itemContent={(index, message) => (
              <Message
                key={message.id}
                message={message}
                isLastMessage={index === conversation.messages.length - 1}
              />
            )}
            followOutput={"auto"}
            className="h-full"
          />
        )}
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-8 bottom-28 rounded-full shadow-md"
          onClick={scrollToBottom}
        >
          <ArrowDownIcon className="h-4 w-4" />
        </Button>
      )}
      
      {/* Chat input */}
      <div className="p-4 border-t">
        <ChatInput 
          onSubmit={onSubmitMessage} 
          isStreaming={isLoading}
          onStopStreaming={stop}
        />
      </div>
      
      {/* Dialogs */}
      <SystemPromptDialog
        open={showSystemPrompt}
        onOpenChange={setShowSystemPrompt}
        conversationId={conversation.id}
      />
      
      <ModelSelector
        open={showModelSelector}
        onOpenChange={setShowModelSelector}
        conversationId={conversation.id}
      />
      
      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        conversationId={conversation.id}
      />
      
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  );
} 