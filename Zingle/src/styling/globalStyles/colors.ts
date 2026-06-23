import { MD3LightTheme as DefaultLightTheme, MD3DarkTheme as DefaultDarkTheme } from 'react-native-paper';

export const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const tinderColors = {
  // Tinder Primary - Hot Red/Orange (Action/Swipe Right)
  tinderRed: '#FF5864',
  tinderRedLight: '#FF7A8B',
  tinderRedDark: '#E63946',

  // Tinder Secondary - Soft Blue (Pass/Swipe Left)
  tinderBlue: '#0099FF',
  tinderBlueLightHover: '#1AB2FF',
  tinderBlueDark: '#0077CC',

  // Tinder Gold - Premium/Special (Super Like)
  tinderGold: '#FAB938',
  tinderGoldLight: '#FFC94D',
  tinderGoldDark: '#E8A700',

  // Tinder Secondary Actions
  tinderGreen: '#3FD4B4',
  tinderGreenDark: '#31A896',

  // Neutrals (Modern, Clean)
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral300: '#D1D5DB',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',

  // Dark Mode Neutrals
  dark50: '#F9FAFB',
  dark100: '#0F1117',
  dark200: '#1A1F2B',
  dark300: '#242D3D',
  dark400: '#2F3A4F',
  dark500: '#3D4A63',
  dark600: '#4A5775',
  dark700: '#5A6A89',
  dark800: '#6B7A99',
  dark900: '#7D8CAA',

  // Semantic Colors
  success: '#10B981',
  successLight: '#6EE7B7',
  successDark: '#059669',

  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  error: '#EF4444',
  errorLight: '#FCA5A5',
  errorDark: '#DC2626',

  info: '#3B82F6',
  infoLight: '#93C5FD',
  infoDark: '#1D4ED8',
};

export const lightColors = {
  ...tinderColors,
  ...baseColors,
  // Primary - Tinder Red (Main Action)
  primary: tinderColors.tinderRed,
  primaryLight: tinderColors.tinderRedLight,
  primaryDark: tinderColors.tinderRedDark,

  // Secondary - Tinder Blue
  secondary: tinderColors.tinderBlue,
  secondaryLight: tinderColors.tinderBlueLightHover,
  secondaryDark: tinderColors.tinderBlueDark,

  // Tertiary - Tinder Gold
  tertiary: tinderColors.tinderGold,
  tertiaryLight: tinderColors.tinderGoldLight,
  tertiaryDark: tinderColors.tinderGoldDark,

  // Backgrounds & Surfaces
  background: tinderColors.neutral50,
  surface: baseColors.white,
  surfaceVariant: tinderColors.neutral100,
  surfaceHover: tinderColors.neutral200,

  // Text Colors
  text: tinderColors.neutral900,
  textSecondary: tinderColors.neutral600,
  textTertiary: tinderColors.neutral500,
  textInverse: baseColors.white,

  // UI Elements
  border: tinderColors.neutral200,
  borderLight: tinderColors.neutral100,
  divider: tinderColors.neutral200,
  disabled: tinderColors.neutral200,
  disabledText: tinderColors.neutral400,

  // Status
  success: tinderColors.success,
  successLight: tinderColors.successLight,
  warning: tinderColors.warning,
  warningLight: tinderColors.warningLight,
  error: tinderColors.error,
  errorLight: tinderColors.errorLight,
  info: tinderColors.info,
  infoLight: tinderColors.infoLight,

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.2)',
  overlaySoft: 'rgba(0, 0, 0, 0.1)',

  // Rating/Match Colors
  like: tinderColors.tinderRed,
  pass: tinderColors.neutral400,
  superlike: tinderColors.tinderGold,
  match: tinderColors.tinderGreen,
};

export const darkColors = {
  ...tinderColors,
  ...baseColors,
  // Primary - Tinder Red (Brighter for dark mode)
  primary: tinderColors.tinderRedLight,
  primaryLight: tinderColors.tinderRed,
  primaryDark: tinderColors.tinderRedDark,

  // Secondary - Tinder Blue (Brighter)
  secondary: tinderColors.tinderBlueLightHover,
  secondaryLight: tinderColors.tinderBlue,
  secondaryDark: tinderColors.tinderBlueDark,

  // Tertiary - Tinder Gold (Brighter)
  tertiary: tinderColors.tinderGoldLight,
  tertiaryLight: tinderColors.tinderGold,
  tertiaryDark: tinderColors.tinderGoldDark,

  // Backgrounds & Surfaces
  background: tinderColors.dark200,
  surface: tinderColors.dark300,
  surfaceVariant: tinderColors.dark400,
  surfaceHover: tinderColors.dark500,

  // Text Colors
  text: tinderColors.dark50,
  textSecondary: tinderColors.dark700,
  textTertiary: tinderColors.dark600,
  textInverse: tinderColors.neutral900,

  // UI Elements
  border: tinderColors.dark500,
  borderLight: tinderColors.dark400,
  divider: tinderColors.dark400,
  disabled: tinderColors.dark400,
  disabledText: tinderColors.dark600,

  // Status
  success: tinderColors.successLight,
  successLight: tinderColors.success,
  warning: tinderColors.warningLight,
  warningLight: tinderColors.warning,
  error: tinderColors.errorLight,
  errorLight: tinderColors.error,
  info: tinderColors.infoLight,
  infoLight: tinderColors.info,

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  scrim: 'rgba(0, 0, 0, 0.5)',
  overlaySoft: 'rgba(0, 0, 0, 0.3)',

  // Rating/Match Colors
  like: tinderColors.tinderRedLight,
  pass: tinderColors.dark600,
  superlike: tinderColors.tinderGoldLight,
  match: tinderColors.tinderGreen,
};

export type ColorScheme = typeof lightColors;

export const MD3LightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: lightColors.primary,
    onPrimary: baseColors.white,
    primaryContainer: lightColors.primaryLight,
    onPrimaryContainer: lightColors.primaryDark,

    secondary: lightColors.secondary,
    onSecondary: baseColors.white,
    secondaryContainer: lightColors.secondaryLight,
    onSecondaryContainer: lightColors.secondaryDark,

    tertiary: lightColors.tertiary,
    onTertiary: baseColors.white,
    tertiaryContainer: lightColors.tertiaryLight,
    onTertiaryContainer: lightColors.tertiaryDark,

    error: lightColors.error,
    onError: baseColors.white,
    errorContainer: lightColors.errorLight,
    onErrorContainer: lightColors.error,

    background: lightColors.background,
    onBackground: lightColors.text,

    surface: lightColors.surface,
    onSurface: lightColors.text,
    surfaceVariant: lightColors.surfaceVariant,
    onSurfaceVariant: lightColors.textSecondary,

    outline: lightColors.border,
    outlineVariant: lightColors.borderLight,

    scrim: lightColors.scrim,
    inverseSurface: lightColors.neutral900,
    inverseOnSurface: baseColors.white,
    inversePrimary: lightColors.primaryLight,
  },
};

export const MD3DarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: baseColors.white,
    primaryContainer: darkColors.primaryLight,
    onPrimaryContainer: darkColors.primaryDark,

    secondary: darkColors.secondary,
    onSecondary: baseColors.white,
    secondaryContainer: darkColors.secondaryLight,
    onSecondaryContainer: darkColors.secondaryDark,

    tertiary: darkColors.tertiary,
    onTertiary: baseColors.white,
    tertiaryContainer: darkColors.tertiaryLight,
    onTertiaryContainer: darkColors.tertiaryDark,

    error: darkColors.error,
    onError: baseColors.white,
    errorContainer: darkColors.errorLight,
    onErrorContainer: darkColors.error,

    background: darkColors.background,
    onBackground: darkColors.text,

    surface: darkColors.surface,
    onSurface: darkColors.text,
    surfaceVariant: darkColors.surfaceVariant,
    onSurfaceVariant: darkColors.textSecondary,

    outline: darkColors.border,
    outlineVariant: darkColors.borderLight,

    scrim: darkColors.scrim,
    inverseSurface: darkColors.neutral50,
    inverseOnSurface: darkColors.neutral900,
    inversePrimary: darkColors.primaryDark,
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  custom: lightColors,
};

export const darkTheme = {
  ...MD3DarkTheme,
  custom: darkColors,
};
