# Zingle - React Native Dating App

A modern, scalable React Native dating application built with TypeScript, featuring a clean architecture inspired by industry best practices (modeled after Yieldz Mobile).

## 🎯 Project Overview

**Zingle** is a dating app platform similar to Tinder, Bumble, and Shaadi.com. The project is built from the ground up with a production-ready foundation, focusing on clean code, scalability, and maintainability.

### Current Scope (MVP)
- ✅ Project structure and architecture setup
- ✅ Navigation system configured
- ✅ Theme/Dark mode system
- ✅ Internationalization (i18n) - EN, ES, FR
- ✅ Environment configuration
- ✅ Supabase integration ready
- ✅ State management (Zustand) setup
- ✅ API layer structure
- ✅ Basic atomic components
- ⏳ Dating features (Phase 2)

### Future Phases
- Dating discovery/swiping
- Matches and messaging
- User profiles with photo gallery
- Real-time notifications
- Advanced search/filtering
- Analytics and engagement tracking

## 📁 Project Structure

```
Zingle/
├── src/
│   ├── assets/                 # Images, fonts, icons
│   ├── components/             # UI components (atomic design)
│   │   ├── atoms/             # Basic building blocks
│   │   ├── molecules/         # Combinations of atoms
│   │   ├── organisms/         # Complex components
│   │   ├── templates/         # Page layouts
│   │   └── bottomsheets/      # Bottom sheet modals
│   ├── config/                # Configuration files
│   │   ├── env.ts            # Environment variables
│   │   └── supabase.ts       # Supabase client
│   ├── constants/             # App-wide constants
│   ├── context/               # React Context providers (legacy)
│   ├── hooks/                 # Custom hooks
│   │   ├── apiHooks/         # React Query hooks for API
│   │   └── custom/           # Other custom hooks
│   ├── lang/                  # Internationalization (i18n)
│   │   ├── en/common.json    # English translations
│   │   ├── es/common.json    # Spanish translations
│   │   ├── fr/common.json    # French translations
│   │   ├── constants.ts      # Typed translation keys
│   │   └── index.ts          # i18n initialization
│   ├── navigation/            # React Navigation setup
│   │   ├── RootNavigator/    # Main navigation container
│   │   ├── AuthStack/        # Authentication flow
│   │   ├── MainAppStack/     # Authenticated app flow
│   │   └── BottomTabNavigator/ # Bottom tab navigation
│   ├── screens/               # Feature screens
│   │   ├── Auth/            # Authentication screens
│   │   ├── Home/            # Home/discover screens
│   │   └── Profile/         # User profile screens
│   ├── services/              # API services and other services
│   │   ├── api/
│   │   │   ├── clients/     # Axios clients
│   │   │   ├── core/        # Query client setup
│   │   │   ├── modules/     # Service classes per domain
│   │   │   ├── types/       # Request/response types
│   │   │   └── endpoints.ts # API endpoint constants
│   │   ├── analytics/       # Analytics tracking
│   │   └── push/            # Push notifications
│   ├── stores/                # Zustand state stores
│   │   ├── authStore.ts     # Authentication state
│   │   ├── themeStore.ts    # Theme preference
│   │   └── profileStore.ts  # User profile state
│   ├── styling/               # Theme and styling
│   │   ├── globalStyles/
│   │   │   ├── colors.ts    # Color palette
│   │   │   ├── theme.ts     # Paper theme
│   │   │   └── typography.ts # Font sizes/weights
│   │   └── metrics.ts       # Spacing, sizing utilities
│   ├── types/                 # TypeScript types and interfaces
│   │   ├── enums.ts         # Enum definitions
│   │   ├── interfaces.ts    # Interface definitions
│   │   ├── navigation.ts    # Navigation param types
│   │   └── index.ts         # Type exports
│   └── utils/                 # Utility functions
├── App.tsx                    # Root component
├── index.js                   # React Native entry point
├── app.json                   # App configuration
├── babel.config.js            # Babel configuration with aliases
├── tsconfig.json              # TypeScript configuration
├── metro.config.js            # Metro bundler config
├── .env.development           # Development environment variables
├── .env.production            # Production environment variables
└── android/                   # Android native code
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- Android SDK (for Android development)
- Android Studio (optional but recommended)

### Installation

1. **Navigate to project directory:**
```bash
cd /Users/aman/Documents/Learning/Zingle
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
   - Edit `.env.development` and `.env.production`
   - Add your Supabase credentials:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Start Metro bundler:**
```bash
npm start
```

5. **Build and run on Android (in another terminal):**
```bash
npm run android
```

### Android Build

#### Debug Build
```bash
npm run android
```

#### Release Build
```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

## 🏗️ Architecture Decisions

### Folder Aliases
The project uses path aliases for cleaner imports:
- `@components` → `./src/components`
- `@screens` → `./src/screens`
- `@navigation` → `./src/navigation`
- `@services` → `./src/services`
- `@stores` → `./src/stores`
- `@styling` → `./src/styling`
- `@lang` → `./src/lang`
- `@types` → `./src/types`
- `@config` → `./src/config`
- `@constants` → `./src/constants`

### State Management
- **Zustand**: Global application state (auth, theme, preferences)
- **React Query**: Server state and data fetching
- **React Context**: Legacy patterns (prefer Zustand for new code)

### API Architecture
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Service Layer**: Modular API services per domain
- **React Query**: Data fetching, caching, and synchronization
- **Axios**: HTTP client (optional, can use Supabase client directly)

### Styling System
- **React Native Paper**: Material Design 3 theme provider
- **Theme Store**: Centralized light/dark mode management
- **Semantic Colors**: Design tokens for consistent theming
- **Responsive Metrics**: Dynamic scaling based on screen size

### Navigation
- **React Navigation 7**: Stack and tab navigation
- **Lazy Loading**: Code-split screens for better performance
- **Deep Linking**: Ready for URL-based navigation
- **Auth Gates**: Automatic redirect based on login state

### Internationalization
- **i18next**: Multi-language support
- **Typed Keys**: Compile-time checked translation keys via `T.*` constants
- **Supported Languages**: English (en), Spanish (es), French (fr)

## 🛠️ Development

### Adding a New Component

1. Create component in atomic structure:
```tsx
// src/components/atoms/MyButton/index.tsx
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface MyButtonProps extends TouchableOpacityProps {
  label: string;
}

export const MyButton: React.FC<MyButtonProps> = ({ label, ...props }) => {
  return <TouchableOpacity {...props} />;
};
```

2. Export from atoms barrel:
```tsx
// src/components/atoms/index.ts
export { MyButton } from './MyButton';
```

### Adding a New Screen

1. Create screen folder:
```tsx
// src/screens/MyFeature/index.tsx
import React from 'react';
import { View } from 'react-native';

export const MyFeatureScreen = () => {
  return <View />;
};
```

2. Add to navigation:
```tsx
// Update src/navigation/MainAppStack/index.tsx
<Stack.Screen name="MyFeature" component={MyFeatureScreen} />
```

### Adding a New API Service

1. Create service module:
```typescript
// src/services/api/modules/myFeature.service.ts
import { supabase } from '@config/supabase';

export const myFeatureService = {
  async getData() {
    const { data, error } = await supabase
      .from('my_table')
      .select('*');
    if (error) throw error;
    return data;
  },
};
```

2. Export from modules:
```typescript
// src/services/api/modules/index.ts
export { myFeatureService } from './myFeature.service';
```

3. Create React Query hook:
```typescript
// src/hooks/apiHooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';
import { myFeatureService } from '@services/api';

export const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: () => myFeatureService.getData(),
  });
};
```

### Adding a New Translation

1. Add key to translation JSON files:
```json
// src/lang/en/common.json
{
  "t": {
    "myFeature": {
      "title": "My Feature"
    }
  }
}
```

2. Add constant:
```typescript
// src/lang/constants.ts
MY_FEATURE_TITLE: 't.myFeature.title',
```

3. Use in component:
```typescript
import { t } from '@lang';
import { T } from '@lang/constants';

<Text>{t(T.MY_FEATURE_TITLE)}</Text>
```

## 🎨 Theme System

### Using Theme Colors

```typescript
import { useThemeStore } from '@stores';
import { BaseText } from '@components/atoms';

export const MyComponent = () => {
  const { theme } = useThemeStore();

  return (
    <BaseText color={theme.colors.primary}>
      Primary color text
    </BaseText>
  );
};
```

### Available Colors

- **Primary/Secondary**: Brand colors
- **Background/Surface**: Background layers
- **Text**: Text colors (primary, secondary, tertiary)
- **Status**: Success, warning, error, info
- **Semantic**: Border, divider, disabled, overlay

### Dark Mode Toggle

```typescript
import { useThemeStore } from '@stores';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Button onPress={toggleTheme} title={isDark ? '☀️' : '🌙'} />
  );
};
```

## 📱 Features Overview

### ✅ Implemented
- Clean architecture with clear separation of concerns
- Type-safe navigation with TypeScript
- State management with Zustand
- Multi-language support (EN, ES, FR)
- Light/Dark theme system
- Responsive design with metrics
- Supabase integration ready
- Atomic component architecture
- Organized file structure

### 🔄 In Progress
- Core dating features (swipe, match, chat)
- User profile management
- Image handling and caching
- Real-time messaging

### 🚧 Planned
- In-app notifications
- Analytics and tracking
- Social features (followers, verified badges)
- Premium features
- Payment integration

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## 📋 Coding Standards

### Import Order
1. React and React Native
2. Third-party libraries
3. Relative imports
4. Alias imports

### File Naming
- Components: PascalCase
- Utilities: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase with prefix I (e.g., IUser)

### Component Structure
1. Imports
2. Props interface
3. Component definition
4. Styles (if co-located)
5. Export

### Colors
- Never use hardcoded hex colors in components
- Always use `theme.colors.*` from the theme store

### Translation Keys
- Use `T.*` constants from `@lang/constants`
- Never use string literals for translations

## 🔒 Environment Variables

### Development (.env.development)
```
NODE_ENV=development
SUPABASE_URL=your-dev-url
SUPABASE_ANON_KEY=your-dev-key
DEBUG_MODE=true
```

### Production (.env.production)
```
NODE_ENV=production
SUPABASE_URL=your-prod-url
SUPABASE_ANON_KEY=your-prod-key
DEBUG_MODE=false
```

**Important**: Environment variables are embedded at build time. Rebuild native code after changing `.env` files.

## 📚 Dependencies

### Core Framework
- **react-native**: 0.81.0 - Mobile framework
- **react**: 19.1.0 - React library

### Navigation
- **@react-navigation/native**: ^7 - Navigation core
- **@react-navigation/native-stack**: ^7 - Stack navigator
- **@react-navigation/bottom-tabs**: ^7 - Tab navigator

### State Management & Data
- **zustand**: ^5 - Global state management
- **@tanstack/react-query**: ^5 - Server state management

### UI & Styling
- **react-native-paper**: ^5 - Material Design 3 components
- **react-native-vector-icons**: ^10 - Icon library

### Backend & APIs
- **@supabase/supabase-js**: ^2 - Supabase client
- **react-native-config**: ^1.6 - Environment variables

### Internationalization
- **i18next**: ^26 - i18n framework
- **react-i18next**: ^17 - React i18n integration

### Build & Bundling
- **babel-plugin-module-resolver**: ^5 - Path aliases
- **@react-native/metro-config**: 0.81.0 - Metro config
- **typescript**: ^5.8 - TypeScript support

### Development Tools
- **eslint**: ^8 - Code linting
- **prettier**: 2.8.8 - Code formatting
- **jest**: ^29 - Testing framework

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Dependency Conflicts
```bash
npm install --legacy-peer-deps
```

### Clear all caches
```bash
npm start -- --reset-cache
cd android && ./gradlew clean
```

## 📖 Additional Resources

- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Contributing

Please follow the coding standards outlined in this README when contributing to the project.

---

**Last Updated**: June 23, 2026

**Project Status**: MVP - Architecture & Foundation Complete ✅
