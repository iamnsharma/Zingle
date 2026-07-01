export type ProfileGender = 'male' | 'female' | 'non-binary' | 'other';

export type LookingFor = 'dating' | 'relationship' | 'friendship' | 'hookup';

export type RelationshipGoal = 'marriage' | 'long-term' | 'casual' | 'unsure';

export type EducationLevel = 'high-school' | 'bachelor' | 'master' | 'phd' | 'other';

export type DrinkingHabits = 'never' | 'socially' | 'regularly' | 'prefer-not-to-say';

export type SmokingHabits = 'never' | 'socially' | 'regularly' | 'prefer-not-to-say';

export type PetPreference = 'have-dogs' | 'have-cats' | 'have-other' | 'dont-have' | 'allergic';

export type WorkoutFrequency = 'rarely' | 'sometimes' | 'regularly' | 'very-active';

export type Religion = 
  | 'christian'
  | 'muslim'
  | 'jewish'
  | 'hindu'
  | 'buddhist'
  | 'atheist'
  | 'agnostic'
  | 'spiritual'
  | 'other'
  | 'prefer-not-to-say';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: ProfileGender;
  interestedIn: ProfileGender[];
  height?: number;
  profession?: string;
  company?: string;
  education?: EducationLevel;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
  bio?: string;
  languages?: string[];
  religion?: Religion;
  drinking?: DrinkingHabits;
  smoking?: SmokingHabits;
  pets?: PetPreference;
  workout?: WorkoutFrequency;
  lookingFor?: LookingFor;
  relationshipGoals?: RelationshipGoal[];
  interests?: string[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  online: boolean;
  lastSeen?: string;
}

export interface OnboardingData {
  name?: string;
  birthDate?: string;
  age?: number;
  gender?: ProfileGender;
  interestedIn?: ProfileGender[];
  height?: number;
  heightUnit?: 'cm' | 'ft';
  profession?: string;
  company?: string;
  education?: EducationLevel;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
  bio?: string;
  languages?: string[];
  religion?: Religion;
  drinking?: DrinkingHabits;
  smoking?: SmokingHabits;
  pets?: PetPreference;
  workout?: WorkoutFrequency;
  lookingFor?: LookingFor;
  relationshipGoals?: RelationshipGoal[];
  interests?: string[];
  photos?: string[];
}
