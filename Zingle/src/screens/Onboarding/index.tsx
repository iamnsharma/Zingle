import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { useOnboardingStore } from '@stores/onboardingStore';
import { metrics } from '@styling/metrics';
import { StepperProgress, BaseText, SafeAreaContainer, GradientButton } from '@components/atoms';
import { OnboardingStepTransition } from '@components/molecules';
import { TOTAL_ONBOARDING_STEPS, MIN_INTERESTS } from '@constants/onboarding';
import {
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
  OnboardingStep6,
  OnboardingStep7,
} from './steps';

interface OnboardingContainerProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.xs,
    paddingBottom: metrics.spacing.sm,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
  },
  skipBold: {
    fontWeight: '600',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: metrics.radius['2xl'],
    borderTopRightRadius: metrics.radius['2xl'],
    marginTop: metrics.spacing.sm,
    overflow: 'hidden',
    ...metrics.shadows.lg,
  },
  sheetHandleArea: {
    alignItems: 'center',
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.xs,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
    paddingBottom: metrics.spacing['2xl'],
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.md,
    gap: metrics.spacing.sm,
    borderTopWidth: 1,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.sm,
  },
});

const STEPS = [
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
  OnboardingStep6,
  OnboardingStep7,
];

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onComplete,
  onSkip,
}) => {
  const { theme } = useThemeStore();
  const { currentStep, setCurrentStep, completeOnboarding, data } =
    useOnboardingStore();

  const CurrentStep = STEPS[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_ONBOARDING_STEPS;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return Boolean(data.name?.trim() && data.age && data.age >= 18);
      case 2:
        return Boolean(data.gender);
      case 3:
        return Boolean(data.bio?.trim() && (data.bio?.length || 0) >= 20);
      case 4:
        return ((data.interests as string[]) || []).length >= MIN_INTERESTS;
      case 6:
        return Boolean(
          typeof data.location === 'object' && data.location?.city?.trim()
        );
      default:
        return true;
    }
  }, [currentStep, data]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;
    if (currentStep < TOTAL_ONBOARDING_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      onComplete?.();
    }
  }, [
    canProceed,
    currentStep,
    setCurrentStep,
    completeOnboarding,
    onComplete,
  ]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  return (
    <SafeAreaContainer style={[styles.root, { backgroundColor: theme.custom.surfaceVariant }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: theme.colors.surface }]}
          onPress={onSkip}
        >
          <BaseText
            variant="body"
            color={theme.custom.textSecondary}
            style={styles.skipBold}
            children="Skip"
          />
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={theme.custom.textTertiary}
          />
        </TouchableOpacity>
      </View>

      <StepperProgress
        totalSteps={TOTAL_ONBOARDING_STEPS}
        currentStep={currentStep}
        showLabel
      />

      <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.sheetHandleArea}>
          <View
            style={[styles.sheetHandle, { backgroundColor: theme.custom.border }]}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <OnboardingStepTransition stepKey={currentStep}>
              {CurrentStep && <CurrentStep />}
            </OnboardingStepTransition>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.custom.border,
          },
        ]}
      >
        <GradientButton
          label={isLastStep ? 'Start swiping' : 'Continue'}
          size="lg"
          onPress={handleNext}
          disabled={!canProceed()}
        />

        {!isFirstStep && (
          <TouchableOpacity style={styles.backRow} onPress={handlePrevious}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={theme.custom.textSecondary}
            />
            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              children="Back"
            />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </SafeAreaContainer>
  );
};
