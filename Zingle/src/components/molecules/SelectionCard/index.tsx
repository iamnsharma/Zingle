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

interface SelectionCardProps {
  label: string;
  iconName: string;
  selected?: boolean;
  onPress?: () => void;
  index?: number;
}

const styles = StyleSheet.create({
  wrapper: {
    width: '47%',
    marginBottom: metrics.spacing.md,
  },
  card: {
    borderRadius: metrics.radius.xl,
    paddingVertical: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 110,
    justifyContent: 'center',
    gap: metrics.spacing.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: metrics.spacing.sm,
    right: metrics.spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconCircleSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  iconCircleUnselected: {},
  labelBold: {
    fontWeight: '700',
  },
  labelNormal: {
    fontWeight: '500',
  },
});

export const SelectionCard: React.FC<SelectionCardProps> = ({
  label,
  iconName,
  selected = false,
  onPress,
  index = 0,
}) => {
  const { theme } = useThemeStore();
  const enter = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 450,
      delay: index * 80,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.spring(checkAnim, {
      toValue: selected ? 1 : 0,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [selected, checkAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.96,
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

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: enter,
          transform: [{ translateY }, { scale: pressScale }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: selected
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor: selected ? theme.colors.primary : theme.custom.border,
              ...(selected ? metrics.shadows.lg : metrics.shadows.sm),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.checkBadge,
              {
                transform: [{ scale: checkAnim }],
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

          <View
            style={[
              styles.iconCircle,
              selected
                ? styles.iconCircleSelected
                : [
                    styles.iconCircleUnselected,
                    { backgroundColor: theme.custom.surfaceVariant },
                  ],
            ]}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={26}
              color={selected ? '#FFFFFF' : theme.colors.primary}
            />
          </View>

          <BaseText
            variant="bodyMedium"
            color={selected ? '#FFFFFF' : theme.custom.text}
            style={selected ? styles.labelBold : styles.labelNormal}
            children={label}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
