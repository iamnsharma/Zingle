export interface IUser {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfile {
  userId: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
  photos?: string[];
}

export interface IMatch {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
  refreshToken?: string;
}
