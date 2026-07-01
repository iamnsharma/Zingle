import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { useOnboardingStore } from '@stores/onboardingStore';
import { metrics } from '@styling/metrics';
import { StepperProgress, BaseText, SafeAreaContainer, GradientButton } from '@components/atoms';
import { OnboardingStepTransition } from '@components/molecules';
import { TOTAL_ONBOARDING_STEPS, ONBOARDING_STEPS, MIN_INTERESTS } from '@constants/onboarding';
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
  header: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
    paddingBottom: metrics.spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    gap: metrics.spacing.xs,
    paddingRight: metrics.spacing.md,
  },
  skipButton: {
    padding: metrics.spacing.xs,
  },
  skipBold: {
    fontWeight: '600',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.lg,
    gap: metrics.spacing.md,
    borderTopWidth: 1,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.xs,
  },
  keyboardAvoid: {
    flex: 1,
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
  const stepMeta = ONBOARDING_STEPS[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_ONBOARDING_STEPS;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return Boolean(data.name?.trim() && data.age && data.age >= 18);
      case 2:
        return Boolean(data.height && data.gender);
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
    <SafeAreaContainer>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <BaseText
            variant="h2"
            color={theme.custom.text}
            children={stepMeta?.title}
          />
          <BaseText
            variant="body"
            color={theme.custom.textSecondary}
            children={stepMeta?.subtitle}
          />
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <BaseText
            variant="body"
            color={theme.custom.textTertiary}
            style={styles.skipBold}
            children="Skip"
          />
        </TouchableOpacity>
      </View>

      <StepperProgress
        totalSteps={TOTAL_ONBOARDING_STEPS}
        currentStep={currentStep}
        showLabel
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingStepTransition stepKey={currentStep}>
            {CurrentStep && <CurrentStep />}
          </OnboardingStepTransition>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { borderTopColor: theme.custom.border }]}>
        <GradientButton
          label={isLastStep ? 'Start swiping 🎉' : 'Continue'}
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
      </View>
    </SafeAreaContainer>
  );
};
