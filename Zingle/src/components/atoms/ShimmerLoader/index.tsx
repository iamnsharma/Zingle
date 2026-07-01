import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';

interface ShimmerLoaderProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  variant?: 'card' | 'avatar' | 'line' | 'rect';
}

const styles = StyleSheet.create({
  shimmer: {
    overflow: 'hidden',
  },
  shimmerContent: {
    flex: 1,
  },
});

export const ShimmerLoader = React.forwardRef<View, ShimmerLoaderProps>(
  (
    {
      width = '100%',
      height = 200,
      borderRadius = metrics.radius.lg,
      variant = 'rect',
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const { width: screenWidth } = useWindowDimensions();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      );
      animation.start();
      return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.8, 0.3],
    });

    const sizeStyle = React.useMemo(() => {
      const widthValue = typeof width === 'number' ? width : screenWidth - metrics.spacing.lg * 2;

      switch (variant) {
        case 'avatar':
          return { width: 60, height: 60, borderRadius: metrics.radius.full };
        case 'line':
          return { width: widthValue, height: 16 as any, borderRadius: metrics.radius.sm };
        case 'card':
          return { width: widthValue, height: 300, borderRadius: metrics.radius.lg };
        default:
          return {
            width: typeof width === 'string' ? widthValue : width,
            height: height as any,
            borderRadius,
          };
      }
    }, [variant, width, height, borderRadius, screenWidth]);

    return (
      <View
        ref={ref}
        style={[
          styles.shimmer,
          sizeStyle,
          {
            backgroundColor: theme.custom.surfaceVariant,
          },
          customStyle,
        ]}
        {...props}
      >
        <Animated.View
          style={[
            styles.shimmerContent,
            {
              backgroundColor: theme.custom.border,
              opacity,
            },
          ]}
        />
      </View>
    );
  }
);

ShimmerLoader.displayName = 'ShimmerLoader';
