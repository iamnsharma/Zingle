import type {
  DrinkingHabits,
  EducationLevel,
  LookingFor,
  OnboardingData,
  PetPreference,
  ProfileGender,
  RelationshipGoal,
  Religion,
  SmokingHabits,
  UserProfile,
  WorkoutFrequency,
} from '@types';
import { GENDER_OPTIONS } from '@constants/onboarding';
import { formatHeight } from '@constants/pickers';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export const EDUCATION_OPTIONS: SelectOption<EducationLevel>[] = [
  { value: 'high-school', label: 'High School' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' },
];

export const LOOKING_FOR_OPTIONS: SelectOption<LookingFor>[] = [
  { value: 'dating', label: 'Dating' },
  { value: 'relationship', label: 'Serious relationship' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'hookup', label: 'Short-term fun' },
];

export const RELATIONSHIP_GOAL_OPTIONS: SelectOption<RelationshipGoal>[] = [
  { value: 'marriage', label: 'Marriage' },
  { value: 'long-term', label: 'Long-term relationship' },
  { value: 'casual', label: 'Casual dating' },
  { value: 'unsure', label: 'Unsure' },
];

export const DRINKING_OPTIONS: SelectOption<DrinkingHabits>[] = [
  { value: 'never', label: 'Never' },
  { value: 'socially', label: 'Socially' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const SMOKING_OPTIONS: SelectOption<SmokingHabits>[] = [
  { value: 'never', label: 'Never' },
  { value: 'socially', label: 'Socially' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const WORKOUT_OPTIONS: SelectOption<WorkoutFrequency>[] = [
  { value: 'rarely', label: 'Rarely' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'very-active', label: 'Very active' },
];

export const PET_OPTIONS: SelectOption<PetPreference>[] = [
  { value: 'have-dogs', label: 'Have dogs' },
  { value: 'have-cats', label: 'Have cats' },
  { value: 'have-other', label: 'Have other pets' },
  { value: 'dont-have', label: "Don't have pets" },
  { value: 'allergic', label: 'Allergic to pets' },
];

export const RELIGION_OPTIONS: SelectOption<Religion>[] = [
  { value: 'christian', label: 'Christian' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'jewish', label: 'Jewish' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'atheist', label: 'Atheist' },
  { value: 'agnostic', label: 'Agnostic' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Arabic',
  'Portuguese',
  'Japanese',
  'Korean',
] as const;

export const INTERESTED_IN_OPTIONS: SelectOption<ProfileGender>[] =
  GENDER_OPTIONS.map(g => ({ value: g.id as ProfileGender, label: g.label }));

export const DEFAULT_MY_PROFILE: UserProfile = {
  id: 'me',
  name: 'Jordan',
  email: 'you@zingle.app',
  age: 27,
  gender: 'male',
  interestedIn: ['female'],
  height: 178,
  profession: 'Product Designer',
  company: 'Zingle',
  education: 'bachelor',
  location: {
    latitude: 0,
    longitude: 0,
    city: 'Mumbai, India',
  },
  bio: 'Coffee dates, live music, and spontaneous road trips. Always up for something new.',
  languages: ['English', 'Hindi'],
  drinking: 'socially',
  smoking: 'never',
  pets: 'dont-have',
  workout: 'regularly',
  lookingFor: 'relationship',
  relationshipGoals: ['long-term'],
  interests: ['Travel', 'Music', 'Photography', 'Coffee'],
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop',
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  verified: false,
  online: true,
};

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c006ae7f?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
];

export const MOCK_PHOTO_URI = PLACEHOLDER_PHOTOS[0];

export function buildProfileFromOnboarding(
  data: OnboardingData,
  existing?: UserProfile,
): UserProfile {
  const base = existing ?? DEFAULT_MY_PROFILE;
  const now = new Date().toISOString();
  const photos =
    data.photos && data.photos.length > 0 ? data.photos : base.photos;

  return {
    ...base,
    name: data.name?.trim() || base.name,
    age: data.age ?? base.age,
    gender: data.gender ?? base.gender,
    interestedIn: data.interestedIn ?? base.interestedIn,
    height: data.height ?? base.height,
    profession: data.profession ?? base.profession,
    company: data.company ?? base.company,
    education: data.education ?? base.education,
    location: data.location ?? base.location,
    bio: data.bio ?? base.bio,
    languages: data.languages ?? base.languages,
    religion: data.religion ?? base.religion,
    drinking: data.drinking ?? base.drinking,
    smoking: data.smoking ?? base.smoking,
    pets: data.pets ?? base.pets,
    workout: data.workout ?? base.workout,
    lookingFor: data.lookingFor ?? base.lookingFor,
    relationshipGoals: data.relationshipGoals ?? base.relationshipGoals,
    interests: data.interests ?? base.interests,
    photos,
    updatedAt: now,
  };
}

export function profileToOnboardingData(
  profile: UserProfile,
): Partial<OnboardingData> {
  return {
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    interestedIn: profile.interestedIn,
    height: profile.height,
    profession: profile.profession,
    company: profile.company,
    education: profile.education,
    location: profile.location,
    bio: profile.bio,
    languages: profile.languages,
    religion: profile.religion,
    drinking: profile.drinking,
    smoking: profile.smoking,
    pets: profile.pets,
    workout: profile.workout,
    lookingFor: profile.lookingFor,
    relationshipGoals: profile.relationshipGoals,
    interests: profile.interests,
    photos: profile.photos,
  };
}

interface CompletionItem {
  label: string;
  done: boolean;
  weight: number;
}

export function getProfileCompletionItems(
  profile: UserProfile,
): CompletionItem[] {
  return [
    {
      label: 'Add photos',
      done: profile.photos.length >= 1,
      weight: 20,
    },
    {
      label: 'Add 3+ photos',
      done: profile.photos.length >= 3,
      weight: 10,
    },
    {
      label: 'Write a bio',
      done: Boolean(profile.bio && profile.bio.length >= 20),
      weight: 15,
    },
    {
      label: 'Add interests',
      done: (profile.interests?.length ?? 0) >= 3,
      weight: 15,
    },
    {
      label: 'Set location',
      done: Boolean(profile.location?.city),
      weight: 10,
    },
    {
      label: 'Add height',
      done: Boolean(profile.height),
      weight: 10,
    },
    {
      label: 'Add job',
      done: Boolean(profile.profession?.trim()),
      weight: 10,
    },
    {
      label: 'Verify profile (Coming Soon)',
      done: true,
      weight: 10,
    },
  ];
}

export function getProfileCompletionPercent(profile: UserProfile): number {
  const items = getProfileCompletionItems(profile);
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const earned = items
    .filter(item => item.done)
    .reduce((sum, item) => sum + item.weight, 0);
  return Math.min(100, Math.round((earned / total) * 100));
}

export function getMissingProfileTips(profile: UserProfile): string[] {
  return getProfileCompletionItems(profile)
    .filter(item => !item.done)
    .map(item => item.label);
}

export function formatGenderLabel(gender?: string): string {
  const match = GENDER_OPTIONS.find(g => g.id === gender);
  if (match) return match.label;
  if (!gender) return 'Add gender';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export function formatEducationLabel(education?: string): string {
  if (!education) return 'Add education';
  const match = EDUCATION_OPTIONS.find(o => o.value === education);
  return match?.label ?? education;
}

export function formatHabitLabel(value?: string): string {
  if (!value) return 'Add';
  const allOptions = [
    ...DRINKING_OPTIONS,
    ...SMOKING_OPTIONS,
    ...WORKOUT_OPTIONS,
    ...PET_OPTIONS,
    ...RELIGION_OPTIONS,
  ];
  const match = allOptions.find(o => o.value === value);
  if (match) return match.label;
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatLookingFor(value?: string): string {
  if (!value) return 'Add';
  const match = LOOKING_FOR_OPTIONS.find(o => o.value === value);
  return match?.label ?? formatHabitLabel(value);
}

export function formatRelationshipGoals(goals?: RelationshipGoal[]): string {
  if (!goals?.length) return 'Add';
  return goals
    .map(
      g =>
        RELATIONSHIP_GOAL_OPTIONS.find(o => o.value === g)?.label ??
        formatHabitLabel(g),
    )
    .join(', ');
}

export function formatInterestedIn(genders?: ProfileGender[]): string {
  if (!genders?.length) return 'Add';
  return genders.map(g => formatGenderLabel(g)).join(', ');
}

export function formatLanguages(languages?: string[]): string {
  if (!languages?.length) return 'Add';
  return languages.join(', ');
}

export function formatReligion(religion?: string): string {
  if (!religion) return 'Add';
  const match = RELIGION_OPTIONS.find(o => o.value === religion);
  return match?.label ?? formatHabitLabel(religion);
}

export interface VerificationRequirement {
  id: string;
  label: string;
  done: boolean;
}

export function getVerificationRequirements(
  profile: UserProfile,
): VerificationRequirement[] {
  return [
    {
      id: 'photo',
      label: 'Add a profile photo',
      done: profile.photos.length >= 1,
    },
    {
      id: 'photos',
      label: 'Add at least 2 photos',
      done: profile.photos.length >= 2,
    },
    {
      id: 'bio',
      label: 'Write a bio (20+ characters)',
      done: Boolean(profile.bio && profile.bio.length >= 20),
    },
  ];
}

export function canSubmitVerification(profile: UserProfile): boolean {
  return getVerificationRequirements(profile).every(r => r.done);
}

export function formatHeightDisplay(
  height?: number,
  unit: 'cm' | 'ft' = 'cm',
): string {
  if (!height) return 'Add height';
  return formatHeight(height, unit);
}

export function getNextPhotoPlaceholder(index: number): string {
  return PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length];
}
