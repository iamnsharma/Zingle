import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '@stores/authStore';
import type { AuthStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { validateEmail, validatePassword } from '@utils/validation';
import { buildLocalUser } from '@utils/localSession';
import { BaseText, BaseInput, GradientButton } from '@components/atoms';
import { AuthScreenLayout, AuthFooterLink } from '@components/molecules';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const styles = StyleSheet.create({
  form: {
    gap: metrics.spacing.md,
  },
  forgot: {
    alignItems: 'flex-end',
    marginTop: -metrics.spacing.xs,
    marginBottom: metrics.spacing.sm,
  },
  submit: {
    marginTop: metrics.spacing.sm,
  },
});

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuthStore();
  const passwordRef = React.useRef<TextInput>(null);

  const [email, setEmail] = React.useState('demo@example.com');
  const [password, setPassword] = React.useState('password123');
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [passwordError, setPasswordError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    setLoading(true);
    setTimeout(() => {
      login(buildLocalUser(email, email.split('@')[0]), 'local-session');
      setLoading(false);
    }, 400);
  };

  return (
    <AuthScreenLayout
      title="Sign in"
      subtitle="Welcome back — let's find your next match"
      onBack={() => navigation.goBack()}
      footer={
        <AuthFooterLink
          prompt="Don't have an account?"
          actionLabel="Sign up"
          onPress={() => navigation.navigate('Signup')}
        />
      }
    >
      <View style={styles.form}>
        <BaseInput
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
          onSubmitEditing={handleLogin}
          editable={!loading}
        />
        <View style={styles.forgot}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
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
          disabled={loading}
          loading={loading}
          style={styles.submit}
        />
      </View>
    </AuthScreenLayout>
  );
};
