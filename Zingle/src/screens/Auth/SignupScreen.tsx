import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '@stores/authStore';
import { useOnboardingStore } from '@stores/onboardingStore';
import type { AuthStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { validateEmail, validateName, validatePassword } from '@utils/validation';
import { buildLocalUser } from '@utils/localSession';
import { BaseText, BaseInput, GradientButton } from '@components/atoms';
import { AuthScreenLayout, AuthFooterLink } from '@components/molecules';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const styles = StyleSheet.create({
  form: {
    gap: metrics.spacing.md,
  },
  submit: {
    marginTop: metrics.spacing.sm,
  },
  privacy: {
    textAlign: 'center',
    marginTop: metrics.spacing.lg,
    lineHeight: 18,
    paddingHorizontal: metrics.spacing.sm,
  },
});

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [nameError, setNameError] = React.useState<string | undefined>();
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [passwordError, setPasswordError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  const handleSignup = () => {
    const nextNameError = validateName(name);
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password, { requireStrength: true });
    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextNameError || nextEmailError || nextPasswordError) return;

    setLoading(true);
    setTimeout(() => {
      resetOnboarding();
      login(buildLocalUser(email, name), 'local-session');
      setLoading(false);
    }, 400);
  };

  return (
    <AuthScreenLayout
      title="Create account"
      subtitle="Join Zingle and start meeting people nearby"
      onBack={() => navigation.goBack()}
      footer={
        <AuthFooterLink
          prompt="Already have an account?"
          actionLabel="Sign in"
          onPress={() => navigation.navigate('Login')}
        />
      }
    >
      <View style={styles.form}>
        <BaseInput
          variant="auth"
          placeholder="First name"
          value={name}
          onChangeText={value => {
            setName(value);
            if (nameError) setNameError(undefined);
          }}
          error={nameError}
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
          onChangeText={value => {
            setEmail(value);
            if (emailError) setEmailError(undefined);
          }}
          error={emailError}
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
          onChangeText={value => {
            setPassword(value);
            if (passwordError) setPasswordError(undefined);
          }}
          error={passwordError}
          showPasswordToggle
          returnKeyType="done"
          onSubmitEditing={handleSignup}
          editable={!loading}
        />
        <GradientButton
          label={loading ? 'Creating account...' : 'Continue'}
          size="lg"
          onPress={handleSignup}
          disabled={loading}
          loading={loading}
          style={styles.submit}
        />
        <BaseText
          variant="caption"
          color="rgba(255, 255, 255, 0.55)"
          style={styles.privacy}
          children="By tapping Continue, you agree to our Terms of Service and Privacy Policy"
        />
      </View>
    </AuthScreenLayout>
  );
};
