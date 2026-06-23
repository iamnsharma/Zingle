# 🎯 ZINGLE - Project Documentation

## 📱 Project Overview

**Zingle** is a modern, scalable React Native dating application inspired by Tinder, Bumble, and Shaadi.com. The project is built with production-ready architecture following best practices, clean code principles, and an atomic component design system.

### Project Vision
Create a feature-rich dating platform with:
- Intuitive user interface
- Smooth swipe interactions (Like, Pass, Super Like)
- Real-time messaging
- Match notifications
- User profile management
- Discovery algorithm

### Platform Support
- **Primary**: Android (currently configured)
- **Secondary**: iOS (future support)
- **Backend**: Supabase (PostgreSQL + Auth)

### Tech Stack
- **Frontend**: React Native 0.81.0 + TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation 7
- **UI Components**: React Native Paper (Material Design 3)
- **Data Fetching**: React Query (TanStack Query)
- **Storage**: AsyncStorage
- **Internationalization**: i18next
- **Build**: Gradle (Android), XCode (iOS)

---

## 📐 Project Structure

```
Zingle/
├── App.tsx                              # Root app component with providers
├── index.js                             # React Native entry point
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── babel.config.js                      # Babel with 15 path aliases
├── metro.config.js                      # Metro bundler config
│
├── src/                                 # Source code
│   ├── components/                      # Reusable components (Atomic Design)
│   │   ├── atoms/                       # Basic building blocks
│   │   │   ├── BaseButton/
│   │   │   ├── BaseText/
│   │   │   ├── BaseInput/
│   │   │   └── index.ts
│   │   ├── molecules/                   # Combinations of atoms
│   │   ├── organisms/                   # Complex UI sections
│   │   └── index.ts
│   │
│   ├── screens/                         # Screen components (Pages)
│   │   ├── Auth/
│   │   │   ├── LoginScreen
│   │   │   ├── SignupScreen
│   │   │   ├── LandingScreen
│   │   │   └── index.tsx
│   │   ├── Home/
│   │   ├── Profile/
│   │   └── index.ts
│   │
│   ├── navigation/                      # Navigation stacks & config
│   │   ├── RootNavigator/               # Main navigation entry
│   │   ├── AuthStack/                   # Auth flow navigation
│   │   ├── MainAppStack/                # App flow navigation
│   │   ├── BottomTabNavigator/          # Tab navigation
│   │   └── index.ts
│   │
│   ├── services/                        # API & external services
│   │   ├── api/
│   │   │   ├── clients/
│   │   │   │   └── client.ts            # Fetch-based HTTP client
│   │   │   ├── modules/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── profile.service.ts
│   │   │   │   └── match.service.ts
│   │   │   ├── endpoints.ts             # API endpoint constants
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── stores/                          # Zustand state management
│   │   ├── authStore.ts                 # Auth state (user, token, login)
│   │   ├── themeStore.ts                # Theme state (light/dark mode)
│   │   ├── profileStore.ts              # Profile state
│   │   └── index.ts
│   │
│   ├── styling/                         # Design system & theme
│   │   ├── globalStyles/
│   │   │   ├── colors.ts                # Color palette (100+ colors)
│   │   │   ├── theme.ts                 # Light & Dark themes
│   │   │   ├── typography.ts            # Text variants & sizes
│   │   │   └── index.ts
│   │   ├── metrics.ts                   # Spacing, radius, shadows
│   │   ├── COLORS_REFERENCE.md
│   │   └── README.md
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── index.ts
│   │
│   ├── utils/                           # Utility functions
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── index.ts
│   │
│   ├── constants/                       # App constants
│   │   ├── common.ts
│   │   ├── errors.ts
│   │   └── index.ts
│   │
│   ├── config/                          # Configuration
│   │   ├── env.ts                       # Environment variables
│   │   ├── supabase.ts                  # Supabase client
│   │   └── index.ts
│   │
│   ├── lang/                            # Internationalization
│   │   ├── i18n.ts                      # i18n setup
│   │   ├── locales/
│   │   │   ├── en.json                  # English translations
│   │   │   ├── es.json                  # Spanish translations
│   │   │   └── fr.json                  # French translations
│   │   └── index.ts
│   │
│   ├── types/                           # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── navigation.ts
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── domain.ts
│   │
│   ├── assets/                          # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   └── context/                         # React Context (if needed)
│       └── index.ts
│
├── android/                             # Android native code
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/zingle/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
│
├── ios/                                 # iOS native code (future)
│
├── __tests__/                           # Test files
│   ├── components/
│   ├── services/
│   └── utils/
│
└── docs/                                # Documentation
    ├── SETUP_GUIDE.md
    ├── PROJECT_SUMMARY.md
    ├── ARCHITECTURE.md
    └── CONTRIBUTING.md
```

### Path Aliases

All imports use convenient aliases (configured in `babel.config.js`):

```typescript
import { BaseButton } from '@components/atoms';        // components
import { HomeScreen } from '@screens/Home';            // screens
import { RootNavigator } from '@navigation';           // navigation
import { useAuthStore } from '@stores';                // stores
import { metrics } from '@styling/metrics';            // styling
import { T } from '@lang';                             // i18n
import { ENV } from '@config/env';                     // config
import { useAuth } from '@hooks';                      // hooks
import { API_ENDPOINTS } from '@services/api';         // services
import { useThemeStore } from '@stores';               // stores
import { AppTheme } from '@styling/globalStyles/theme'; // types
```

---

## 🎨 Spacing & Layout System

### Abbreviations Reference

| Abbreviation | Full Form | Purpose |
|---|---|---|
| **VS** | Vertical Spacing | Gap between vertical elements (rows) |
| **HS** | Horizontal Spacing | Gap between horizontal elements (columns) |
| **MS** | Margin/Spacing | General margin/padding (can be both directions) |
| **WS** | Width Scale | Responsive width calculation |
| **HeS** | Height Scale | Responsive height calculation |

### Spacing Scale

All spacing values scale responsively based on device size (baseline: iPhone SE 375x667):

```typescript
metrics.spacing = {
  xs:   4px    // Extra small - minimal gaps
  sm:   8px    // Small - subtle spacing
  md:  12px    // Medium - standard spacing
  lg:  16px    // Large - comfortable spacing
  xl:  20px    // Extra large - emphasized spacing
  2xl: 24px    // 2x Large
  3xl: 32px    // 3x Large - section spacing
  4xl: 40px    // 4x Large - major sections
}
```

### Implementation Examples

#### Vertical Spacing (VS)
```typescript
// Spacing between vertically stacked elements
<View>
  <Text>Title</Text>
  <View style={{ height: metrics.spacing.lg }} />  {/* VS: lg */}
  <Text>Subtitle</Text>
</View>

// Or using margin
<View style={{ marginVertical: metrics.spacing.lg }}>
  {/* Content */}
</View>
```

#### Horizontal Spacing (HS)
```typescript
// Spacing between horizontally aligned elements
<View style={{ flexDirection: 'row' }}>
  <Icon />
  <View style={{ width: metrics.spacing.md }} />  {/* HS: md */}
  <Text>Label</Text>
</View>

// Or using margin
<View style={{ marginHorizontal: metrics.spacing.md }}>
  {/* Content */}
</View>
```

#### General Spacing (MS)
```typescript
// Padding inside containers
<View style={{ 
  padding: metrics.spacing.lg,  /* MS: lg */
  marginBottom: metrics.spacing.xl  /* MS: xl */
}}>
  {/* Content */}
</View>
```

---

## 📐 Responsive Scaling

### Screen-Aware Sizing

```typescript
// Horizontal scaling (width-based)
const scaledSize = metrics.horizontalScale(24);

// Vertical scaling (height-based)
const scaledHeight = metrics.verticalScale(300);

// Moderate scaling (balanced)
const scaledRadius = metrics.moderateScale(8);

// Device detection
if (metrics.isSmallDevice) {
  // iPhone SE layout
} else if (metrics.isLargeDevice) {
  // iPad layout
}
```

### Common Layout Patterns

#### Full-Width View with Horizontal Padding
```typescript
<View style={{
  width: '100%',
  paddingHorizontal: metrics.spacing.lg,  // HS: lg
  paddingVertical: metrics.spacing.xl     // VS: xl
}}>
  {/* Content */}
</View>
```

#### Card Layout with Gaps
```typescript
<View>
  {cards.map((card, index) => (
    <View
      key={index}
      style={{
        marginBottom: metrics.spacing['3xl'],  // VS: 3xl between cards
        paddingHorizontal: metrics.spacing.lg, // HS: lg inside cards
        paddingVertical: metrics.spacing.lg    // VS: lg inside cards
      }}
    >
      {/* Card content */}
    </View>
  ))}
</View>
```

#### Grid Layout with Gap
```typescript
<View style={{
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: metrics.spacing.md,  // Both HS & VS: md
}}>
  {items.map(item => (
    <View key={item.id} style={{ flex: 0.5 }}>
      {/* Item */}
    </View>
  ))}
</View>
```

---

## 🎯 Architecture Rules

### 1. **Component Organization (Atomic Design)**

```
Atoms           → Basic, reusable UI elements
                  (Button, Text, Input)

Molecules       → Combination of atoms
                  (Card, FormGroup, Header)

Organisms       → Complex sections combining molecules
                  (ProfileCard, MatchList, ChatBox)

Screens         → Full page components combining organisms
                  (HomeScreen, ProfileScreen)
```

### 2. **State Management Rules**

- ✅ Use **Zustand stores** for global state
- ✅ Keep stores focused and single-responsibility
- ✅ Use React hooks for local component state
- ✅ Never directly mutate store state

```typescript
// Good
const { isDark, toggleTheme } = useThemeStore();

// Bad
authStore.user = newUser;  // Direct mutation
```

### 3. **Navigation Structure**

```
RootNavigator
├── AuthStack (when not authenticated)
│   ├── Landing
│   ├── Login
│   ├── Signup
│   └── ResetPassword
└── MainAppStack (when authenticated)
    ├── BottomTabNavigator
    │   ├── Home (Tab)
    │   ├── Discover (Tab)
    │   ├── Favorites (Tab)
    │   └── Profile (Tab)
    └── Modal Screens
        ├── ProfileDetail
        ├── Chat
        └── MatchedProfiles
```

### 4. **Styling Rules**

- ✅ **Never hardcode colors** → Use `theme.colors` or `theme.custom`
- ✅ **Use semantic color names** → `primary`, `error`, `success`
- ✅ **Apply spacing via metrics** → `metrics.spacing.lg`
- ✅ **Extract complex styles** → Use `StyleSheet.create()`
- ✅ **Support light/dark modes** → Colors auto-switch

```typescript
// ✅ CORRECT
<View style={{
  backgroundColor: theme.colors.surface,
  padding: metrics.spacing.lg,
  borderRadius: metrics.radius.md
}}>

// ❌ WRONG
<View style={{
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 8
}}>
```

### 5. **Component Props Convention**

```typescript
// Button variants
<BaseButton variant="primary" />      // Main action
<BaseButton variant="secondary" />    // Secondary action
<BaseButton variant="outline" />      // Outlined button

// Button sizes
<BaseButton size="sm" />              // Small
<BaseButton size="md" />              // Medium (default)
<BaseButton size="lg" />              // Large

// Input variants
<BaseInput error="Email is required" />
<BaseInput label="Email" />
<BaseInput icon={<EmailIcon />} />

// Text variants
<BaseText variant="h1" />             // Heading 1
<BaseText variant="body" />           // Body text
<BaseText variant="bodySm" />         // Small text
```

### 6. **API Integration Rules**

- ✅ Use **service layer** for API calls
- ✅ Centralize endpoints in `endpoints.ts`
- ✅ Use React Query for caching & state
- ✅ Handle errors consistently

```typescript
// ✅ Service layer
export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }
};

// ✅ In component - use React Query
const { data, isLoading, error } = useQuery(['auth', email], 
  () => authService.login(email, password)
);
```

### 7. **TypeScript Conventions**

```typescript
// File naming
User.ts           // Type definitions file
UserService.ts    // Service file
useUser.ts        // Hook file
UserCard.tsx      // Component file

// Type naming
interface IUser { }    // Interface with I prefix
type UserStatus = 'active' | 'inactive'  // Type union
enum AuthStatus { IDLE, PENDING, SUCCESS }  // Enum
```

### 8. **Responsive Design Rules**

```typescript
// Mobile-first approach
const containerStyle = {
  width: '100%',
  paddingHorizontal: metrics.spacing.lg,
  marginVertical: metrics.spacing.xl
};

// Large device adjustments
if (metrics.isLargeDevice) {
  containerStyle.maxWidth = 800;
  containerStyle.alignSelf = 'center';
}
```

---

## 🎨 Design System

### Colors (Tinder-Inspired)
- **Primary**: #FF5864 (Tinder Red)
- **Secondary**: #0099FF (Tinder Blue)
- **Tertiary**: #FAB938 (Tinder Gold)
- **Success**: #10B981
- **Error**: #EF4444
- **Warning**: #F59E0B

### Typography

```typescript
textVariants = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 28, fontWeight: 'bold' },
  h3: { fontSize: 24, fontWeight: 'bold' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyMedium: { fontSize: 14, fontWeight: '500' },
  bodySm: { fontSize: 12, fontWeight: '400' },
  button: { fontSize: 14, fontWeight: '600' },
}
```

### Border Radius
```typescript
radius = {
  sm: 4px,
  md: 8px,
  lg: 12px,
  xl: 16px,
  full: 999px
}
```

---

## 📋 Naming Conventions

### Files
```
Components:   PascalCase.tsx    (UserCard.tsx)
Utilities:    camelCase.ts      (validateEmail.ts)
Services:     camelCase.ts      (authService.ts)
Stores:       camelCase.ts      (authStore.ts)
Hooks:        camelCase.ts      (useAuth.ts)
```

### Variables & Functions
```
const userName = 'John';                // camelCase
function handleUserLogin() { }          // camelCase with 'handle' prefix
const IS_PRODUCTION = true;             // CONSTANT_CASE
const userOptions = [1, 2, 3];          // Plural for arrays
```

### Constants
```
API_TIMEOUT = 30000
MAX_RETRIES = 3
DEFAULT_PAGE_SIZE = 20
ERROR_MESSAGES = { ... }
```

---

## ✅ Code Quality Standards

### ESLint & TypeScript
- ✅ **0 ESLint errors** (strict mode)
- ✅ **0 TypeScript errors** (noEmit)
- ✅ **All imports organized** (absolute paths with aliases)
- ✅ **No unused variables** (removed automatically)

### Best Practices
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID principles
- ✅ Atomic design pattern
- ✅ Single responsibility principle
- ✅ Type safety first

### Code Comments
```typescript
// ✅ Explain WHY not WHAT
// We use fetch instead of axios to reduce bundle size in React Native
const response = await fetch(url);

// ❌ Don't explain obvious code
// Get user data
const user = await fetchUser(id);
```

---

## 🚀 Development Workflow

### Starting Development
```bash
cd /Users/aman/Documents/Learning/Zingle

# Terminal 1: Start Metro bundler
yarn start

# Terminal 2: Build and run Android
yarn android
```

### Building for Release
```bash
# Android Release
yarn run android --mode release

# Generate APK
cd android && ./gradlew bundleRelease cd ..
```

### Code Quality Checks
```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Both
npm run lint && npx tsc --noEmit
```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/styling/metrics.ts` | Spacing, scaling, shadows |
| `src/styling/globalStyles/colors.ts` | Color palette (100+ colors) |
| `src/stores/themeStore.ts` | Light/Dark theme management |
| `src/navigation/RootNavigator/index.tsx` | Main navigation entry |
| `src/services/api/clients/client.ts` | Fetch-based HTTP client |
| `App.tsx` | Root component with providers |
| `package.json` | Dependencies & scripts |
| `babel.config.js` | Path aliases (15 total) |

---

## 🎯 Spacing Cheat Sheet

```
xs  (4px)    → Minimal gaps, hover states
sm  (8px)    → Small decorative spacing
md  (12px)   → Standard element spacing
lg  (16px)   → Comfortable padding, between sections
xl  (20px)   → Emphasized spacing, button height
2xl (24px)   → Large sections
3xl (32px)   → Section dividers
4xl (40px)   → Major layout spacing
```

### Common Patterns
```typescript
// Container padding
padding: metrics.spacing.lg

// Element margins
marginBottom: metrics.spacing.xl

// Gap between items
gap: metrics.spacing.md

// Card spacing
paddingHorizontal: metrics.spacing.lg
paddingVertical: metrics.spacing.lg
marginVertical: metrics.spacing['3xl']
```

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| Components | 3 (Atoms) |
| Screens | 3 (Auth, Home, Profile) |
| Colors | 100+ |
| Spacing Levels | 8 |
| Border Radiuses | 5 |
| TypeScript Files | 40+ |
| Path Aliases | 15 |
| Linter Errors | 0 ✅ |
| TypeScript Errors | 0 ✅ |

---

## 📖 Additional Documentation

- **COLORS_QUICK_REFERENCE.md** - Color palette cheat sheet
- **THEME_USAGE_GUIDE.md** - Complete theme implementation guide
- **COLORS_REFERENCE.md** - Comprehensive color documentation
- **COLORS_IMPLEMENTATION_COMPLETE.md** - Implementation details

---

**Last Updated**: June 23, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready  
**Maintained by**: Development Team
