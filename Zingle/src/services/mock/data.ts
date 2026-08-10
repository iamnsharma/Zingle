import type { UserProfile } from '@types';
import type { UserLike } from '@types';
import type { Conversation, Message } from '@types';
import { getExploreCategoryById } from '@constants/explore';

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: '1',
    name: 'Sarah',
    email: 'sarah@example.com',
    age: 26,
    gender: 'female',
    interestedIn: ['male'],
    height: 165,
    profession: 'UX Designer',
    company: 'Tech Startup',
    education: 'bachelor',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      city: 'New York',
    },
    bio: 'Travel enthusiast, coffee lover, always up for an adventure!',
    languages: ['English', 'Spanish'],
    religion: 'christian',
    drinking: 'socially',
    smoking: 'never',
    pets: 'have-cats',
    workout: 'regularly',
    lookingFor: 'relationship',
    relationshipGoals: ['long-term'],
    interests: ['Travel', 'Photography', 'Cooking', 'Art'],
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: true,
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Emma',
    email: 'emma@example.com',
    age: 24,
    gender: 'female',
    interestedIn: ['male'],
    height: 170,
    profession: 'Marketing Manager',
    company: 'Digital Agency',
    education: 'bachelor',
    location: {
      latitude: 40.758,
      longitude: -73.9855,
      city: 'New York',
    },
    bio: 'Fitness junkie, music festival goer, always laughing.',
    languages: ['English', 'French'],
    religion: 'atheist',
    drinking: 'socially',
    smoking: 'never',
    pets: 'dont-have',
    workout: 'very-active',
    lookingFor: 'dating',
    relationshipGoals: ['long-term', 'casual'],
    interests: ['Gym', 'Music', 'Movies', 'Fashion'],
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: true,
    online: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    name: 'Mia',
    email: 'mia@example.com',
    age: 25,
    gender: 'female',
    interestedIn: ['male'],
    height: 168,
    profession: 'Photographer',
    company: 'Freelance',
    education: 'bachelor',
    location: {
      latitude: 40.73,
      longitude: -73.99,
      city: 'Brooklyn',
    },
    bio: 'Golden hour chaser. Will trade portfolio reviews for good pasta.',
    languages: ['English', 'Italian'],
    drinking: 'socially',
    smoking: 'never',
    pets: 'have-cats',
    workout: 'sometimes',
    lookingFor: 'relationship',
    relationshipGoals: ['long-term'],
    interests: ['Photography', 'Art', 'Travel', 'Coffee'],
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: true,
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Olivia',
    email: 'olivia@example.com',
    age: 27,
    gender: 'female',
    interestedIn: ['male'],
    height: 172,
    profession: 'Chef',
    company: 'Noma Pop-up',
    education: 'other',
    location: {
      latitude: 40.7484,
      longitude: -73.9857,
      city: 'Manhattan',
    },
    bio: 'If I like you, I will cook for you. Fair warning.',
    languages: ['English'],
    drinking: 'socially',
    smoking: 'never',
    pets: 'dont-have',
    workout: 'regularly',
    lookingFor: 'dating',
    relationshipGoals: ['long-term'],
    interests: ['Cooking', 'Travel', 'Movies', 'Food'],
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: false,
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Priya',
    email: 'priya@example.com',
    age: 23,
    gender: 'female',
    interestedIn: ['male'],
    height: 163,
    profession: 'Dancer',
    company: 'City Ballet',
    education: 'bachelor',
    location: {
      latitude: 19.076,
      longitude: 72.8777,
      city: 'Mumbai, India',
    },
    bio: 'Contemporary dancer. Looking for someone who can keep up on and off the floor.',
    languages: ['English', 'Hindi'],
    drinking: 'never',
    smoking: 'never',
    pets: 'have-other',
    workout: 'very-active',
    lookingFor: 'relationship',
    relationshipGoals: ['long-term'],
    interests: ['Yoga', 'Music', 'Art', 'Travel'],
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1525134479668-1bee5c7a6845?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: true,
    online: false,
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '6',
    name: 'Lily',
    email: 'lily@example.com',
    age: 29,
    gender: 'female',
    interestedIn: ['male'],
    height: 175,
    profession: 'Yoga Instructor',
    company: 'Zen Studio',
    education: 'master',
    location: {
      latitude: 28.6139,
      longitude: 77.209,
      city: 'Delhi, India',
    },
    bio: 'Sunrise flows, slow mornings, and deep conversations.',
    languages: ['English', 'Hindi'],
    drinking: 'socially',
    smoking: 'never',
    pets: 'have-dogs',
    workout: 'very-active',
    lookingFor: 'relationship',
    relationshipGoals: ['long-term', 'marriage'],
    interests: ['Yoga', 'Reading', 'Coffee', 'Travel'],
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: true,
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Zoe',
    email: 'zoe@example.com',
    age: 22,
    gender: 'female',
    interestedIn: ['male'],
    height: 160,
    profession: 'Student',
    company: 'NYU',
    education: 'bachelor',
    location: {
      latitude: 40.7295,
      longitude: -73.9965,
      city: 'New York',
    },
    bio: 'Art history nerd. Museum dates are my love language.',
    languages: ['English'],
    drinking: 'socially',
    smoking: 'never',
    pets: 'dont-have',
    workout: 'sometimes',
    lookingFor: 'dating',
    relationshipGoals: ['casual', 'long-term'],
    interests: ['Art', 'Reading', 'Movies', 'Coffee'],
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: false,
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Aisha',
    email: 'aisha@example.com',
    age: 28,
    gender: 'female',
    interestedIn: ['male'],
    height: 167,
    profession: 'Product Manager',
    company: 'Fintech Co',
    education: 'master',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      city: 'Bangalore, India',
    },
    bio: 'Building products by day, building playlists by night.',
    languages: ['English', 'Hindi', 'Kannada'],
    drinking: 'socially',
    smoking: 'never',
    pets: 'have-cats',
    workout: 'regularly',
    lookingFor: 'relationship',
    relationshipGoals: ['long-term'],
    interests: ['Technology', 'Music', 'Travel', 'Business'],
    photos: [
      'https://images.unsplash.com/photo-1488716820095-cbe80883c9af?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1525134479668-1bee5c7a6845?w=600&h=800&fit=crop',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verified: true,
    online: false,
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
  },
];

const msg = (
  id: string,
  conversationId: string,
  senderId: string,
  text: string,
  offsetMs: number,
  readAt?: string,
): Message => ({
  id,
  conversationId,
  senderId,
  text,
  createdAt: new Date(Date.now() - offsetMs).toISOString(),
  readAt,
});

export const MOCK_MESSAGES: Message[] = [
  msg('msg1', 'conv1', '1', 'Hey! How are you?', 3600000),
  msg('msg2', 'conv1', 'me', 'Hi! Doing great, thanks for asking!', 3000000, new Date(Date.now() - 2900000).toISOString()),
  msg('msg3', 'conv1', '1', 'Would love to grab coffee sometime', 2000000),
  msg('msg4', 'conv2', '2', 'That concert was insane last night!', 86400000),
  msg('msg5', 'conv2', 'me', 'Right?! We should go again', 85000000, new Date(Date.now() - 84000000).toISOString()),
  msg('msg6', 'conv2', '2', "Absolutely — I'm free this weekend", 82000000),
  msg('msg7', 'conv3', '3', 'Sent you a photo from my shoot', 7200000),
  msg('msg8', 'conv3', 'me', "Wow, that's stunning!", 7000000, new Date(Date.now() - 6900000).toISOString()),
  msg('msg9', 'conv4', '6', 'Good morning! Yoga in the park?', 1800000),
  msg('msg10', 'conv5', '8', 'Did you see the new cafe in Indiranagar?', 43200000),
];

const lastMsg = (conversationId: string): Message | undefined =>
  [...MOCK_MESSAGES]
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    userId1: 'me',
    userId2: '1',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    unreadCount: 1,
    lastMessage: lastMsg('conv1'),
    lastMessageAt: lastMsg('conv1')?.createdAt,
  },
  {
    id: 'conv2',
    userId1: 'me',
    userId2: '2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 2,
    lastMessage: lastMsg('conv2'),
    lastMessageAt: lastMsg('conv2')?.createdAt,
  },
  {
    id: 'conv3',
    userId1: 'me',
    userId2: '3',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    unreadCount: 0,
    lastMessage: lastMsg('conv3'),
    lastMessageAt: lastMsg('conv3')?.createdAt,
  },
  {
    id: 'conv4',
    userId1: 'me',
    userId2: '6',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    unreadCount: 1,
    lastMessage: lastMsg('conv4'),
    lastMessageAt: lastMsg('conv4')?.createdAt,
  },
  {
    id: 'conv5',
    userId1: 'me',
    userId2: '8',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    unreadCount: 0,
    lastMessage: lastMsg('conv5'),
    lastMessageAt: lastMsg('conv5')?.createdAt,
  },
];

export const MOCK_LIKES: UserLike[] = MOCK_PROFILES.map((user, index) => ({
  id: `like${index + 1}`,
  userId: user.id,
  user,
  type: index === 1 || index === 4 ? 'superlike' : 'like',
  createdAt: new Date(Date.now() - index * 3600000).toISOString(),
}));

export function getProfileById(userId: string): UserProfile | undefined {
  return MOCK_PROFILES.find(p => p.id === userId);
}

export function getExploreProfilesForCategory(categoryId: string): UserProfile[] {
  const category = getExploreCategoryById(categoryId);
  if (!category) return [];
  return category.profileIds
    .map(id => getProfileById(id))
    .filter((p): p is UserProfile => p != null);
}

export function getLikeByUserId(userId: string): UserLike | undefined {
  return MOCK_LIKES.find(l => l.userId === userId);
}

export function getConversationById(id: string): Conversation | undefined {
  return MOCK_CONVERSATIONS.find(c => c.id === id);
}

export function getMessagesForConversation(conversationId: string): Message[] {
  return MOCK_MESSAGES.filter(m => m.conversationId === conversationId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function getOtherUserId(conversation: Conversation): string {
  return conversation.userId1 === 'me' ? conversation.userId2 : conversation.userId1;
}

export function formatMessageTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
