/** Same PostScript / file names as Yieldz — works on iOS and Android. */
export const Fonts = {
  regular: 'PPMori-Regular',
  semibold: 'PPMori-SemiBold',
  extralight: 'PPMori-Extralight',
  /** Auth wordmark only — do not use elsewhere unless asked. */
  brand: 'TickerBit-Regular',
} as const;

export const Typography = {
  fontFamily: {
    regular: Fonts.regular,
    medium: Fonts.regular,
    bold: Fonts.semibold,
    semibold: Fonts.semibold,
    extralight: Fonts.extralight,
  },
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 40,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

export const textVariants = {
  h1: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes['3xl'] * Typography.lineHeights.tight,
  },
  h2: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes['2xl'] * Typography.lineHeights.tight,
  },
  h3: {
    fontSize: Typography.sizes.xl,
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes.xl * Typography.lineHeights.tight,
  },
  h4: {
    fontSize: Typography.sizes.lg,
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes.lg * Typography.lineHeights.normal,
  },
  body: {
    fontSize: Typography.sizes.base,
    fontFamily: Fonts.regular,
    lineHeight: Typography.sizes.base * Typography.lineHeights.relaxed,
  },
  bodyMedium: {
    fontSize: Typography.sizes.base,
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes.base * Typography.lineHeights.relaxed,
  },
  bodySm: {
    fontSize: Typography.sizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  caption: {
    fontSize: Typography.sizes.xs,
    fontFamily: Fonts.regular,
    lineHeight: Typography.sizes.xs * Typography.lineHeights.normal,
  },
  button: {
    fontSize: Typography.sizes.base,
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
  },
  display: {
    fontSize: Typography.sizes['5xl'],
    fontFamily: Fonts.semibold,
    lineHeight: Typography.sizes['5xl'] * Typography.lineHeights.tight,
  },
};
