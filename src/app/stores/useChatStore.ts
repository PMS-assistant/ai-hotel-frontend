import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  hotelId: string;
  createdAt: string;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isTyping: boolean;
  createConversation: (hotelId: string) => string;
  setActiveConversation: (id: string) => void;
  sendMessage: (content: string, hotelId: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isTyping: false,

      createConversation: (hotelId) => {
        const id = `conv_${Date.now()}`;
        const newConv: Conversation = {
          id,
          title: 'New conversation',
          hotelId,
          createdAt: new Date().toISOString(),
          messages: [],
        };
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      sendMessage: async (content, hotelId) => {
        const state = get();
        let convId = state.activeConversationId;

        if (!convId) {
          convId = get().createConversation(hotelId);
        }

        const userMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          conversations: s.conversations.map((conv) =>
            conv.id === convId
              ? {
                  ...conv,
                  title:
                    conv.messages.length === 0
                      ? content.slice(0, 48) + (content.length > 48 ? '…' : '')
                      : conv.title,
                  messages: [...conv.messages, userMessage],
                }
              : conv
          ),
          isTyping: true,
        }));

        let aiContent: string;
        try {
          const response = await apiClient.post('/chat', { message: content });
          const data = response.data;
          const replyText = data.reply || data.decision?.reply_to_user;
          if (data.success && replyText) {
            aiContent = replyText;
          } else {
            aiContent = data.error || data.raw_response || 'Sorry, could not process that.';
          }
        } catch (err: any) {
          console.error('Chat error:', err);
          const msg = err?.response?.data?.detail || err?.message || 'Network error. Is the backend running?';
          aiContent = `Something went wrong: ${msg}`;
        }

        const assistantMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: aiContent,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          conversations: s.conversations.map((conv) =>
            conv.id === convId
              ? { ...conv, messages: [...conv.messages, assistantMessage] }
              : conv
          ),
          isTyping: false,
        }));
      },

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        })),

      clearAll: () => set({ conversations: [], activeConversationId: null }),
    }),
    { name: 'vzir-chat-store-v1' }
  )
);
