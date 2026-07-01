import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AnimatedInterestChipProps {
  label: string;
  iconName: string;
  selected?: boolean;
  onPress?: () => void;
  index?: number;
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: metrics.spacing.sm,
    marginBottom: metrics.spacing.sm,
  },
  chip: {
    borderRadius: metrics.radius.full,
    paddingLeft: metrics.spacing.md,
    paddingRight: metrics.spacing.sm,
    paddingVertical: metrics.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    minHeight: 44,
    borderWidth: 1.5,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
    paddingRight: metrics.spacing.xs,
  },
  checkWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  iconWrapUnselected: {},
  labelBold: {
    fontWeight: '600',
  },
  checkSelected: {
    backgroundColor: '#FFFFFF',
  },
  checkUnselected: {
    backgroundColor: 'transparent',
  },
});

export const AnimatedInterestChip: React.FC<AnimatedInterestChipProps> = ({
  label,
  iconName,
  selected = false,
  onPress,
  index = 0,
}) => {
  const { theme } = useThemeStore();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 35,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay: index * 35,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, scale]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.spring(checkAnim, {
      toValue: selected ? 1 : 0,
      friction: 6,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [selected, checkAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  const checkRotation = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ scale: Animated.multiply(scale, pressScale) }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View
          style={[
            styles.chip,
            {
              backgroundColor: selected
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor: selected ? theme.colors.primary : theme.custom.border,
              ...(selected ? metrics.shadows.md : metrics.shadows.sm),
            },
          ]}
        >
          <View
            style={[
              styles.iconWrap,
              selected ? styles.iconWrapSelected : styles.iconWrapUnselected,
              !selected && { backgroundColor: theme.custom.surfaceVariant },
            ]}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={16}
              color={selected ? '#FFFFFF' : theme.colors.primary}
            />
          </View>

          <BaseText
            variant="body"
            color={selected ? '#FFFFFF' : theme.custom.text}
            style={[styles.label, selected && styles.labelBold]}
            children={label}
          />

          <Animated.View
            style={[
              styles.checkWrap,
              selected ? styles.checkSelected : styles.checkUnselected,
              {
                transform: [{ scale: checkAnim }, { rotate: checkRotation }],
                opacity: checkAnim,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="check"
              size={14}
              color={theme.colors.primary}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
