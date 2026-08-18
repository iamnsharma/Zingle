import type { IUser } from '@types';

export const buildLocalUser = (email: string, displayName: string): IUser => {
  const now = new Date().toISOString();
  return {
    id: 'local-user',
    email: email.trim().toLowerCase(),
    displayName: displayName.trim(),
    createdAt: now,
    updatedAt: now,
  };
};
