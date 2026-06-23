# 🏗️ ZINGLE - Architecture & Design Patterns

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Atomic Design System](#atomic-design-system)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Navigation Structure](#navigation-structure)
6. [API Layer](#api-layer)
7. [Design Patterns](#design-patterns)

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────┐
│         UI Layer (Screens)          │  ← User Interface
├─────────────────────────────────────┤
│    Component Layer (Atoms/Molecules)│  ← Reusable Components
├─────────────────────────────────────┤
│      State Management (Zustand)     │  ← Global State
├─────────────────────────────────────┤
│      Services Layer (API/Auth)      │  ← Business Logic
├─────────────────────────────────────┤
│      Data Layer (AsyncStorage)      │  ← Persistence
└─────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Reusability** - Components are built to be reused
3. **Testability** - Each layer can be tested independently
4. **Maintainability** - Clear structure, easy to navigate
5. **Scalability** - Easy to add new features without breaking existing code

---

## Atomic Design System

### Component Hierarchy

```
Atoms (Smallest)
    ↓ (combine into)
Molecules
    ↓ (combine into)
Organisms
    ↓ (combine into)
Screens (Largest)
```

### 1. Atoms - Basic Building Blocks

Simplest, most reusable components. Cannot be broken down further.

```typescript
// ✅ Atoms (standalone)
<BaseButton />
<BaseText />
<BaseInput />
<Icon />
<Avatar />
<Badge />
```

**Characteristics:**
- Single purpose
- No dependencies on other components
- Highly reusable
- Accept props for customization
- No business logic

**Example:**
```typescript
interface BaseButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}
```

### 2. Molecules - Combinations of Atoms

Simple groups of atoms bonded together.

```typescript
// ✅ Molecules (combinations)
<FormField label="Email" error={error} />
<Card header="Title" footer="Footer" />
<ListItem icon={icon} title="Title" subtitle="Subtitle" />
<SearchBar placeholder="Search..." />
```

**Characteristics:**
- Combine 2+ atoms
- Start to have identity
- Still highly reusable
- Might have simple state
- Limited business logic

**Example:**
```typescript
const FormField: React.FC<FormFieldProps> = ({ label, value, onChange, error }) => (
  <View>
    {label && <BaseText variant="label">{label}</BaseText>}
    <BaseInput value={value} onChangeText={onChange} />
    {error && <BaseText color={theme.colors.error}>{error}</BaseText>}
  </View>
);
```

### 3. Organisms - Complex UI Sections

Complex UI sections combining multiple molecules.

```typescript
// ✅ Organisms (complex sections)
<ProfileHeader />
<SwipeCard />
<ChatBubble />
<Header />
<Footer />
<Sidebar />
```

**Characteristics:**
- Combine molecules and/or atoms
- Complex interactions
- Page-level or major sections
- May contain business logic
- Usually have internal state

**Example:**
```typescript
const SwipeCard: React.FC<SwipeCardProps> = ({ profile }) => {
  const { theme } = useThemeStore();
  const [swiped, setSwiped] = useState(false);

  const handleLike = () => {
    // Business logic
  };

  return (
    <View style={{ flex: 1 }}>
      <ProfileImage src={profile.image} />
      <ProfileInfo name={profile.name} bio={profile.bio} />
      <ActionButtons onLike={handleLike} />
    </View>
  );
};
```

### 4. Screens - Full Pages

Complete page views combining organisms.

```typescript
// ✅ Screens
<HomeScreen />
<ProfileScreen />
<ChatScreen />
<DiscoverScreen />
```

**Characteristics:**
- Combine organisms and molecules
- Full page/route
- Heavy business logic
- Connected to global state
- API calls and data fetching

---

## Data Flow

### Unidirectional Data Flow

```
┌──────────────┐
│   Screen     │
└───────┬──────┘
        │ (reads from)
        ↓
┌──────────────┐
│ Zustand Store│  ← Global State (authStore, themeStore)
└───────┬──────┘
        │ (updates via)
        ↓
┌──────────────┐
│   Services   │  ← API calls, business logic
└───────┬──────┘
        │ (fetches from)
        ↓
┌──────────────┐
│  Supabase    │  ← Backend
└──────────────┘
```

### Component Data Flow

```
Parent Component
    ↓ (passes props)
Child Component
    ↓ (reads props)
Displays UI
    ↓ (user interaction)
Calls callback
    ↓ (bubbles up)
Parent state updates
```

### Example: Login Flow

```typescript
// 1. User enters email/password in LoginScreen
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// 2. User presses Login button
<BaseButton onPress={handleLogin} />

// 3. Component calls authService
const handleLogin = async () => {
  const { user, token } = await authService.login(email, password);
  // ...
};

// 4. Service makes API call to Supabase
export const authService = {
  async login(email, password) {
    return await apiClient.post('/auth/login', { email, password });
  }
};

// 5. Response updates Zustand store
const { login } = useAuthStore();
login(user, token);

// 6. App detects authenticated user
const { isAuthenticated } = useAuthStore();
if (isAuthenticated) {
  // Navigate to main app
}
```

---

## State Management

### Zustand Stores

Global state is managed using Zustand stores, one per domain:

#### Auth Store
```typescript
interface AuthStoreState {
  authStatus: AuthStatus;
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  // State
  authStatus: AuthStatus.IDLE,
  user: null,
  token: null,
  isAuthenticated: false,
  
  // Actions
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false })
}));
```

#### Theme Store
```typescript
interface ThemeStoreState {
  isDark: boolean;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => set((state) => ({
    isDark: !state.isDark,
    theme: !state.isDark ? darkTheme : lightTheme
  })),
  setTheme: (isDark) => set({
    isDark,
    theme: isDark ? darkTheme : lightTheme
  })
}));
```

### Local Component State

Use React hooks for component-specific state:

```typescript
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({ email: '', password: '' });
const [error, setError] = useState<string | null>(null);
```

### React Query for Server State

Use React Query for data fetching and caching:

```typescript
const { data, isLoading, error } = useQuery(
  ['profiles', userId],
  () => profileService.getProfiles(userId),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);
```

---

## Navigation Structure

### Root Navigator

```
RootNavigator
├── AuthStack (isAuthenticated === false)
│   ├── Landing
│   ├── Login
│   ├── Signup
│   └── ResetPassword
│
└── MainAppStack (isAuthenticated === true)
    ├── BottomTabNavigator
    │   ├── Home (Tab)
    │   ├── Discover (Tab)
    │   ├── Favorites (Tab)
    │   └── Profile (Tab)
    │
    └── Modal Screens
        ├── ProfileDetail
        ├── Chat
        └── MatchedProfiles
```

### Navigation State Management

```typescript
// Determine which stack to show
export const RootNavigator = () => {
  const { isAuthenticated, authStatus } = useAuthStore();

  // Show loading while checking auth
  if (authStatus === 'IDLE') {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="MainAppStack" component={MainAppStack} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## API Layer

### Service-Based Architecture

```
Component
    ↓
useQuery (React Query)
    ↓
Service Layer (authService, profileService)
    ↓
API Client (fetch-based)
    ↓
Supabase
```

### API Client

```typescript
class ApiClient {
  constructor(baseURL: string, timeout: number = 30000) { }

  async get<T>(endpoint: string): Promise<ApiResponse<T>>
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  async delete<T>(endpoint: string): Promise<ApiResponse<T>>
}
```

### Service Layer

```typescript
export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }
};

export const profileService = {
  async getProfiles(limit: number = 20) {
    const response = await apiClient.get(`/profiles?limit=${limit}`);
    return response.data;
  }
};
```

### Usage in Components

```typescript
// ✅ With React Query
const { data: profiles, isLoading } = useQuery(
  ['profiles'],
  () => profileService.getProfiles()
);

// ✅ Direct API call with error handling
const handleLogin = async () => {
  try {
    const response = await authService.login(email, password);
    const { login } = useAuthStore();
    login(response.user, response.token);
  } catch (error) {
    setError(error.message);
  }
};
```

---

## Design Patterns

### 1. Container & Presentational Pattern

**Container** - Handles logic & state
```typescript
const HomeContainer = () => {
  const { profiles, isLoading } = useQuery(['profiles'], getProfiles);
  const handleLike = (profileId) => { /* logic */ };

  return (
    <HomePresentation
      profiles={profiles}
      isLoading={isLoading}
      onLike={handleLike}
    />
  );
};
```

**Presentational** - Renders UI
```typescript
interface HomePresentationProps {
  profiles: Profile[];
  isLoading: boolean;
  onLike: (id: string) => void;
}

const HomePresentation: React.FC<HomePresentationProps> = ({
  profiles,
  isLoading,
  onLike
}) => (
  <ScrollView>
    {profiles.map(profile => (
      <SwipeCard
        key={profile.id}
        profile={profile}
        onLike={() => onLike(profile.id)}
      />
    ))}
  </ScrollView>
);
```

### 2. Render Props Pattern

```typescript
<ThemeProvider>
  {({ theme, isDark, toggleTheme }) => (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* Content */}
    </View>
  )}
</ThemeProvider>
```

### 3. Custom Hooks Pattern

```typescript
const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      login(response.user, response.token);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isAuthenticated, handleLogin, logout, isLoading };
};

// Usage
const LoginScreen = () => {
  const { handleLogin, isLoading } = useAuth();
  // ...
};
```

### 4. Higher-Order Component Pattern

```typescript
const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: AppTheme }>
) => {
  return (props: P) => {
    const { theme } = useThemeStore();
    return <Component {...props} theme={theme} />;
  };
};

// Usage
export const ThemedCard = withTheme(Card);
```

### 5. Composition Pattern

```typescript
<Screen>
  <Header title="Discover" />
  <ScrollView>
    {profiles.map(profile => (
      <SwipeCard key={profile.id} profile={profile} />
    ))}
  </ScrollView>
  <Footer>
    <ActionButtons />
  </Footer>
</Screen>
```

---

## Performance Optimization

### 1. Memoization

```typescript
// Prevent unnecessary re-renders
const SwipeCard = React.memo(({ profile, onLike }) => (
  // Component
), (prevProps, nextProps) => {
  return prevProps.profile.id === nextProps.profile.id;
});
```

### 2. Code Splitting

```typescript
// Lazy load screens
const HomeScreen = lazy(() => import('@screens/Home'));
const ProfileScreen = lazy(() => import('@screens/Profile'));

<Suspense fallback={<LoadingScreen />}>
  <HomeScreen />
</Suspense>
```

### 3. Image Optimization

```typescript
<FastImage
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 300 }}
  resizeMode="cover"
/>
```

### 4. FlatList vs ScrollView

```typescript
// ✅ Use FlatList for long lists
<FlatList
  data={profiles}
  renderItem={({ item }) => <SwipeCard profile={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
/>

// ✅ Use ScrollView for short content
<ScrollView>
  {profiles.map(profile => (
    <SwipeCard key={profile.id} profile={profile} />
  ))}
</ScrollView>
```

---

## Error Handling

### Global Error Handler

```typescript
// Create error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
    console.error(error, errorInfo);
    // Show error UI
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```typescript
const handleLogin = async () => {
  try {
    const response = await authService.login(email, password);
    login(response.user, response.token);
  } catch (error) {
    if (error instanceof NetworkError) {
      setError('Network connection failed');
    } else if (error instanceof ValidationError) {
      setError(error.message);
    } else {
      setError('Something went wrong');
    }
  }
};
```

---

## Testing Strategy

### Unit Tests (Components)
```typescript
describe('BaseButton', () => {
  it('renders with correct label', () => {
    const { getByText } = render(<BaseButton label="Click" />);
    expect(getByText('Click')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <BaseButton label="Click" onPress={onPress} testID="button" />
    );
    fireEvent.press(getByTestId('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Tests (Screens)
```typescript
describe('LoginScreen', () => {
  it('logs in user with valid credentials', async () => {
    // Mock services
    // Render screen
    // Enter credentials
    // Press login
    // Assert auth state changed
  });
});
```

### E2E Tests (User Flows)
```typescript
describe('User Login Flow', () => {
  it('should login and navigate to home', async () => {
    // Start app
    // Navigate to login
    // Enter credentials
    // Submit
    // Verify home screen visible
  });
});
```

---

## Deployment Flow

```
Local Development
    ↓
Feature Branch
    ↓ (push)
GitHub
    ↓ (CI/CD)
Lint & Tests
    ↓
Build APK/Bundle
    ↓
TestFlight/PlayStore Beta
    ↓
Production Release
```

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Bundle Size | < 50MB |
| First Load | < 3s |
| App Size | < 100MB |
| Type Safety | 100% |
| Test Coverage | > 70% |
| Performance Score | > 90 |
| Accessibility Score | > 95 |

---

**Last Updated**: June 23, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
