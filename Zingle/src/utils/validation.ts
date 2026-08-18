const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;
export const MIN_NAME_LENGTH = 2;

export const isValidEmail = (value: string): boolean =>
  EMAIL_PATTERN.test(value.trim().toLowerCase());

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Enter a valid email address';
  return undefined;
};

export const validatePassword = (
  value: string,
  { requireStrength = false } = {},
): string | undefined => {
  if (!value) return 'Password is required';
  if (requireStrength && value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return undefined;
};

export const validateName = (value: string): string | undefined => {
  const name = value.trim();
  if (!name) return 'Name is required';
  if (name.length < MIN_NAME_LENGTH) return 'Enter at least 2 characters';
  return undefined;
};
