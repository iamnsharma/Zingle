import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Conversation, Message, UserProfile } from '@types';
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  getOtherUserId,
} from '@services/mock/data';

const groupMessages = (): Record<string, Message[]> => {
  const grouped: Record<string, Message[]> = {};
  MOCK_MESSAGES.forEach(message => {
    const list = grouped[message.conversationId] ?? [];
    list.push(message);
    grouped[message.conversationId] = list;
  });
  Object.keys(grouped).forEach(id => {
    grouped[id].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  });
  return grouped;
};

const AUTO_REPLIES = [
  'Haha okay 😊',
  'That sounds fun — tell me more.',
  'I was thinking the same thing.',
  'When are you free this week?',
];

const INITIAL_MESSAGES = groupMessages();

interface ChatStoreState {
  conversations: Conversation[];
  messagesById: Record<string, Message[]>;

  ensureConversation: (
    other: UserProfile,
    options?: { intro?: boolean },
  ) => string;
  sendMessage: (conversationId: string, text: string, senderId?: string) => void;
  markRead: (conversationId: string) => void;
  getMessages: (conversationId: string) => Message[];
  unreadTotal: () => number;
  reset: () => void;
}

const sortConversations = (conversations: Conversation[]): Conversation[] =>
  [...conversations].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      conversations: MOCK_CONVERSATIONS,
      messagesById: INITIAL_MESSAGES,

      ensureConversation: (other, options) => {
        const existing = get().conversations.find(
          conversation => getOtherUserId(conversation) === other.id,
        );
        if (existing) {
          return existing.id;
        }

        const conversationId = `match-${other.id}`;
        const now = new Date().toISOString();
        const intro: Message | undefined = options?.intro
          ? {
              id: `intro-${other.id}`,
              conversationId,
              senderId: other.id,
              text: `Hey! Thanks for the like — I'm ${other.name}.`,
              createdAt: now,
            }
          : undefined;

        const conversation: Conversation = {
          id: conversationId,
          userId1: 'me',
          userId2: other.id,
          createdAt: now,
          unreadCount: intro ? 1 : 0,
          lastMessage: intro,
          lastMessageAt: intro?.createdAt,
        };

        set(state => ({
          conversations: sortConversations([conversation, ...state.conversations]),
          messagesById: {
            ...state.messagesById,
            [conversationId]: intro ? [intro] : [],
          },
        }));

        return conversationId;
      },

      sendMessage: (conversationId, text, senderId = 'me') => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const message: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId,
          text: trimmed,
          createdAt: new Date().toISOString(),
          readAt: senderId === 'me' ? new Date().toISOString() : undefined,
        };

        set(state => {
          const list = [...(state.messagesById[conversationId] ?? []), message];
          const conversations = sortConversations(
            state.conversations.map(conversation =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    lastMessage: message,
                    lastMessageAt: message.createdAt,
                    unreadCount:
                      senderId === 'me'
                        ? 0
                        : conversation.unreadCount + 1,
                  }
                : conversation,
            ),
          );

          return {
            messagesById: { ...state.messagesById, [conversationId]: list },
            conversations,
          };
        });

        if (senderId === 'me') {
          const conversation = get().conversations.find(
            item => item.id === conversationId,
          );
          const otherId = conversation
            ? getOtherUserId(conversation)
            : undefined;
          if (otherId && otherId !== 'me') {
            const reply =
              AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
            setTimeout(() => {
              get().sendMessage(conversationId, reply, otherId);
            }, 1200);
          }
        }
      },

      markRead: conversationId =>
        set(state => ({
          conversations: state.conversations.map(conversation =>
            conversation.id === conversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          ),
        })),

      getMessages: conversationId => get().messagesById[conversationId] ?? [],

      unreadTotal: () =>
        get().conversations.reduce(
          (sum, conversation) => sum + conversation.unreadCount,
          0,
        ),

      reset: () =>
        set({
          conversations: MOCK_CONVERSATIONS,
          messagesById: groupMessages(),
        }),
    }),
    {
      name: 'zingle-chat-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
