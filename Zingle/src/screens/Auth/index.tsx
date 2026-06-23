import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@components/atoms';
import { metrics } from '@styling/metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
});

export const AuthScreen = () => {
  return (
    <View style={styles.container}>
      <BaseText variant="h1" children="Auth Screen" />
      <BaseText variant="body" children="Coming soon..." />
    </View>
  );
};
