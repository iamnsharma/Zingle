# Zingle Project - Quick Checklist & Getting Started

## ✅ Project Setup Complete

### What's Done
- [x] React Native 0.81 project created
- [x] TypeScript configured
- [x] 15 path aliases configured
- [x] All dependencies installed
- [x] Folder structure created (20+ directories)
- [x] Theme system setup (colors, typography, metrics)
- [x] State management (Zustand stores)
- [x] Navigation system (Root, Auth, Main, Tabs)
- [x] i18n setup (EN, ES, FR)
- [x] API layer (Supabase integration ready)
- [x] Atomic components (BaseText, BaseButton, BaseInput)
- [x] Environment configuration (.env files)
- [x] Documentation (SETUP_GUIDE.md, PROJECT_SUMMARY.md)

---

## 🚀 Quick Start Guide

### 1. Navigate to Project
```bash
cd /Users/aman/Documents/Learning/Zingle
```

### 2. Install Dependencies (if needed)
```bash
npm install
```

### 3. Configure Supabase (Important!)
Edit `.env.development`:
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
```

### 4. Start Development

**Terminal 1 - Start Metro:**
```bash
npm start
```

**Terminal 2 - Build for Android:**
```bash
npm run android
```

Or just run in one terminal:
```bash
ENVFILE=.env.development npm run android
```

---

## 📁 Project Location
```
/Users/aman/Documents/Learning/Zingle/
```

## 📱 Current Screens

Available but as placeholders:
- Home Screen (ready to implement swipe)
- Discover Screen (ready to implement discovery)
- Favorites Screen (ready to implement favorites)
- Profile Screen (ready to implement profile)
- Auth Screen (ready for login/signup)

---

## 🎨 Using the App

### Available Features Now:

1. **Theme Toggle:**
```typescript
import { useThemeStore } from '@stores';

const { isDark, toggleTheme } = useThemeStore();
```

2. **Translations:**
```typescript
import { t } from '@lang';
import { T } from '@lang/constants';

<Text>{t(T.AUTH_LOGIN)}</Text>
```

3. **API Services:**
```typescript
import { authService } from '@services/api';

await authService.login(email, password);
```

4. **Styling:**
```typescript
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';

const { theme } = useThemeStore();
// Use: theme.colors.primary
// Use: metrics.spacing.lg
```

---

## 📂 Important Files

### Configuration
- `app.json` - App name and metadata
- `.env.development` - Dev credentials
- `.env.production` - Prod credentials
- `src/config/env.ts` - Env variable access
- `src/config/supabase.ts` - Supabase client

### Theme & Styling
- `src/styling/globalStyles/colors.ts` - Colors
- `src/styling/globalStyles/theme.ts` - Theme config
- `src/styling/metrics.ts` - Spacing/sizing

### State Management
- `src/stores/authStore.ts` - Auth state
- `src/stores/themeStore.ts` - Theme state
- `src/stores/profileStore.ts` - Profile state

### Navigation
- `src/navigation/RootNavigator/index.tsx` - Main navigator
- `src/navigation/AuthStack/index.tsx` - Auth flow
- `src/navigation/MainAppStack/index.tsx` - App flow
- `src/navigation/BottomTabNavigator/index.tsx` - Tabs

### Translations
- `src/lang/en/common.json` - English
- `src/lang/es/common.json` - Spanish
- `src/lang/fr/common.json` - French
- `src/lang/constants.ts` - Translation key constants

---

## 💻 Development Workflow

### Adding a New Screen
1. Create folder: `src/screens/MyScreen/`
2. Create file: `src/screens/MyScreen/index.tsx`
3. Add to navigation
4. Use alias imports: `import { BaseText } from '@components/atoms'`

### Adding a New Component
1. Create folder: `src/components/atoms/MyComponent/`
2. Create file: `src/components/atoms/MyComponent/index.tsx`
3. Export from: `src/components/atoms/index.ts`

### Adding a New API Service
1. Create: `src/services/api/modules/myService.ts`
2. Export from: `src/services/api/modules/index.ts`
3. Create React Query hook in: `src/hooks/apiHooks/useMyData.ts`

### Adding a New Translation
1. Add to all JSON files in `src/lang/*/common.json`
2. Add constant to `src/lang/constants.ts`
3. Use: `t(T.MY_KEY)`

---

## 🔍 Useful Commands

```bash
# Start development
npm start

# Build Android
npm run android

# Build iOS (if needed)
npm run ios

# Lint code
npm run lint

# Run tests
npm test

# Clean caches
npm start -- --reset-cache

# Android clean build
cd android && ./gradlew clean && cd ..
```

---

## 🛠️ Common Issues & Solutions

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Dependency conflicts
```bash
npm install --legacy-peer-deps
```

### App crashes on startup
- Check `.env` file syntax
- Verify Supabase credentials
- Check console logs in Android Studio

---

## 📚 Documentation Files

- **SETUP_GUIDE.md** - Comprehensive setup guide
- **PROJECT_SUMMARY.md** - Project overview and statistics
- **QUICKSTART.md** - This file

---

## 🎯 Next Development Steps

1. **Set up Supabase Database**
   - Create users table
   - Create profiles table
   - Create matches table
   - Create messages table

2. **Implement Authentication Screen**
   - Use `authService.login()`
   - Use `authService.signup()`
   - Update auth store

3. **Create Home/Swipe Screen**
   - Implement swipe card component
   - Connect to profile discovery
   - Handle like/pass actions

4. **Build Profile Screen**
   - Display user info
   - Allow profile editing
   - Photo management

5. **Add Messaging**
   - Conversations list
   - Chat screen
   - Message sending

---

## 💡 Tips for Development

### Use Path Aliases
✅ Good: `import { BaseText } from '@components/atoms'`  
❌ Bad: `import { BaseText } from '../../../components/atoms'`

### Always Use Theme
✅ Good: `color={theme.colors.primary}`  
❌ Bad: `color={'#FF6B6B'}`

### Use Translation Constants
✅ Good: `t(T.AUTH_LOGIN)`  
❌ Bad: `t('auth.login')`

### Keep Components Pure
- Pass data via props
- Use hooks for logic
- Avoid side effects

### Store async data in React Query
- Use `@tanstack/react-query`
- Create hooks in `apiHooks/`
- Let RQ handle caching

---

## 🔐 Security Notes

- Never commit `.env` files with real credentials
- Use secure Supabase anon keys only
- Implement RLS (Row Level Security) in Supabase
- Keep sensitive data in stores/secure storage

---

## 📞 Project Support

For questions about:
- **Architecture** - See `SETUP_GUIDE.md`
- **Components** - Check `src/components/atoms/`
- **API** - Check `src/services/api/`
- **Navigation** - Check `src/navigation/`
- **Styling** - Check `src/styling/`

---

## 🎓 Learning Path

1. Understand folder structure
2. Look at BaseText component (simplest)
3. Study useThemeStore (state management)
4. Review RootNavigator (navigation)
5. Check authService (API layer)
6. Build your first screen!

---

## ✨ You're All Set!

The foundation is complete. Start building amazing features! 🚀

**Project Status**: ✅ Ready for Development  
**Last Updated**: June 23, 2026  
**Location**: `/Users/aman/Documents/Learning/Zingle`
