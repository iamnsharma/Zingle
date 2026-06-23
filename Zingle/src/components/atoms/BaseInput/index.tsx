import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface BaseInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: metrics.spacing.lg,
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
  input: {
    flex: 1,
    paddingVertical: metrics.spacing.md,
    fontSize: 16,
  },
  errorText: {
    marginTop: metrics.spacing.sm,
  },
  iconContainer: {
    marginRight: metrics.spacing.sm,
  },
});

export const BaseInput = React.forwardRef<TextInput, BaseInputProps>(
  ({ label, error, icon, style, ...props }, ref) => {
    const { theme } = useThemeStore();

    const containerStyle: ViewStyle = {
      borderColor: error ? theme.colors.error : theme.colors.outline,
      backgroundColor: theme.colors.surface,
    };

    const placeholderTextColor: string = theme.custom.textTertiary;
    const selectionColor: string = theme.colors.primary;
    const inputTextColor: string = theme.custom.text;

    return (
      <View style={styles.container}>
        {label && (
          <BaseText
            variant="bodyMedium"
            style={styles.label}
            children={label}
          />
        )}
        <View style={[styles.inputContainer, containerStyle]}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <TextInput
            ref={ref}
            {...props}
            style={[styles.input, { color: inputTextColor }, style]}
            placeholderTextColor={placeholderTextColor}
            selectionColor={selectionColor}
          />
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
