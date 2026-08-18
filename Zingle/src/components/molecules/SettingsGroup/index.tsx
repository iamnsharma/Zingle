import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';

interface SettingsGroupProps {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    paddingHorizontal: metrics.spacing.md,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});

export const SettingsGroup: React.FC<SettingsGroupProps> = ({ children }) => {
  const { theme } = useThemeStore();
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.custom.surfaceVariant,
          borderColor: theme.custom.border,
        },
      ]}
    >
      {items.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <View style={[styles.divider, { backgroundColor: theme.custom.border }]} />
          ) : null}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
};
