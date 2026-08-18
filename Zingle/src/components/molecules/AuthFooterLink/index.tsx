import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface AuthFooterLinkProps {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing.md,
  },
  action: {
    fontWeight: '700',
  },
});

export const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({
  prompt,
  actionLabel,
  onPress,
}) => (
  <View style={styles.row}>
    <BaseText variant="body" color="rgba(255, 255, 255, 0.7)" children={prompt} />
    <TouchableOpacity onPress={onPress}>
      <BaseText variant="body" color="#FFFFFF" style={styles.action} children={actionLabel} />
    </TouchableOpacity>
  </View>
);
