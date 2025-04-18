"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useStore } from "../../lib/store";
import { exportConversation, type ExportFormat } from "../../lib/export";
import { Card } from "../ui/card";
import { CheckIcon, Download, FileJson, FileType, FileText, Image } from "lucide-react";
import { cn } from "../../lib/utils";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

type ExportOption = {
  id: ExportFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
};

export function ExportDialog({ open, onOpenChange, conversationId }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("markdown");
  const [isExporting, setIsExporting] = useState(false);
  const { getActiveConversation } = useStore();
  
  const exportOptions: ExportOption[] = [
    {
      id: "markdown",
      name: "Markdown",
      description: "Export as a Markdown (.md) file with formatting preserved",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: "json",
      name: "JSON",
      description: "Export as a JSON file for programmatic use",
      icon: <FileJson className="h-6 w-6" />,
    },
    {
      id: "pdf",
      name: "PDF",
      description: "Export as a PDF document",
      icon: <FileType className="h-6 w-6" />,
    },
    {
      id: "png",
      name: "Image",
      description: "Export as a PNG image",
      icon: <Image className="h-6 w-6" />,
    },
  ];
  
  const handleExport = async () => {
    const conversation = getActiveConversation();
    if (!conversation) return;
    
    setIsExporting(true);
    
    try {
      if (selectedFormat === "markdown" || selectedFormat === "json") {
        const content = await exportConversation(conversation, selectedFormat);
        
        if (typeof content === "string") {
          // Create a blob and download it
          const blob = new Blob([content], {
            type: selectedFormat === "markdown" 
              ? "text/markdown;charset=utf-8" 
              : "application/json;charset=utf-8",
          });
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          
          link.href = url;
          link.download = `${conversation.title}.${selectedFormat === "markdown" ? "md" : "json"}`;
          link.click();
          
          URL.revokeObjectURL(url);
        }
      } else {
        // For PNG and PDF, we need to pass the element ID
        await exportConversation(conversation, selectedFormat, "chat-messages");
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error exporting conversation:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {exportOptions.map((option) => (
            <Card
              key={option.id}
              className={cn(
                "p-4 cursor-pointer transition-colors relative",
                selectedFormat === option.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedFormat(option.id)}
            >
              {selectedFormat === option.id && (
                <div className="absolute top-2 right-2 text-primary">
                  <CheckIcon className="h-5 w-5" />
                </div>
              )}
              
              <div className="flex flex-col items-start space-y-2">
                <div className="text-muted-foreground">{option.icon}</div>
                <div>
                  <h3 className="font-medium">{option.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : `Export as ${selectedFormat}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 