import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface SheetToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  textWrap: {
    flex: 1,
    gap: metrics.spacing.xs,
  },
});

export const SheetToggleRow: React.FC<SheetToggleRowProps> = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <BaseText variant="bodyMedium" color={theme.custom.text} children={label} />
        {description ? (
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children={description}
          />
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.custom.border,
          true: theme.colors.primary,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={theme.custom.border}
      />
    </View>
  );
};
