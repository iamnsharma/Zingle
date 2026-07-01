import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '@stores';
import { useOnboardingStore } from '@stores/onboardingStore';
import { metrics } from '@styling/metrics';
import { BaseText, BaseInput } from '@components/atoms';

const styles = StyleSheet.create({
  container: {
    gap: metrics.spacing.lg,
  },
  inputContainer: {
    gap: metrics.spacing.sm,
  },
  inputLabel: {
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    marginBottom: metrics.spacing.md,
  },
});

export const OnboardingStep1: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();

  const handleNameChange = (name: string) => {
    updateData({ name });
  };

  const handleBirthDateChange = (birthDate: string) => {
    // Calculate age from date
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      updateData({ birthDate, age });
    } else {
      updateData({ birthDate });
    }
  };

  return (
    <View style={styles.container}>
      <BaseText
        variant="h3"
        color={theme.custom.textSecondary}
        style={styles.subtitle}
        children="Tell us your name and birthday"
      />

      <View style={styles.inputContainer}>
        <BaseText
          variant="body"
          color={theme.custom.text}
          style={styles.inputLabel}
          children="Full Name"
        />
        <BaseInput
          placeholder="Enter your full name"
          value={data.name || ''}
          onChangeText={handleNameChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <BaseText
          variant="body"
          color={theme.custom.text}
          style={styles.inputLabel}
          children="Birth Date (YYYY-MM-DD)"
        />
        <BaseInput
          placeholder="2000-01-15"
          value={data.birthDate || ''}
          onChangeText={handleBirthDateChange}
          keyboardType="default"
        />
      </View>

      {data.age && (
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          children={`You are ${data.age} years old`}
        />
      )}
    </View>
  );
};
