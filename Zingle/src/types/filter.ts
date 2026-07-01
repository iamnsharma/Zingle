export enum FilterType {
  DISTANCE = 'distance',
  AGE = 'age',
  HEIGHT = 'height',
  EDUCATION = 'education',
  PROFESSION = 'profession',
  INTERESTS = 'interests',
  LANGUAGES = 'languages',
  RELATIONSHIP_GOALS = 'relationshipGoals',
  SMOKING = 'smoking',
  DRINKING = 'drinking',
  VERIFIED_ONLY = 'verifiedOnly',
  HAS_BIO = 'hasBio',
  ONLINE_NOW = 'onlineNow',
  RECENTLY_ACTIVE = 'recentlyActive',
}

export interface FilterOptions {
  distanceMin?: number;
  distanceMax?: number;
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  educations?: string[];
  professions?: string[];
  interests?: string[];
  languages?: string[];
  relationshipGoals?: string[];
  smoking?: string[];
  drinking?: string[];
  verifiedOnly?: boolean;
  hasBio?: boolean;
  onlineNow?: boolean;
  recentlyActive?: boolean;
}
