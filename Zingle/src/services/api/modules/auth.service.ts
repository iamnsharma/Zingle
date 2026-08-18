import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, IUser } from '@types';
import { useAuthStore } from '@stores';

const USERS_KEY = 'zingle-mock-users';
const NETWORK_DELAY_MS = 450;

type MockUser = IUser & { password: string };

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const DEMO_USER: MockUser = {
  id: 'demo-user',
  email: 'demo@example.com',
  password: 'password123',
  displayName: 'Demo',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const delay = () => new Promise<void>(resolve => setTimeout(resolve, NETWORK_DELAY_MS));

const toPublicUser = (user: MockUser): IUser => {
  const { password: _password, ...publicUser } = user;
  return publicUser;
};

const saveUsers = async (users: MockUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getUsers = async (): Promise<MockUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) {
    await saveUsers([DEMO_USER]);
    return [DEMO_USER];
  }
  return JSON.parse(raw) as MockUser[];
};

const findByEmail = (users: MockUser[], email: string) =>
  users.find(user => user.email.toLowerCase() === email.trim().toLowerCase());

const issueToken = (userId: string) => `mock-token-${userId}-${Date.now()}`;

export const authService = {
  async signup(
    email: string,
    password: string,
    displayName: string,
  ): Promise<AuthResponse> {
    await delay();
    const users = await getUsers();
    if (findByEmail(users, email)) {
      throw new AuthError('An account with this email already exists');
    }

    const now = new Date().toISOString();
    const user: MockUser = {
      id: `user-${Date.now()}`,
      email: email.trim().toLowerCase(),
      password,
      displayName: displayName.trim(),
      createdAt: now,
      updatedAt: now,
    };

    await saveUsers([...users, user]);

    return {
      user: toPublicUser(user),
      token: issueToken(user.id),
      refreshToken: `mock-refresh-${user.id}`,
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    await delay();
    const users = await getUsers();
    const user = findByEmail(users, email);

    if (!user || user.password !== password) {
      throw new AuthError('Incorrect email or password');
    }

    return {
      user: toPublicUser(user),
      token: issueToken(user.id),
      refreshToken: `mock-refresh-${user.id}`,
    };
  },

  async forgotPassword(email: string): Promise<{ ok: true }> {
    await delay();
    void email;
    return { ok: true };
  },

  async logout(): Promise<void> {
    await delay();
  },

  async deleteAccount(): Promise<void> {
    await delay();
    const current = useAuthStore.getState().user;
    if (!current) {
      throw new AuthError('You need to be signed in to delete your account');
    }

    const users = await getUsers();
    await saveUsers(users.filter(user => user.id !== current.id));
  },

  async getCurrentUser(): Promise<IUser | null> {
    return useAuthStore.getState().user;
  },
};
