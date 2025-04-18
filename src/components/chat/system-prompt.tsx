"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useStore } from "../../lib/store";
import { DEFAULT_SYSTEM_PROMPT } from "../../lib/models";

interface SystemPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export function SystemPromptDialog({ open, onOpenChange, conversationId }: SystemPromptProps) {
  const { getActiveConversation, updateConversationSystemPrompt } = useStore();
  const [prompt, setPrompt] = useState("");
  
  // Load the current system prompt when the dialog opens
  useEffect(() => {
    if (open && conversationId) {
      const conversation = getActiveConversation();
      if (conversation) {
        setPrompt(conversation.systemPrompt);
      }
    }
  }, [open, conversationId, getActiveConversation]);
  
  // Save the system prompt
  const handleSave = () => {
    if (conversationId) {
      updateConversationSystemPrompt(conversationId, prompt);
      onOpenChange(false);
    }
  };
  
  // Reset to default system prompt
  const handleReset = () => {
    setPrompt(DEFAULT_SYSTEM_PROMPT);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>System Prompt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            The system prompt defines how the AI assistant behaves. You can customize it
            to change the AI&apos;s personality, knowledge constraints, or give it specific instructions.
          </p>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a system prompt..."
            className="h-40 resize-none"
          />
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 