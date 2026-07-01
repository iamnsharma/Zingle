import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface GradientButtonProps extends TouchableOpacityProps {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gradient' | 'solid';
  colors?: string[];
}

const styles = StyleSheet.create({
  button: {
    borderRadius: metrics.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sm: {
    paddingVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.lg,
  },
  md: {
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.xl,
  },
  lg: {
    paddingVertical: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing['2xl'],
  },
});

export const GradientButton = React.forwardRef<View, GradientButtonProps>(
  (
    {
      label,
      size = 'md',
      loading = false,
      disabled = false,
      variant = 'gradient',
      colors: customColors,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();

    const getGradientColors = (): string[] => {
      if (customColors) return customColors;
      if (variant === 'gradient') {
        return theme.custom.gradientPrimary;
      }
      return [theme.colors.primary, theme.colors.primary];
    };

    const sizeStyle = styles[size];
    const gradientColors = getGradientColors();

    return (
      <TouchableOpacity
        ref={ref}
        {...props}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? [theme.custom.disabled, theme.custom.disabled] : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, sizeStyle, customStyle]}
        >
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <BaseText
                variant="button"
                color={disabled ? theme.custom.disabledText : '#FFFFFF'}
                children={label}
              />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
);

GradientButton.displayName = 'GradientButton';
