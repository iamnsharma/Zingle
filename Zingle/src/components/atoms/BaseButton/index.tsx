import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface BaseButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: metrics.spacing.lg,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
