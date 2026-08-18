import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface SheetNavRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  showChevron?: boolean;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    gap: metrics.spacing.xs,
  },
});

export const SheetNavRow: React.FC<SheetNavRowProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  danger,
  showChevron = true,
}) => {
  const { theme } = useThemeStore();
  const color = danger ? theme.custom.error : theme.custom.text;
  const iconColor = danger ? theme.custom.error : theme.colors.primary;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: danger
              ? theme.custom.error + '18'
              : theme.custom.surfaceVariant,
          },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.text}>
        <BaseText variant="bodyMedium" color={color} children={label} />
        {subtitle ? (
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children={subtitle}
          />
        ) : null}
      </View>
      {showChevron && onPress ? (
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.custom.textTertiary}
        />
      ) : null}
    </TouchableOpacity>
  );
};
