import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface FilterChipProps extends Omit<TouchableOpacityProps, 'onPress'> {
  label: string;
  selected?: boolean;
  onPress?: (selected: boolean) => void;
  variant?: 'filter' | 'tag';
  removable?: boolean;
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: metrics.radius.md,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: metrics.spacing.sm,
    marginBottom: metrics.spacing.sm,
  },
  label: {
    marginRight: metrics.spacing.sm,
  },
  closeIcon: {
    marginLeft: metrics.spacing.xs,
    fontWeight: 'bold',
  },
  chipSelected: {
    borderWidth: 0,
  },
  chipUnselected: {
    borderWidth: 1,
  },
});

export const FilterChip = React.forwardRef<View, FilterChipProps>(
  (
    {
      label,
      selected = false,
      onPress,
      variant: _variant = 'filter',
      removable = false,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();

    const handlePress = React.useCallback(() => {
      onPress?.(!selected);
    }, [selected, onPress]);

    return (
      <TouchableOpacity
        ref={ref}
        {...props}
        onPress={handlePress}
        activeOpacity={0.7}
        style={customStyle}
      >
        <View
          style={[
            styles.chip,
            selected ? styles.chipSelected : styles.chipUnselected,
            {
              backgroundColor: selected
                ? theme.colors.primary
                : theme.custom.surfaceVariant,
              borderColor: selected ? theme.colors.primary : theme.custom.border,
            },
          ]}
        >
          <BaseText
            variant="body"
            color={selected ? '#FFFFFF' : theme.custom.text}
            style={removable ? styles.label : undefined}
            children={label}
          />
          {removable && selected && (
            <BaseText
              variant="body"
              color="#FFFFFF"
              style={styles.closeIcon}
              children="×"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

FilterChip.displayName = 'FilterChip';
