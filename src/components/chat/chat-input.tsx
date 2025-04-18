"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MicIcon, SendIcon, StopCircleIcon } from "lucide-react";
import { useStore } from "../../lib/store";
import { useSpeechRecognition } from "../../hooks/use-speech-recognition";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
}

export function ChatInput({ onSubmit, isStreaming, onStopStreaming }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useStore();
  
  const { 
    isListening, 
    startListening, 
    stopListening, 
    transcript, 
    resetTranscript,
    isSupported 
  } = useSpeechRecognition();
  
  // Effect to resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  // Effect to update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput((prev) => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);
  
  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) {
      onStopStreaming();
      return;
    }
    
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
      
      if (isListening) {
        stopListening();
      }
    }
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!settings.enableKeyboardShortcuts) return;
    
    // Submit on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-end w-full max-w-4xl mx-auto space-x-2 p-4 bg-background border rounded-lg shadow-sm"
    >
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="min-h-[60px] w-full resize-none px-3 py-2 focus-visible:ring-1"
        disabled={isStreaming}
      />
      
      <div className="flex space-x-2">
        {settings.enableVoiceInput && isSupported && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "outline"}
            onClick={toggleVoiceInput}
            disabled={isStreaming}
            className="flex-shrink-0"
            aria-label={isListening ? "Stop recording" : "Start recording"}
          >
            <MicIcon className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() && !isStreaming}
          className="flex-shrink-0"
          aria-label={isStreaming ? "Stop generating" : "Send message"}
        >
          {isStreaming ? (
            <StopCircleIcon className="h-5 w-5" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
} 