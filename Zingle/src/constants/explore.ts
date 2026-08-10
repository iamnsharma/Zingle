import { EXPLORE_IMAGES } from './images';

export interface ExploreCategory {
  id: string;
  title: string;
  subtitle: string;
  image: number;
  /** Profile ids available to swipe in this category */
  profileIds: string[];
}

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: 'night-out',
    title: 'Night Out',
    subtitle: 'Party & nightlife',
    image: EXPLORE_IMAGES.nightOut,
    profileIds: ['2', '4', '7', '6'],
  },
  {
    id: 'long-term',
    title: 'Long-term',
    subtitle: 'Serious relationships',
    image: EXPLORE_IMAGES.longTerm,
    profileIds: ['1', '5', '8', '3'],
  },
  {
    id: 'short-term',
    title: 'Short-term',
    subtitle: 'Casual & fun',
    image: EXPLORE_IMAGES.shortTerm,
    profileIds: ['2', '3', '6', '4'],
  },
  {
    id: 'new-friends',
    title: 'New Friends',
    subtitle: 'Expand your circle',
    image: EXPLORE_IMAGES.newFriends,
    profileIds: ['3', '7', '1', '5'],
  },
  {
    id: 'coffee-dates',
    title: 'Coffee Dates',
    subtitle: 'Low-key meetups',
    image: EXPLORE_IMAGES.coffeeDates,
    profileIds: ['1', '3', '8', '6'],
  },
  {
    id: 'travel-buddy',
    title: 'Travel Buddy',
    subtitle: 'Adventure together',
    image: EXPLORE_IMAGES.travelBuddy,
    profileIds: ['1', '4', '7', '8'],
  },
  {
    id: 'gym-partner',
    title: 'Gym Partner',
    subtitle: 'Work out together',
    image: EXPLORE_IMAGES.gymPartner,
    profileIds: ['2', '6', '4', '5'],
  },
  {
    id: 'foodies',
    title: 'Foodies',
    subtitle: 'Dine & discover',
    image: EXPLORE_IMAGES.foodies,
    profileIds: ['5', '8', '3', '1'],
  },
  {
    id: 'creative-souls',
    title: 'Creative Souls',
    subtitle: 'Art & culture',
    image: EXPLORE_IMAGES.creativeSouls,
    profileIds: ['3', '1', '7', '5'],
  },
  {
    id: 'free-tonight',
    title: 'Free Tonight',
    subtitle: 'Spontaneous plans',
    image: EXPLORE_IMAGES.freeTonight,
    profileIds: ['2', '4', '6', '7', '8'],
  },
];

export function getExploreCategoryById(id: string): ExploreCategory | undefined {
  return EXPLORE_CATEGORIES.find(c => c.id === id);
}

export function getExploreMemberCount(category: ExploreCategory): number {
  return category.profileIds.length;
}
