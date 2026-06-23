# Zingle Color System Reference

## Overview

The Zingle app uses a comprehensive, Tinder-inspired color system with full support for light and dark modes. All colors are automatically adapted based on the current theme.

## Color Palette

### Primary Colors (Tinder Red)
- `primary`: #FF5864 (Tinder Hot Red - Main action color)
- `primaryLight`: #FF7A8B (Lighter red for hover/focus states)
- `primaryDark`: #E63946 (Darker red for pressed states)

**Use cases**: Main buttons, primary CTAs, key UI elements

### Secondary Colors (Tinder Blue)
- `secondary`: #0099FF (Soft Blue - Secondary action)
- `secondaryLight`: #1AB2FF (Lighter blue)
- `secondaryDark`: #0077CC (Darker blue)

**Use cases**: Secondary buttons, alternative actions, decorative elements

### Tertiary Colors (Tinder Gold)
- `tertiary`: #FAB938 (Gold - Premium/Special)
- `tertiaryLight`: #FFC94D (Lighter gold)
- `tertiaryDark`: #E8A700 (Darker gold)

**Use cases**: Premium features, Super Like indicator, highlights

### Status Colors
- `success`: #10B981 (Light) / #4CAF50 (Dark) - Success states
- `warning`: #F59E0B (Light) / #FF9800 (Dark) - Warning states
- `error`: #EF4444 (Light) / #F44336 (Dark) - Error states
- `info`: #3B82F6 (Light) / #2196F3 (Dark) - Information

### Neutral Colors

#### Light Mode Neutrals
- `neutral50`: #F9FAFB (Almost white)
- `neutral100`: #F3F4F6 (Light background)
- `neutral200`: #E5E7EB (Light gray)
- `neutral300`: #D1D5DB (Medium-light gray)
- `neutral400`: #9CA3AF (Medium gray)
- `neutral500`: #6B7280 (Darker medium gray)
- `neutral600`: #4B5563 (Darker gray)
- `neutral700`: #374151 (Dark gray)
- `neutral800`: #1F2937 (Very dark gray)
- `neutral900`: #111827 (Almost black)

#### Dark Mode Neutrals
- `dark100`: #0F1117 (Dark background)
- `dark200`: #1A1F2B (Darker background)
- `dark300`: #242D3D (Surface)
- And more for varying depths...

### Semantic Color Names

Used in the theme object:

```typescript
// Backgrounds
- `background`: Main app background
- `surface`: Card/component surface
- `surfaceVariant`: Variant surface (slightly different)
- `surfaceHover`: Interactive surface on hover

// Text
- `text`: Primary text
- `textSecondary`: Secondary text
- `textTertiary`: Tertiary/muted text
- `textInverse`: Inverse color for contrast

// UI Elements
- `border`: Border color
- `borderLight`: Light border
- `divider`: Divider line
- `disabled`: Disabled element background
- `disabledText`: Disabled text

// Overlays
- `overlay`: Dark overlay (40-70% opacity)
- `scrim`: Light overlay (20-50% opacity)
- `overlaySoft`: Soft overlay (10-30% opacity)

// Specific Features
- `like`: Like action (Tinder red)
- `pass`: Pass action
- `superlike`: Super Like (Tinder gold)
- `match`: Match indicator (green)
```

## Using Colors in Components

### Accessing Theme Colors

```typescript
import { useThemeStore } from '@stores';

const MyComponent = () => {
  const { theme } = useThemeStore();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
    </View>
  );
};
```

### With Custom Colors

```typescript
const { theme } = useThemeStore();

// Primary action
const primaryColor = theme.colors.primary;

// Tinder-specific colors
const likeColor = theme.custom.like;
const matchColor = theme.custom.match;

// Material Design 3 standard
const surfaceColor = theme.colors.surface;
const onSurfaceColor = theme.colors.onSurface;
```

## Light vs Dark Mode

Colors automatically switch based on theme:

```typescript
// Light Mode
- Primary: #FF5864 (Tinder Red)
- Background: #F9FAFB (Light)
- Text: #111827 (Dark)

// Dark Mode
- Primary: #FF7A8B (Brighter Red)
- Background: #1A1F2B (Dark)
- Text: #F9FAFB (Light)
```

## Tinder Feature Colors

### Match System

```typescript
const matchState = {
  like: theme.custom.like,      // Red - #FF5864
  pass: theme.custom.pass,       // Gray
  superlike: theme.custom.superlike,  // Gold - #FAB938
  match: theme.custom.match,     // Green - #3FD4B4
};
```

### Card Swipe Indicators

- **Right swipe (Like)**: Use `primary` / `custom.like`
- **Left swipe (Pass)**: Use `custom.pass`
- **Up swipe (Super Like)**: Use `tertiary` / `custom.superlike`

## Best Practices

### ✅ Do
- Always use `theme.colors` for UI elements
- Use semantic color names (primary, secondary, etc.)
- Leverage `textSecondary` and `textTertiary` for hierarchy
- Use status colors (success, warning, error) for states
- Use `overlay` for modal backgrounds

### ❌ Don't
- Hardcode colors directly
- Mix hardcoded colors with theme colors
- Use colors without considering both light/dark modes
- Ignore contrast ratios for accessibility

## Theming Toggle

```typescript
import { useThemeStore } from '@stores';

const { isDark, toggleTheme, setTheme } = useThemeStore();

// Toggle theme
toggleTheme();

// Set specific theme
setTheme(true);  // Dark
setTheme(false); // Light
```

## Colors for Common Patterns

### Disabled States
```typescript
backgroundColor: theme.colors.disabled
color: theme.colors.disabledText
```

### Hover States
```typescript
backgroundColor: theme.colors.surfaceHover
```

### Error Messages
```typescript
color: theme.colors.error
backgroundColor: theme.colors.errorLight  // With opacity
```

### Success States
```typescript
color: theme.colors.success
borderColor: theme.colors.success
```

### Borders
```typescript
borderColor: theme.colors.border  // Regular
borderColor: theme.colors.borderLight  // Subtle
```

## Accessibility

- Primary: AAA contrast in both modes
- Text on surface: AAA contrast
- Error: 7:1 contrast ratio
- Warning: Compliant with WCAG AA

## Extension

To add new colors:

1. Add to `tinderColors` object in `colors.ts`
2. Map in `lightColors` and `darkColors`
3. Update `ColorScheme` type
4. Document in this file

Example:
```typescript
// In tinderColors
myCustomColor: '#ABC123',

// In lightColors/darkColors
myCustom: tinderColors.myCustomColor,

// Then access
theme.custom.myCustom
```

---

**Last Updated**: June 23, 2026
**Version**: 1.0
