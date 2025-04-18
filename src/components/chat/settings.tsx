"use client";

import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useStore } from "../../lib/store";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsProps) {
  const { settings, updateSettings } = useStore();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          </TabsList>
          
          {/* Appearance settings */}
          <TabsContent value="appearance" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="capitalize">
                      {settings.theme}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup 
                      value={settings.theme} 
                      onValueChange={(value) => 
                        updateSettings({ theme: value as "light" | "dark" | "system" })
                      }
                    >
                      <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="fontSize">Font Size</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="capitalize">
                      {settings.fontSize === "sm" ? "Small" : 
                       settings.fontSize === "md" ? "Medium" : "Large"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup 
                      value={settings.fontSize} 
                      onValueChange={(value) => 
                        updateSettings({ fontSize: value as "sm" | "md" | "lg" })
                      }
                    >
                      <DropdownMenuRadioItem value="sm">Small</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="md">Medium</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="lg">Large</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="messageDisplayFormat">Message Format</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="capitalize">
                      {settings.messageDisplayFormat}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup 
                      value={settings.messageDisplayFormat} 
                      onValueChange={(value) => 
                        updateSettings({ messageDisplayFormat: value as "bubble" | "flat" })
                      }
                    >
                      <DropdownMenuRadioItem value="bubble">Bubble</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="flat">Flat</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="codeBlockTheme">Code Block Theme</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="capitalize">
                      {settings.codeBlockTheme === "vscode" ? "VS Code" : 
                       settings.codeBlockTheme === "atom-one-dark" ? "Atom One Dark" : 
                       settings.codeBlockTheme === "dracula" ? "Dracula" : "GitHub"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup 
                      value={settings.codeBlockTheme} 
                      onValueChange={(value) => 
                        updateSettings({ 
                          codeBlockTheme: value as "github" | "vscode" | "atom-one-dark" | "dracula" 
                        })
                      }
                    >
                      <DropdownMenuRadioItem value="github">GitHub</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="vscode">VS Code</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="atom-one-dark">Atom One Dark</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dracula">Dracula</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </TabsContent>
          
          {/* Behavior settings */}
          <TabsContent value="behavior" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="showTimestamps">Show Timestamps</Label>
                  <p className="text-sm text-muted-foreground">
                    Display timestamps for each message
                  </p>
                </div>
                <Switch 
                  id="showTimestamps" 
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) => updateSettings({ showTimestamps: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="enableVoiceInput">Voice Input</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable voice input for messages
                  </p>
                </div>
                <Switch 
                  id="enableVoiceInput" 
                  checked={settings.enableVoiceInput}
                  onCheckedChange={(checked) => updateSettings({ enableVoiceInput: checked })}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Keyboard settings */}
          <TabsContent value="keyboard" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableKeyboardShortcuts">Keyboard Shortcuts</Label>
                <p className="text-sm text-muted-foreground">
                  Enable keyboard shortcuts for faster navigation
                </p>
              </div>
              <Switch 
                id="enableKeyboardShortcuts" 
                checked={settings.enableKeyboardShortcuts}
                onCheckedChange={(checked) => updateSettings({ enableKeyboardShortcuts: checked })}
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-medium">Available Shortcuts</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Send message</span>
                  <code className="rounded bg-muted px-2 py-1 text-xs">Enter</code>
                </li>
                <li className="flex items-center justify-between">
                  <span>New line</span>
                  <code className="rounded bg-muted px-2 py-1 text-xs">Shift + Enter</code>
                </li>
                <li className="flex items-center justify-between">
                  <span>New conversation</span>
                  <code className="rounded bg-muted px-2 py-1 text-xs">Ctrl/⌘ + N</code>
                </li>
                <li className="flex items-center justify-between">
                  <span>Search messages</span>
                  <code className="rounded bg-muted px-2 py-1 text-xs">Ctrl/⌘ + F</code>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 