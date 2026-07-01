import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useThemeStore } from '@stores';
import { useAuthStore } from '@stores/authStore';
import { useOnboardingStore } from '@stores/onboardingStore';
import type { AuthStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, BaseInput, GradientButton, GoogleButton } from '@components/atoms';
import { AuthBackground } from '@components/molecules';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const styles = StyleSheet.create({
  gradientOverlay: {
    paddingHorizontal: metrics.spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
    minHeight: 44,
  },
  backButton: {
    padding: metrics.spacing.xs,
    marginLeft: -metrics.spacing.xs,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  formSection: {
    paddingTop: metrics.spacing.xl,
  },
  title: {
    marginBottom: metrics.spacing['2xl'],
  },
  form: {
    gap: metrics.spacing.sm,
  },
  spacer: {
    flex: 1,
    minHeight: metrics.spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: metrics.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: metrics.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.sm,
  },
  privacyText: {
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
    lineHeight: 18,
  },
  scrollGrow: {
    flexGrow: 1,
  },
  submitButton: {
    marginTop: metrics.spacing.xl,
  },
  linkBold: {
    fontWeight: '700',
  },
});

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 800));

      resetOnboarding();

      login(
        {
          id: Math.random().toString(36).substr(2, 9),
          displayName: name,
          email,
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'mock-token-' + Date.now()
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert(
      'Coming Soon',
      'Google signup will be integrated with backend.',
      [{ text: 'OK' }]
    );
  };

  const canSubmit = name.trim() && email.trim() && password.trim();

  return (
    <AuthBackground contentStyle={styles.gradientOverlay}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollGrow}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <BaseText
              variant="h1"
              color="#FFFFFF"
              style={styles.logo}
              children="Zingle"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <BaseText
            variant="h2"
            color="#FFFFFF"
            style={styles.title}
            children="Create account"
          />

          <View style={styles.form}>
            <BaseInput
              variant="auth"
              placeholder="First name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => emailRef.current?.focus()}
              editable={!loading}
            />

            <BaseInput
              ref={emailRef}
              variant="auth"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!loading}
            />

            <BaseInput
              ref={passwordRef}
              variant="auth"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              showPasswordToggle
              returnKeyType="done"
              onSubmitEditing={handleSignup}
              editable={!loading}
            />

            <GradientButton
              label={loading ? 'Creating account...' : 'Continue'}
              size="lg"
              onPress={handleSignup}
              disabled={loading || !canSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.divider}>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.custom.glassLight }]}
          />
          <BaseText
            variant="body"
            color="rgba(255, 255, 255, 0.6)"
            style={styles.dividerText}
            children="OR"
          />
          <View
            style={[styles.dividerLine, { backgroundColor: theme.custom.glassLight }]}
          />
        </View>

        <GoogleButton onPress={handleGoogleSignup} />

        <BaseText
          variant="caption"
          color="rgba(255, 255, 255, 0.55)"
          style={styles.privacyText}
          children="By tapping Continue, you agree to our Terms of Service and Privacy Policy"
        />

        <View style={styles.footer}>
          <BaseText
            variant="body"
            color="rgba(255, 255, 255, 0.7)"
            children="Already have an account?"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <BaseText
              variant="body"
              color="#FFFFFF"
              style={styles.linkBold}
              children="Sign in"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AuthBackground>
  );
};
