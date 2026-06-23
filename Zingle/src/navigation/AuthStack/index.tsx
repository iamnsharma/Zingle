import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types';
import { BaseText, BaseButton } from '@components/atoms';
import { metrics } from '@styling/metrics';
import { useThemeStore } from '@stores';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
  header: {
    marginBottom: metrics.spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: metrics.spacing.md,
  },
  button: {
    marginTop: metrics.spacing.lg,
  },
  contentWrapper: {
    width: '100%',
  },
  centerText: {
    textAlign: 'center',
  },
});

// Landing Screen
const LandingScreen = ({ navigation }: any) => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <BaseText variant="h2" style={styles.title}>
          Welcome to Zingle
        </BaseText>
        <BaseText
          variant="body"
          style={styles.subtitle}
        >
          Where connections happen
        </BaseText>
      </View>

      <View style={styles.contentWrapper}>
        <BaseButton
          label="Sign In"
          variant="primary"
          size="lg"
          onPress={() => navigation.navigate('Login')}
        />
        <BaseButton
          label="Create Account"
          variant="secondary"
          size="lg"
          style={styles.button}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </View>
  );
};

// Login Screen
const LoginScreen = ({ navigation }: any) => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <BaseText variant="h2" style={styles.title}>
          Login
        </BaseText>
        <BaseText
          variant="body"
          style={styles.subtitle}
        >
          Sign in to your account
        </BaseText>
      </View>

      <View style={[styles.contentWrapper, { gap: metrics.spacing.lg }]}>
        <BaseText variant="bodySm" style={styles.centerText}>
          Login form coming soon...
        </BaseText>
        <BaseButton
          label="← Back"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

// Signup Screen
const SignupScreen = ({ navigation }: any) => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <BaseText variant="h2" style={styles.title}>
          Sign Up
        </BaseText>
        <BaseText
          variant="body"
          style={styles.subtitle}
        >
          Create a new account
        </BaseText>
      </View>

      <View style={[styles.contentWrapper, { gap: metrics.spacing.lg }]}>
        <BaseText variant="bodySm" style={styles.centerText}>
          Signup form coming soon...
        </BaseText>
        <BaseButton
          label="← Back"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

// Reset Password Screen
const ResetPasswordScreen = ({ navigation }: any) => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <BaseText variant="h2" style={styles.title}>
          Reset Password
        </BaseText>
        <BaseText
          variant="body"
          style={styles.subtitle}
        >
          Recover your account
        </BaseText>
      </View>

      <View style={[styles.contentWrapper, { gap: metrics.spacing.lg }]}>
        <BaseText variant="bodySm" style={styles.centerText}>
          Reset form coming soon...
        </BaseText>
        <BaseButton
          label="← Back"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
