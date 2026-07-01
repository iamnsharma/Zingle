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
    marginBottom: metrics.spacing.md,
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
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: metrics.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: metrics.spacing.md,
    fontSize: 16,
  },
  authInput: {
    flex: 1,
    paddingVertical: metrics.spacing.sm,
    fontSize: 18,
    fontWeight: '400',
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
          borderBottomColor: error
            ? theme.colors.error
            : 'rgba(255, 255, 255, 0.6)',
          backgroundColor: 'transparent',
        }
      : {
          borderColor: error ? theme.colors.error : theme.colors.outline,
          backgroundColor: theme.colors.surface,
        };

    const placeholderTextColor: string = isAuth
      ? 'rgba(255, 255, 255, 0.5)'
      : theme.custom.textTertiary;
    const selectionColor: string = isAuth ? '#FFFFFF' : theme.colors.primary;
    const cursorColor: string = isAuth ? '#FFFFFF' : theme.colors.primary;
    const inputTextColor: string = isAuth ? '#FFFFFF' : theme.custom.text;
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
                color="rgba(255, 255, 255, 0.7)"
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <BaseText
            variant="bodySm"
            color={theme.colors.error}
            style={styles.errorText}
            children={error}
          />
        )}
      </View>
    );
  }
);

BaseInput.displayName = 'BaseInput';
