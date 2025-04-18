"use client";

import React from "react";
import { useStore } from "../../lib/store";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/utils";
import { cn } from "../../lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "../ui/card";

export function ConversationList() {
  const { 
    conversations, 
    activeConversationId, 
    createConversation, 
    deleteConversation,
    setActiveConversation
  } = useStore();
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Create a new conversation
  const handleNewConversation = () => {
    const id = createConversation();
    if (pathname !== "/") {
      router.push("/");
    }
  };
  
  // Set active conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    if (pathname !== "/") {
      router.push("/");
    }
  };
  
  // Delete a conversation
  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };
  
  return (
    <div className="flex flex-col h-full gap-2 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button 
          onClick={handleNewConversation} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          New
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="mb-2">No conversations yet</p>
            <p className="text-sm">Start a new conversation to begin chatting</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={cn(
                  "p-3 cursor-pointer hover:bg-accent/50 transition-colors group",
                  activeConversationId === conversation.id && "bg-accent"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{conversation.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(conversation.updatedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {conversation.messages.length > 0 
                        ? `${conversation.messages.length} messages`
                        : "No messages"}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    aria-label="Delete conversation"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 