import { UserProfile } from './profile';

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'like' | 'superlike';
  createdAt: string;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  user1: UserProfile;
  user2: UserProfile;
  createdAt: string;
  lastMessageAt?: string;
}

export interface UserLike {
  id: string;
  userId: string;
  user: UserProfile;
  type: 'like' | 'superlike';
  createdAt: string;
}
