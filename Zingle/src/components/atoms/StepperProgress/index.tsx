import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ViewProps, Animated, Easing } from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface StepperProgressProps extends ViewProps {
  totalSteps: number;
  currentStep: number;
  showLabel?: boolean;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.sm,
  },
  stepLabel: {
    marginRight: metrics.spacing.md,
    minWidth: 36,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
  },
  stepTrack: {
    flex: 1,
    height: 5,
    borderRadius: metrics.radius.full,
    overflow: 'hidden',
  },
  stepFill: {
    height: '100%',
    borderRadius: metrics.radius.full,
  },
});

export const StepperProgress = React.forwardRef<View, StepperProgressProps>(
  (
    {
      totalSteps,
      currentStep,
      showLabel = true,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const progressAnim = useRef(new Animated.Value(currentStep)).current;

    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: currentStep,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, [currentStep, progressAnim]);

    return (
      <View ref={ref} style={[styles.container, customStyle]} {...props}>
        <View style={styles.header}>
          {showLabel && (
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.stepLabel}
              children={`${currentStep}/${totalSteps}`}
            />
          )}
          <View style={styles.progressContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
              const fillWidth = progressAnim.interpolate({
                inputRange: [index, index + 1],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              });

              return (
                <View
                  key={index}
                  style={[
                    styles.stepTrack,
                    { backgroundColor: theme.custom.border },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.stepFill,
                      {
                        width: fillWidth,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
);

StepperProgress.displayName = 'StepperProgress';
