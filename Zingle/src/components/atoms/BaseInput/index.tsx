import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { Fonts } from '@styling/globalStyles/typography';
import { BaseText } from '../BaseText';

interface BaseInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'auth';
  showPasswordToggle?: boolean;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: metrics.spacing.lg,
  },
  authContainer: {
    marginBottom: 0,
  },
  label: {
    marginBottom: metrics.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: metrics.radius.md,
    borderWidth: 1,
    paddingHorizontal: metrics.spacing.md,
  },
  authInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    paddingHorizontal: metrics.spacing.lg,
    minHeight: 56,
  },
  input: {
    flex: 1,
    paddingVertical: metrics.spacing.md,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  authInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    includeFontPadding: false,
  },
  errorText: {
    marginTop: metrics.spacing.sm,
  },
  iconContainer: {
    marginRight: metrics.spacing.sm,
  },
  rightIconButton: {
    padding: metrics.spacing.xs,
    marginLeft: metrics.spacing.sm,
  },
});

export const BaseInput = React.forwardRef<TextInput, BaseInputProps>(
  (
    {
      label,
      error,
      icon,
      variant = 'default',
      showPasswordToggle = false,
      style,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const isAuth = variant === 'auth';

    const containerStyle: ViewStyle = isAuth
      ? {
          borderColor: error ? '#FFFFFF' : 'transparent',
          backgroundColor: '#FFFFFF',
        }
      : {
          borderColor: error ? theme.colors.error : theme.colors.outline,
          backgroundColor: theme.colors.surface,
        };

    const placeholderTextColor: string = isAuth
      ? 'rgba(0, 0, 0, 0.38)'
      : theme.custom.textTertiary;
    const selectionColor = theme.colors.primary;
    const cursorColor = theme.colors.primary;
    const inputTextColor: string = isAuth ? '#111111' : theme.custom.text;
    const isSecure = showPasswordToggle
      ? !passwordVisible
      : secureTextEntry;

    return (
      <View style={isAuth ? styles.authContainer : styles.container}>
        {label && !isAuth && (
          <BaseText
            variant="bodyMedium"
            style={styles.label}
            children={label}
          />
        )}
        <View
          style={[
            isAuth ? styles.authInputContainer : styles.inputContainer,
            containerStyle,
          ]}
        >
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <TextInput
            ref={ref}
            {...props}
            secureTextEntry={isSecure}
            style={[
              isAuth ? styles.authInput : styles.input,
              { color: inputTextColor },
              style,
            ]}
            placeholderTextColor={
              props.placeholderTextColor ?? placeholderTextColor
            }
            selectionColor={selectionColor}
            cursorColor={cursorColor}
            underlineColorAndroid={
              isAuth ? 'transparent' : props.underlineColorAndroid
            }
          />
          {showPasswordToggle && (
            <TouchableOpacity
              style={styles.rightIconButton}
              onPress={() => setPasswordVisible(prev => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible ? 'Hide password' : 'Show password'
              }
            >
              <MaterialCommunityIcons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={isAuth ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.7)'}
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <BaseText
            variant="bodySm"
            color={isAuth ? '#FFFFFF' : theme.colors.error}
            style={styles.errorText}
            children={error}
          />
        )}
      </View>
    );
  }
);

BaseInput.displayName = 'BaseInput';
