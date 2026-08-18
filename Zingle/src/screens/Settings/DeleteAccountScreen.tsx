import React from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useAuthStore,
  useMembershipStore,
  useOnboardingStore,
  useProfileStore,
  useThemeStore,
} from '@stores';
import type { MainAppNavigationProp } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton, SafeAreaContainer } from '@components/atoms';
import { ScreenHeader } from '@components/molecules';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing['3xl'],
  },
  title: {
    marginBottom: metrics.spacing.sm,
  },
  body: {
    lineHeight: 22,
    marginBottom: metrics.spacing.lg,
  },
  bullet: {
    lineHeight: 22,
    marginBottom: metrics.spacing.xs,
  },
  warning: {
    marginTop: metrics.spacing.md,
    marginBottom: metrics.spacing.xl,
    lineHeight: 22,
  },
});

export const DeleteAccountScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<MainAppNavigationProp>();
  const logout = useAuthStore(state => state.logout);
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  const setCurrentUser = useProfileStore(state => state.setCurrentUser);
  const resetMembership = useMembershipStore(state => state.reset);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete account?',
      'This cannot be undone. Your profile, photos, matches, and messages will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ],
    );
  };

  const confirmDelete = () => {
    setLoading(true);
    resetOnboarding();
    setCurrentUser(undefined);
    resetMembership();
    logout();
    setLoading(false);
  };

  return (
    <SafeAreaContainer>
      <ScreenHeader title="Delete account" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <BaseText
          variant="h2"
          color={theme.custom.text}
          style={styles.title}
          children="We're sorry to see you go"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.body}
          children="Deleting your account permanently removes:"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.bullet}
          children="• Your profile, photos, and preferences"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.bullet}
          children="• Matches and conversations"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.bullet}
          children="• Likes, passes, and discovery history"
        />
        <BaseText
          variant="body"
          color={theme.custom.error}
          style={styles.warning}
          children="This cannot be undone. You will need to create a new account to use Zingle again."
        />
        <GradientButton
          label={loading ? 'Deleting...' : 'Delete my account'}
          size="lg"
          onPress={handleDelete}
          disabled={loading}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaContainer>
  );
};
