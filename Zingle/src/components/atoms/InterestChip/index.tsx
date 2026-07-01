import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface InterestChipProps extends Omit<TouchableOpacityProps, 'onPress'> {
  label: string;
  selected?: boolean;
  onPress?: (selected: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: metrics.spacing.sm,
    marginBottom: metrics.spacing.sm,
  },
  smChip: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
  },
  mdChip: {
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
  },
  lgChip: {
    paddingHorizontal: metrics.spacing.xl,
    paddingVertical: metrics.spacing.md,
  },
  label: {
    marginLeft: metrics.spacing.xs,
  },
  chipSelected: {
    borderWidth: 0,
  },
  chipUnselected: {
    borderWidth: 1,
  },
});

export const InterestChip = React.forwardRef<View, InterestChipProps>(
  (
    {
      label,
      selected = false,
      onPress,
      size = 'md',
      icon,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePress = React.useCallback(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();

      onPress?.(!selected);
    }, [selected, onPress, scaleAnim]);

    const sizeStyle = styles[`${size}Chip`] || styles.mdChip;

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
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
              sizeStyle,
              selected ? styles.chipSelected : styles.chipUnselected,
              {
                backgroundColor: selected
                  ? theme.colors.primary
                  : theme.custom.surfaceVariant,
                borderColor: selected ? theme.colors.primary : theme.custom.border,
              },
            ]}
          >
            {icon && (
              <BaseText
                variant="body"
                color={selected ? '#FFFFFF' : theme.custom.text}
                children={icon}
              />
            )}
            <BaseText
              variant="body"
              color={selected ? '#FFFFFF' : theme.custom.text}
              style={icon ? styles.label : undefined}
              children={label}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

InterestChip.displayName = 'InterestChip';
