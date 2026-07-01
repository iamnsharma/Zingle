import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface SectionHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    marginTop: metrics.spacing.xs,
  },
  action: {
    marginLeft: metrics.spacing.md,
  },
});

export const SectionHeader = React.forwardRef<View, SectionHeaderProps>(
  (
    {
      title,
      subtitle,
      action,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();

    return (
      <View ref={ref} style={[styles.container, customStyle]} {...props}>
        <View style={styles.textContainer}>
          <BaseText
            variant="h2"
            color={theme.custom.text}
            style={styles.title}
            children={title}
          />
          {subtitle && (
            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              style={styles.subtitle}
              children={subtitle}
            />
          )}
        </View>
        {action && (
          <View style={styles.action}>
            {action}
          </View>
        )}
      </View>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
