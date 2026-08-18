import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { validateEmail } from '@utils/validation';
import { BaseInput, GradientButton } from '@components/atoms';
import { AuthScreenLayout } from '@components/molecules';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

const styles = StyleSheet.create({
  form: {
    gap: metrics.spacing.md,
  },
  submit: {
    marginTop: metrics.spacing.sm,
  },
});

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = () => {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    if (nextEmailError) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Check your email',
        "If an account exists for that address, we'll send a reset link.",
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    }, 400);
  };

  return (
    <AuthScreenLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send a reset link if an account exists"
      onBack={() => navigation.goBack()}
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
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!loading}
        />
        <GradientButton
          label={loading ? 'Sending...' : 'Send reset link'}
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          style={styles.submit}
        />
      </View>
    </AuthScreenLayout>
  );
};
