import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing, ViewProps } from 'react-native';

interface OnboardingStepTransitionProps extends ViewProps {
  stepKey: number;
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const OnboardingStepTransition: React.FC<OnboardingStepTransitionProps> = ({
  stepKey,
  children,
  style,
  ...props
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(28)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(28);
    scale.setValue(0.97);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        friction: 9,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stepKey, fade, slide, scale]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fade,
          transform: [{ translateY: slide }, { scale }],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
