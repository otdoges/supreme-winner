"use client";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { Conversation, Message } from "./types";

export type ExportFormat = "png" | "pdf" | "json" | "markdown";

// Convert a message to markdown format
export function messageToMarkdown(message: Message): string {
  const role = message.role === "assistant" ? "AI" : "You";
  const date = message.createdAt.toLocaleString();
  
  return `## ${role} (${date})

${message.content}

`;
}

// Convert a conversation to markdown format
export function conversationToMarkdown(conversation: Conversation): string {
  const title = `# ${conversation.title}\n\n`;
  const metadata = `- Created: ${conversation.createdAt.toLocaleString()}\n`;
  const modelInfo = `- Model: ${conversation.model.name}\n`;
  const systemPrompt = `- System Prompt: ${conversation.systemPrompt}\n\n`;
  
  const messagesMarkdown = conversation.messages
    .map(messageToMarkdown)
    .join("\n");
  
  return title + metadata + modelInfo + systemPrompt + messagesMarkdown;
}

// Export conversation as JSON
export function exportAsJson(conversation: Conversation): string {
  return JSON.stringify(conversation, null, 2);
}

// Export conversation as HTML/PNG
export async function exportAsPng(conversation: Conversation, elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`);
  }
  
  try {
    const dataUrl = await toPng(element, { quality: 0.95 });
    
    // Create a download link
    const link = document.createElement("a");
    link.download = `${conversation.title}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error exporting as PNG:", error);
    throw error;
  }
}

// Export conversation as PDF
export async function exportAsPdf(conversation: Conversation, elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`);
  }
  
  try {
    const dataUrl = await toPng(element, { quality: 0.95 });
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
    });
    
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${conversation.title}.pdf`);
  } catch (error) {
    console.error("Error exporting as PDF:", error);
    throw error;
  }
}

// Export conversation based on format
export async function exportConversation(
  conversation: Conversation,
  format: ExportFormat,
  elementId?: string
): Promise<string | void> {
  switch (format) {
    case "markdown":
      return conversationToMarkdown(conversation);
    case "json":
      return exportAsJson(conversation);
    case "png":
      if (!elementId) throw new Error("Element ID is required for PNG export");
      return exportAsPng(conversation, elementId);
    case "pdf":
      if (!elementId) throw new Error("Element ID is required for PDF export");
      return exportAsPdf(conversation, elementId);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
} 