"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Conversation, Message, Settings, AIModelId } from "./types";
import { DEFAULT_MODEL_ID, DEFAULT_SYSTEM_PROMPT } from "./models";

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  settings: Settings;

  // Conversation actions
  getActiveConversation: () => Conversation | undefined;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  updateConversationSystemPrompt: (id: string, systemPrompt: string) => void;
  updateConversationModel: (id: string, modelId: AIModelId) => void;
  setActiveConversation: (id: string) => void;
  
  // Message actions
  addMessage: (conversationId: string, message: Omit<Message, "id" | "createdAt">) => string;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;
}

// Define default settings
const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  fontSize: "md",
  messageDisplayFormat: "bubble",
  codeBlockTheme: "github",
  showTimestamps: true,
  enableKeyboardShortcuts: true,
  enableVoiceInput: true,
};

// Create the store
export const useStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      settings: DEFAULT_SETTINGS,

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        if (!activeConversationId) return undefined;
        return conversations.find(c => c.id === activeConversationId) || undefined;
      },

      createConversation: () => {
        const id = nanoid();
        const now = new Date();
        const newConversation: Conversation = {
          id,
          title: "New Conversation",
          messages: [],
          model: { 
            id: DEFAULT_MODEL_ID,
            name: "", // Will be populated from the models data
            description: "",
            maxTokens: 0,
            tokenLimit: 0
          },
          systemPrompt: DEFAULT_SYSTEM_PROMPT,
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: id,
        }));
        
        return id;
      },

      deleteConversation: (id) => {
        set(state => {
          const newConversations = state.conversations.filter(c => c.id !== id);
          let newActiveId = state.activeConversationId;
          
          if (state.activeConversationId === id) {
            newActiveId = newConversations.length > 0 ? newConversations[0].id : null;
          }
          
          return {
            conversations: newConversations,
            activeConversationId: newActiveId,
          };
        });
      },

      updateConversationTitle: (id, title) => {
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === id 
              ? { ...c, title, updatedAt: new Date() } 
              : c
          ),
        }));
      },

      updateConversationSystemPrompt: (id, systemPrompt) => {
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === id 
              ? { ...c, systemPrompt, updatedAt: new Date() } 
              : c
          ),
        }));
      },

      updateConversationModel: (id, modelId) => {
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === id 
              ? { 
                  ...c, 
                  model: { 
                    ...c.model, 
                    id: modelId 
                  }, 
                  updatedAt: new Date() 
                } 
              : c
          ),
        }));
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      addMessage: (conversationId, message) => {
        const id = nanoid();
        const createdAt = new Date();
        
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId 
              ? {
                  ...c,
                  messages: [...c.messages, { ...message, id, createdAt }],
                  updatedAt: createdAt,
                }
              : c
          ),
        }));
        
        return id;
      },

      updateMessage: (conversationId, messageId, content) => {
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map(m => 
                    m.id === messageId
                      ? { ...m, content }
                      : m
                  ),
                  updatedAt: new Date(),
                }
              : c
          ),
        }));
      },

      deleteMessage: (conversationId, messageId) => {
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.filter(m => m.id !== messageId),
                  updatedAt: new Date(),
                }
              : c
          ),
        }));
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: "ai-chat-store",
    }
  )
); 