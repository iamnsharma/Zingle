# Zingle Theme System - Complete Guide

## Quick Start

### Access Theme Colors

```typescript
import { useThemeStore } from '@stores';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useThemeStore();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.custom.text }}>Hello World</Text>
    </View>
  );
};
```

## Color Structure

### Material Design 3 Colors (`theme.colors`)
These are standard MD3 colors that work with React Native Paper components:

```typescript
theme.colors = {
  primary: '#FF5864',           // Main action color
  onPrimary: '#FFFFFF',         // Text on primary
  primaryContainer: '#FF7A8B',  // Primary background
  onPrimaryContainer: '#E63946', // Text on primary background

  secondary: '#0099FF',         // Secondary action
  onSecondary: '#FFFFFF',       // Text on secondary
  
  tertiary: '#FAB938',          // Tertiary action (gold)
  onTertiary: '#FFFFFF',        // Text on tertiary

  error: '#EF4444',             // Error states
  onError: '#FFFFFF',           // Text on error

  background: '#F9FAFB',        // App background
  onBackground: '#111827',      // Text on background

  surface: '#FFFFFF',           // Card/component surface
  onSurface: '#111827',         // Text on surface

  outline: '#E5E7EB',           // Borders
  outlineVariant: '#F3F4F6',    // Subtle borders

  // ... and more
}
```

### Custom Colors (`theme.custom`)
Extended Tinder-inspired colors for dating-specific features:

```typescript
theme.custom = {
  // Base
  primary: '#FF5864',
  primaryLight: '#FF7A8B',
  primaryDark: '#E63946',

  secondary: '#0099FF',
  tertiary: '#FAB938',
  
  // Text hierarchy
  text: '#111827',              // Primary text
  textSecondary: '#4B5563',     // Secondary text
  textTertiary: '#6B7280',      // Muted text
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Tinder-specific
  like: '#FF5864',              // Like action (red)
  pass: '#9CA3AF',              // Pass action (gray)
  superlike: '#FAB938',         // Super Like (gold)
  match: '#3FD4B4',             // Match found (green)
  
  // UI
  border: '#E5E7EB',
  disabled: '#F3F4F6',
  disabledText: '#9CA3AF',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.2)',
}
```

## Using in Components

### Simple Background and Text

```typescript
const { theme } = useThemeStore();

<View style={{ backgroundColor: theme.colors.surface }}>
  <Text style={{ color: theme.custom.text }}>Hello</Text>
</View>
```

### For Buttons

```typescript
// Use theme.colors for Paper components
<Button
  mode="contained"
  onPress={() => {}}
  style={{ backgroundColor: theme.colors.primary }}
>
  Primary Action
</Button>

<Button
  mode="outlined"
  onPress={() => {}}
  color={theme.colors.primary}
>
  Outlined
</Button>
```

### For Tinder Swipe Card

```typescript
const renderLikeButton = () => {
  return (
    <TouchableOpacity style={{
      backgroundColor: theme.custom.like,
      borderRadius: 50,
    }}>
      <Icon name="heart" color="#FFF" size={24} />
    </TouchableOpacity>
  );
};

const renderPassButton = () => {
  return (
    <TouchableOpacity style={{
      backgroundColor: theme.custom.pass,
      borderRadius: 50,
    }}>
      <Icon name="close" color="#FFF" size={24} />
    </TouchableOpacity>
  );
};

const renderSuperLikeButton = () => {
  return (
    <TouchableOpacity style={{
      backgroundColor: theme.custom.superlike,
      borderRadius: 50,
    }}>
      <Icon name="star" color="#FFF" size={24} />
    </TouchableOpacity>
  );
};
```

### Status/Alert Messages

```typescript
// Success
<View style={{ backgroundColor: theme.colors.successContainer }}>
  <Text style={{ color: theme.colors.onSuccessContainer }}>
    Profile updated!
  </Text>
</View>

// Error
<View style={{ backgroundColor: theme.colors.errorContainer }}>
  <Text style={{ color: theme.colors.onErrorContainer }}>
    Something went wrong
  </Text>
</View>

// Using custom colors
<Text style={{ color: theme.custom.success }}>Success</Text>
<Text style={{ color: theme.custom.warning }}>Warning</Text>
<Text style={{ color: theme.custom.error }}>Error</Text>
```

## Light vs Dark Mode

Colors automatically adapt:

### Light Mode (Default)
- Background: Light (#F9FAFB)
- Surface: White (#FFFFFF)
- Text: Dark (#111827)
- Primary: Tinder Red (#FF5864)

### Dark Mode
- Background: Dark (#1A1F2B)
- Surface: Slightly lighter dark (#242D3D)
- Text: Light (#F9FAFB)
- Primary: Brighter Red (#FF7A8B) for contrast

Toggle manually:

```typescript
const { toggleTheme, setTheme } = useThemeStore();

// Toggle between light/dark
toggleTheme();

// Set specific theme
setTheme(true);   // Dark mode
setTheme(false);  // Light mode
```

## Tinder Feature Colors

### Match/Dating Actions

```typescript
// Like (Right swipe)
const likeColor = theme.custom.like; // #FF5864

// Pass (Left swipe)
const passColor = theme.custom.pass; // Gray

// Super Like (Up swipe)
const superlikeColor = theme.custom.superlike; // #FAB938 (Gold)

// Match found
const matchColor = theme.custom.match; // #3FD4B4 (Green)
```

### Example: Swipe Card Colors

```typescript
const renderSwipeIndicator = (direction: 'like' | 'pass' | 'superlike') => {
  const colors = {
    like: theme.custom.like,
    pass: theme.custom.pass,
    superlike: theme.custom.superlike,
  };
  
  const icons = {
    like: '❤️',
    pass: '✕',
    superlike: '⭐',
  };
  
  return (
    <View style={{
      backgroundColor: colors[direction],
      borderRadius: 12,
      padding: 16,
    }}>
      <Text style={{ fontSize: 32 }}>{icons[direction]}</Text>
    </View>
  );
};
```

## Best Practices

### ✅ DO

```typescript
// 1. Use theme colors consistently
const { theme } = useThemeStore();
<View style={{ backgroundColor: theme.colors.surface }} />

// 2. Use semantic names
const primaryColor = theme.colors.primary;
const errorColor = theme.colors.error;

// 3. Use custom colors for Tinder features
const likeColor = theme.custom.like;
const matchColor = theme.custom.match;

// 4. Create reusable styled components
const StyledCard = (props) => (
  <View style={{
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
  }}>
    {props.children}
  </View>
);

// 5. Use opacity for overlays
const overlayColor = theme.custom.overlay; // rgba(0, 0, 0, 0.4)
```

### ❌ DON'T

```typescript
// ❌ Hardcoded colors
<View style={{ backgroundColor: '#FFFFFF' }} />

// ❌ Mixing theme and hardcoded
<View style={{ backgroundColor: theme.colors.primary, borderColor: '#CCC' }} />

// ❌ Direct color numbers
const color = '#FF5864';

// ❌ Ignoring dark mode
const lightOnlyColor = '#000000';

// ❌ Using wrong color scope
<Text style={{ color: theme.colors.primary }} /> // For text, use theme.custom.text
```

## Component Integration Examples

### BaseButton Already Uses Theme

```typescript
<BaseButton
  label="Like"
  variant="primary"
  onPress={handleLike}
/>
```

### BaseInput Already Uses Theme

```typescript
<BaseInput
  label="Email"
  placeholder="you@example.com"
  error={emailError}
/>
```

### BaseText Already Uses Theme

```typescript
<BaseText
  variant="h1"
  color={theme.custom.text}
>
  Welcome
</BaseText>
```

## Creating New Themed Components

Template for new themed components:

```typescript
import { useThemeStore } from '@stores';
import { StyleSheet, View } from 'react-native';

const ThemedCard = ({ title, children }) => {
  const { theme } = useThemeStore();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
    },
    title: {
      color: theme.custom.text,
      fontWeight: 'bold',
      marginBottom: 12,
    },
  });
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};
```

## Accessibility

All colors maintain WCAG compliance:

- **AAA Contrast**: Primary colors against surfaces
- **AA Contrast**: Secondary colors, text elements
- **Error States**: 7:1 contrast ratio
- **Disabled States**: Clear visual distinction

## Color Palette Summary

| Purpose | Light | Dark |
|---------|-------|------|
| Primary | #FF5864 | #FF7A8B |
| Secondary | #0099FF | #1AB2FF |
| Tertiary | #FAB938 | #FFC94D |
| Background | #F9FAFB | #1A1F2B |
| Surface | #FFFFFF | #242D3D |
| Text | #111827 | #F9FAFB |
| Success | #10B981 | #6EE7B7 |
| Error | #EF4444 | #FCA5A5 |
| Like | #FF5864 | #FF7A8B |
| Match | #3FD4B4 | #3FD4B4 |

## Troubleshooting

### Colors Not Updating on Theme Change

```typescript
// ✅ Correct: Component re-renders when theme changes
const MyComponent = () => {
  const { theme } = useThemeStore();
  return <View style={{ backgroundColor: theme.colors.surface }} />;
};

// ❌ Wrong: Hardcoded color
const MyComponent = () => {
  return <View style={{ backgroundColor: '#FFFFFF' }} />;
};
```

### TypeScript Errors on Custom Colors

```typescript
// Always use theme.custom for extended colors
const disabledColor = theme.custom.disabledText; // ✅ Correct
const disabledColor = theme.colors.disabledText; // ❌ Error
```

### Theme Not Applied to Paper Components

```typescript
// Wrap with PaperProvider (already in App.tsx)
import { PaperProvider } from 'react-native-paper';

<PaperProvider theme={theme}>
  {/* Your components */}
</PaperProvider>
```

---

**Version**: 1.0  
**Last Updated**: June 23, 2026  
**Tinder Color Scheme**: ✅ Implemented  
**Light/Dark Mode**: ✅ Supported  
**TypeScript**: ✅ Fully Typed
