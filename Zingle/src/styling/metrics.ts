import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Baseline design: iPhone SE (375x667)
const baseWidth = 375;
const baseHeight = 667;

const horizontalScale = (size: number) => (width / baseWidth) * size;
const verticalScale = (size: number) => (height / baseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export const metrics = {
  horizontalScale,
  verticalScale,
  moderateScale,
  scale: horizontalScale,
  screenWidth: width,
  screenHeight: height,
  isSmallDevice: width < 375,
  isLargeDevice: width > 414,

  // Spacing
  spacing: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    '2xl': moderateScale(24),
    '3xl': moderateScale(32),
    '4xl': moderateScale(40),
  },

  // Border radius
  radius: {
    sm: moderateScale(4),
    md: moderateScale(8),
    lg: moderateScale(12),
    xl: moderateScale(16),
    '2xl': moderateScale(24),
    full: 999,
  },

  // Shadows (iOS)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
  },
};
