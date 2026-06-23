export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    semibold: 'System',
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
    fontSize: Typography.sizes['3xl'],  // Reduced from 5xl (32px) to 3xl (24px)
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.lineHeights.tight,
  },
  h2: {
    fontSize: Typography.sizes['2xl'],  // Reduced from 4xl (28px) to 2xl (20px)
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.lineHeights.tight,
  },
  h3: {
    fontSize: Typography.sizes.xl,      // Reduced from 3xl (24px) to xl (18px)
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.lineHeights.tight,
  },
  h4: {
    fontSize: Typography.sizes.lg,      // Reduced from 2xl (20px) to lg (16px)
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.lineHeights.normal,
  },
  body: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.normal,
    lineHeight: Typography.lineHeights.relaxed,
  },
  bodyMedium: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    lineHeight: Typography.lineHeights.relaxed,
  },
  bodySm: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.normal,
    lineHeight: Typography.lineHeights.normal,
  },
  caption: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.normal,
    lineHeight: Typography.lineHeights.normal,
  },
  button: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.lineHeights.normal,
  },
};
