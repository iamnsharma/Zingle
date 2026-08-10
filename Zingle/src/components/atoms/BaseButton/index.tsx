import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeStore, useProfileStore } from '@stores';
import { metrics } from '@styling/metrics';
import { hexToRgba } from '@utils/colorUtils';
import { BaseText } from '../BaseText';

interface BaseButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

const GLASS_SHEEN = ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'];

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: metrics.spacing.lg,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
  },
  sm: {
    paddingVertical: metrics.spacing.sm,
  },
  md: {
    paddingVertical: metrics.spacing.md,
  },
  lg: {
    paddingVertical: metrics.spacing.lg,
  },
});

export const BaseButton = React.forwardRef<View, BaseButtonProps>(
  (
    {
      label,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const glassEnabled = useProfileStore(state => state.appSettings.liquidGlass);

    const getBackgroundColor = (): string => {
      if (disabled) return theme.custom.disabled;
      switch (variant) {
        case 'primary':
          return theme.colors.primary;
        case 'secondary':
          return theme.colors.secondary;
        case 'outline':
          return 'transparent';
        default:
          return theme.colors.primary;
      }
    };

    const getBorderStyle = (): Partial<ViewStyle> => {
      if (variant === 'outline') {
        return {
          borderWidth: 1,
          borderColor: theme.colors.outline,
        };
      }
      return {};
    };

    const getTextColor = (): string => {
      if (disabled) return theme.custom.disabledText;
      if (variant === 'outline') return theme.colors.primary;
      return '#FFFFFF';
    };

    const sizeStyle = styles[size];

    // Liquid glass: frosted translucent surface tinted with the accent color.
    if (glassEnabled && !disabled && variant !== 'outline') {
      const accent =
        variant === 'secondary' ? theme.colors.secondary : theme.colors.primary;
      return (
        <TouchableOpacity
          ref={ref}
          {...props}
          disabled={loading}
          style={[
            styles.button,
            sizeStyle,
            {
              backgroundColor: hexToRgba(accent, 0.16),
              borderWidth: 1,
              borderColor: hexToRgba(accent, 0.5),
            },
            customStyle,
          ]}
        >
          <LinearGradient
            colors={GLASS_SHEEN}
            locations={[0, 0.55, 1]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.sheen}
            pointerEvents="none"
          />
          {loading ? (
            <ActivityIndicator color={accent} />
          ) : (
            <BaseText variant="button" color={accent} children={label} />
          )}
        </TouchableOpacity>
      );
    }

    const buttonStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyle,
      backgroundColor: getBackgroundColor(),
      ...getBorderStyle(),
    };

    return (
      <TouchableOpacity
        ref={ref}
        {...props}
        disabled={disabled || loading}
        style={[buttonStyle, customStyle]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <BaseText
            variant="button"
            color={getTextColor()}
            children={label}
          />
        )}
      </TouchableOpacity>
    );
  }
);

BaseButton.displayName = 'BaseButton';
