/** Popular cities for onboarding location picker */
export const POPULAR_CITIES = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'San Francisco, CA',
  'Columbus, OH',
  'Fort Worth, TX',
  'Indianapolis, IN',
  'Charlotte, NC',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC',
  'Boston, MA',
  'Nashville, TN',
  'Miami, FL',
  'London, UK',
  'Paris, France',
  'Berlin, Germany',
  'Toronto, Canada',
  'Sydney, Australia',
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'Singapore',
  'Dubai, UAE',
  'Tokyo, Japan',
] as const;

export type HeightUnit = 'cm' | 'ft';

export const CM_MIN = 120;
export const CM_MAX = 220;
export const AGE_MIN = 18;
export const AGE_MAX = 80;

export const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = Math.round(cm / 2.54);
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
};

export const feetInchesToCm = (feet: number, inches: number): number =>
  Math.round((feet * 12 + inches) * 2.54);

export const formatHeight = (cm: number, unit: HeightUnit): string => {
  if (!cm) return '';
  if (unit === 'cm') return `${cm} cm`;
  const { feet, inches } = cmToFeetInches(cm);
  return `${feet}'${inches}"`;
};
