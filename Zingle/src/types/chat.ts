export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  voiceUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  userId1: string;
  userId2: string;
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
  unreadCount: number;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation?: Conversation;
  messages: Message[];
  loading: boolean;
  error?: string;
}
