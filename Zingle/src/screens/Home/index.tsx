import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@components/atoms';
import { metrics } from '@styling/metrics';
import { useThemeStore } from '@stores';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
});

export const HomeScreen = () => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <BaseText variant="h1" children="🔥 Home Screen" />
      <BaseText
        variant="body"
        style={{ marginTop: metrics.spacing.md }}
        children="Discover & Swipe"
      />
      <BaseText
        variant="bodySm"
        style={{ marginTop: metrics.spacing.md, color: theme.custom.textTertiary }}
        children="Swipe card feature coming soon..."
      />
    </View>
  );
};
