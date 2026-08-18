import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: metrics.spacing.xl,
    gap: metrics.spacing.sm,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginTop: metrics.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  action: {
    marginTop: metrics.spacing.md,
    width: '100%',
  },
});

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  action,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons
        name={icon}
        size={48}
        color={theme.custom.textTertiary}
      />
      <BaseText
        variant="h3"
        color={theme.custom.text}
        style={styles.title}
        children={title}
      />
      {subtitle ? (
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.subtitle}
          children={subtitle}
        />
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
};
