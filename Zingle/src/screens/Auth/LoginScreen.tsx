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
import type { AuthStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, BaseInput, GradientButton, GoogleButton } from '@components/atoms';
import { AuthBackground } from '@components/molecules';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

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
    paddingTop: metrics.spacing['2xl'],
  },
  title: {
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    marginBottom: metrics.spacing['2xl'],
    lineHeight: 22,
  },
  form: {
    gap: metrics.spacing.md,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: metrics.spacing.xs,
    marginBottom: metrics.spacing.lg,
  },
  spacer: {
    flex: 1,
    minHeight: metrics.spacing['2xl'],
  },
  socialSection: {
    paddingTop: metrics.spacing.md,
    gap: metrics.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing.md,
  },
  scrollGrow: {
    flexGrow: 1,
  },
  linkBold: {
    fontWeight: '700',
  },
});

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { login } = useAuthStore();
  const passwordRef = React.useRef<TextInput>(null);

  const [email, setEmail] = React.useState('demo@example.com');
  const [password, setPassword] = React.useState('password123');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 800));

      login(
        {
          id: '1',
          displayName: email.split('@')[0],
          email,
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'mock-token-' + Date.now()
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Coming Soon',
      'Google login will be integrated with backend.',
      [{ text: 'OK' }]
    );
  };

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
            children="Sign in"
          />
          <BaseText
            variant="body"
            color="rgba(255, 255, 255, 0.75)"
            style={styles.subtitle}
            children="Welcome back — let's find your next match"
          />

          <View style={styles.form}>
            <BaseInput
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
              onSubmitEditing={handleLogin}
              editable={!loading}
            />

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={() => console.log('Forgot password')}>
                <BaseText
                  variant="caption"
                  color="rgba(255, 255, 255, 0.85)"
                  children="Forgot password?"
                />
              </TouchableOpacity>
            </View>

            <GradientButton
              label={loading ? 'Signing in...' : 'Sign in'}
              size="lg"
              onPress={handleLogin}
              disabled={loading || !email || !password}
              loading={loading}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.socialSection}>
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

          <GoogleButton onPress={handleGoogleLogin} />
        </View>

        <View style={styles.footer}>
          <BaseText
            variant="body"
            color="rgba(255, 255, 255, 0.7)"
            children="Don't have an account?"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <BaseText
              variant="body"
              color="#FFFFFF"
              style={styles.linkBold}
              children="Sign up"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AuthBackground>
  );
};
