export const INTERESTS = [
  'Travel',
  'Gym',
  'Coding',
  'Movies',
  'Music',
  'Cricket',
  'Football',
  'Reading',
  'Gaming',
  'Photography',
  'Cooking',
  'Art',
  'Yoga',
  'Business',
  'Startups',
  'AI',
  'Technology',
  'Fashion',
  'Sports',
  'Hobbies',
] as const;

export type InterestName = (typeof INTERESTS)[number];

export const INTEREST_ICONS: Record<InterestName, string> = {
  Travel: 'airplane',
  Gym: 'dumbbell',
  Coding: 'code-tags',
  Movies: 'movie-open',
  Music: 'music-note',
  Cricket: 'cricket',
  Football: 'soccer',
  Reading: 'book-open-variant',
  Gaming: 'gamepad-variant',
  Photography: 'camera',
  Cooking: 'chef-hat',
  Art: 'palette',
  Yoga: 'yoga',
  Business: 'briefcase-outline',
  Startups: 'rocket-launch-outline',
  AI: 'robot-outline',
  Technology: 'laptop',
  Fashion: 'hanger',
  Sports: 'basketball',
  Hobbies: 'star-four-points-outline',
};

export const GENDER_OPTIONS = [
  { id: 'male', label: 'Man', icon: 'gender-male' },
  { id: 'female', label: 'Woman', icon: 'gender-female' },
  { id: 'non-binary', label: 'Non-binary', icon: 'gender-non-binary' },
  { id: 'other', label: 'More', icon: 'dots-horizontal' },
] as const;

export const MIN_INTERESTS = 3;

export const EDUCATION_LEVELS = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Other',
];

export const RELIGIONS = [
  'Christian',
  'Muslim',
  'Jewish',
  'Hindu',
  'Buddhist',
  'Atheist',
  'Agnostic',
  'Spiritual',
  'Other',
  'Prefer not to say',
];

export const DRINKING_HABITS = [
  'Never',
  'Socially',
  'Regularly',
  'Prefer not to say',
];

export const SMOKING_HABITS = [
  'Never',
  'Socially',
  'Regularly',
  'Prefer not to say',
];

export const PET_PREFERENCES = [
  'Have dogs',
  'Have cats',
  'Have other pets',
  'Don\'t have pets',
  'Allergic to pets',
];

export const WORKOUT_FREQUENCIES = [
  'Rarely',
  'Sometimes',
  'Regularly',
  'Very active',
];

export const RELATIONSHIP_GOALS = [
  'Marriage',
  'Long-term relationship',
  'Casual dating',
  'Unsure',
];

export const LOOKING_FOR = [
  'Dating',
  'Serious relationship',
  'Friendship',
  'Hookup',
];

// Simplified onboarding: 7 core steps
export const TOTAL_ONBOARDING_STEPS = 7;

export const ONBOARDING_STEPS = [
  { step: 1, title: 'Basic Info', subtitle: 'Name & Age' },
  { step: 2, title: 'About You', subtitle: 'Height & Gender' },
  { step: 3, title: 'Tell Us More', subtitle: 'Your bio' },
  { step: 4, title: 'Interests', subtitle: 'What you love' },
  { step: 5, title: 'Photos', subtitle: 'Show your best side' },
  { step: 6, title: 'Location', subtitle: 'Where you are' },
  { step: 7, title: 'Review', subtitle: 'Confirm your profile' },
] as const;
