import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useThemeStore } from '@stores';
import type { AuthStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton, GoogleButton } from '@components/atoms';
import { AuthBackground } from '@components/molecules';

type LandingScreenProps = NativeStackScreenProps<AuthStackParamList, 'Landing'>;

const styles = StyleSheet.create({
  gradientOverlay: {
    justifyContent: 'space-between',
    paddingVertical: metrics.spacing['2xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
  logo: {
    fontSize: 52,
    marginBottom: metrics.spacing.lg,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: metrics.spacing.md,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: metrics.spacing.lg,
    gap: metrics.spacing.md,
    marginBottom: metrics.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: metrics.spacing.md,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing.lg,
    marginBottom: metrics.spacing.md,
  },
  dividerVertical: {
    width: 1,
    height: 20,
  },
  footerButton: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
  },
  privacyContainer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
  },
  privacyText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

export const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();

  const handleGoogleLogin = () => {
    Alert.alert(
      'Coming Soon',
      'Google login will be integrated with backend.',
      [{ text: 'OK' }]
    );
  };

  return (
    <AuthBackground contentStyle={styles.gradientOverlay}>
      <View style={styles.content}>
        <BaseText
          variant="h1"
          color="#FFFFFF"
          style={styles.logo}
          children="Zingle"
        />
        <BaseText
          variant="h2"
          color="#FFFFFF"
          style={styles.tagline}
          children="Swipe Right®"
        />
        <BaseText
          variant="h3"
          color="rgba(255, 255, 255, 0.85)"
          style={styles.subtitle}
          children="It starts with a swipe"
        />
      </View>

      <View>
        <View style={styles.buttonContainer}>
          <GradientButton
            label="Create account"
            size="lg"
            onPress={() => navigation.navigate('Signup')}
          />
          <GoogleButton onPress={handleGoogleLogin} />
        </View>

        <View style={styles.divider}>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.custom.glassLight }]}
          />
          <BaseText
            variant="body"
            color="rgba(255, 255, 255, 0.75)"
            style={styles.dividerText}
            children="Already have an account?"
          />
          <View
            style={[styles.dividerLine, { backgroundColor: theme.custom.glassLight }]}
          />
        </View>

        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('Login')}
          >
            <BaseText variant="body" color="#FFFFFF" children="Sign in" />
          </TouchableOpacity>
          <View
            style={[
              styles.dividerVertical,
              { backgroundColor: theme.custom.glassLight },
            ]}
          />
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <BaseText variant="body" color="#FFFFFF" children="Sign up" />
          </TouchableOpacity>
        </View>

        <View style={styles.privacyContainer}>
          <BaseText
            variant="caption"
            color="rgba(255, 255, 255, 0.55)"
            style={styles.privacyText}
            children="By tapping Create account or Sign in, you agree to our Terms. Learn how we process your data in our Privacy Policy."
          />
        </View>
      </View>
    </AuthBackground>
  );
};
