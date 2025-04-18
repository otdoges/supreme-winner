"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "./ui/button";
import { ConversationList } from "./chat/conversation-list";
import { Chat } from "./chat/chat";
import { Menu, X } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

export function ChatLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Close sidebar on mobile when switching to desktop layout
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);
  
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex h-full w-full flex-col">
        {isMobile ? (
          // Mobile layout
          <div className="flex h-full w-full flex-col">
            {/* Mobile nav */}
            <div className="flex h-12 items-center justify-between border-b px-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile sidebar */}
            {isMobileOpen && (
              <div className="absolute inset-0 z-50 bg-background">
                <div className="flex h-12 items-center justify-between border-b px-4">
                  <h2 className="font-semibold">Conversations</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="h-[calc(100vh-3rem)] overflow-auto pb-safe">
                  <ConversationList />
                </div>
              </div>
            )}
            
            {/* Mobile chat */}
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </div>
        ) : (
          // Desktop layout with resizable panels
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel 
              defaultSize={20} 
              minSize={15}
              maxSize={30}
              className="border-r"
            >
              <ConversationList />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={80}>
              <Chat />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
} 