import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
});

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  right,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.header, { borderBottomColor: theme.custom.border }]}>
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={theme.custom.text}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <BaseText variant="h3" color={theme.custom.text} children={title} />
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
};
