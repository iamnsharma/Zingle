import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { APP_ICONS } from '@constants/images';
import { BaseText } from '../BaseText';

interface GoogleButtonProps extends TouchableOpacityProps {
  loading?: boolean;
  disabled?: boolean;
  variant?: 'auth' | 'default';
}

const styles = StyleSheet.create({
  button: {
    borderRadius: metrics.radius.full,
    paddingVertical: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  authButton: {
    backgroundColor: '#FFFFFF',
    ...metrics.shadows.md,
  },
  defaultButton: {
    borderWidth: 1,
    ...metrics.shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.md,
  },
  googleLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  disabledOpacity: {
    opacity: 0.6,
  },
  labelBold: {
    fontWeight: '600',
  },
});

export const GoogleButton = React.forwardRef<View, GoogleButtonProps>(
  (
    {
      loading = false,
      disabled = false,
      variant = 'auth',
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const isAuth = variant === 'auth';

    return (
      <TouchableOpacity
        ref={ref}
        {...props}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={customStyle}
      >
        <View
          style={[
            styles.button,
            isAuth
              ? styles.authButton
              : [
                  styles.defaultButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.custom.border,
                  },
                ],
            disabled && styles.disabledOpacity,
          ]}
        >
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator
                color={isAuth ? theme.colors.primary : theme.colors.primary}
              />
            ) : (
              <>
                <Image
                  source={APP_ICONS.google}
                  style={styles.googleLogo}
                  resizeMode="cover"
                />
                <BaseText
                  variant="button"
                  color={isAuth ? '#212121' : theme.custom.text}
                  style={styles.labelBold}
                  children="Continue with Google"
                />
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

GoogleButton.displayName = 'GoogleButton';
