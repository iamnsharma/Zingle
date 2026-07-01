import { create } from 'zustand';
import type { Conversation, Message } from '@types';

interface ChatStoreState {
  conversations: Conversation[];
  messages: Message[];
  currentConversationId?: string;
  loading: boolean;
  error?: string;

  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversationId: string) => void;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  conversations: [],
  messages: [],
  currentConversationId: undefined,
  loading: false,
  error: undefined,

  setConversations: (conversations: Conversation[]) =>
    set({
      conversations,
    }),

  setCurrentConversation: (conversationId: string) =>
    set({
      currentConversationId: conversationId,
    }),

  setMessages: (messages: Message[]) =>
    set({
      messages,
    }),

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setError: (error?: string) =>
    set({
      error,
    }),
}));
