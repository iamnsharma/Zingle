import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText, BaseButton } from '@components/atoms';
import { metrics } from '@styling/metrics';
import { useThemeStore } from '@stores';
import { useAuthStore } from '@stores';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
  button: {
    marginTop: metrics.spacing.lg,
  },
});

export const ProfileScreen = () => {
  const { theme } = useThemeStore();
  const { logout } = useAuthStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <BaseText variant="h1" children="👤 Profile" />
      <BaseText
        variant="body"
        style={{ marginTop: metrics.spacing.md }}
        children="Your Profile Settings"
      />
      <BaseText
        variant="bodySm"
        style={{ marginTop: metrics.spacing.md, color: theme.custom.textTertiary }}
        children="Profile editor coming soon..."
      />

      <BaseButton
        label="Logout"
        variant="outline"
        style={styles.button}
        onPress={logout}
      />
    </View>
  );
};
