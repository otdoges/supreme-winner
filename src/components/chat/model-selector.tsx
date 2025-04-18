"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useStore } from "../../lib/store";
import { AI_MODELS } from "../../lib/models";
import { cn } from "../../lib/utils";
import type { AIModelId } from "../../lib/types";

interface ModelSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export function ModelSelector({ open, onOpenChange, conversationId }: ModelSelectorProps) {
  const { getActiveConversation, updateConversationModel } = useStore();
  
  // Get the current model from the active conversation
  const activeConversation = getActiveConversation();
  const currentModelId = activeConversation?.model.id;
  
  // Handle model selection
  const handleSelectModel = (modelId: AIModelId) => {
    if (conversationId) {
      updateConversationModel(conversationId, modelId);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Select Model</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {Object.values(AI_MODELS).map((model) => (
            <Card
              key={model.id}
              className={cn(
                "p-4 cursor-pointer hover:border-primary transition-colors",
                model.id === currentModelId && "border-primary bg-primary/5"
              )}
              onClick={() => handleSelectModel(model.id)}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {model.description}
                    </p>
                  </div>
                  {model.id === currentModelId && (
                    <div className="rounded-full bg-primary/10 text-primary text-xs px-2 py-1">
                      Selected
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <div>Max Tokens: {model.maxTokens.toLocaleString()}</div>
                  <div>Context: {model.tokenLimit.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 