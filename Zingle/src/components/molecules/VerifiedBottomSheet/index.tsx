import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useProfileStore, useOnboardingStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';
import {
  canSubmitVerification,
  DEFAULT_MY_PROFILE,
  getVerificationRequirements,
  profileToOnboardingData,
} from '@utils/profileUtils';

interface VerifiedBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DISMISS_THRESHOLD = 120;

export const VerifiedBottomSheet: React.FC<VerifiedBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { currentUser, updateCurrentUser } = useProfileStore();
  const { updateData: updateOnboardingData } = useOnboardingStore();

  const profile = currentUser ?? DEFAULT_MY_PROFILE;
  const requirements = useMemo(
    () => getVerificationRequirements(profile),
    [profile],
  );
  const canSubmit = canSubmitVerification(profile);
  const isVerified = profile.verified;

  const [selfieConfirmed, setSelfieConfirmed] = useState(false);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = screenHeight * 0.78;

  useEffect(() => {
    if (visible) {
      setSelfieConfirmed(false);
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, sheetHeight, translateY, backdropOpacity]);

  const closeSheet = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 4,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) {
          translateY.setValue(dy);
          backdropOpacity.setValue(
            Math.max(0, 1 - dy / (sheetHeight * 0.6)),
          );
        }
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > 0.8) {
          closeSheet();
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const handleSubmit = () => {
    if (isVerified) {
      closeSheet();
      return;
    }
    if (!canSubmit || !selfieConfirmed) return;

    const updated = {
      ...profile,
      verified: true,
      updatedAt: new Date().toISOString(),
    };
    updateCurrentUser({ verified: true, updatedAt: updated.updatedAt });
    updateOnboardingData(profileToOnboardingData(updated));
    closeSheet();
  };

  if (!visible) return null;

  return (
    <>
      <SheetBlurBackdrop opacity={backdropOpacity} placement="underlay" />
      <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
        <View style={styles.modalRoot} pointerEvents="box-none">
          <SheetDismissLayer onPress={() => closeSheet()} />

          <Animated.View
            style={[
              styles.sheet,
              {
                height: sheetHeight,
                paddingBottom: insets.bottom + metrics.spacing.md,
                backgroundColor: theme.colors.surface,
                transform: [{ translateY }],
              },
            ]}
          >
            <View {...panResponder.panHandlers} style={styles.handleArea}>
              <View
                style={[styles.handle, { backgroundColor: theme.custom.border }]}
              />
            </View>

          <View style={styles.sheetHeader}>
            <BaseText
              variant="h2"
              color={theme.custom.text}
              children="Get Verified"
            />
            <BaseText
              variant="caption"
              color={
                isVerified ? theme.custom.success : theme.custom.textSecondary
              }
              children={
                isVerified ? 'Verified' : 'Build trust with a badge'
              }
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <View
              style={[
                styles.heroBanner,
                { backgroundColor: theme.custom.surfaceVariant },
              ]}
            >
              <MaterialCommunityIcons
                name="check-decagram"
                size={40}
                color={theme.colors.tertiary}
              />
              <BaseText
                variant="body"
                color={theme.custom.textSecondary}
                style={styles.heroText}
                children="Verified profiles get more matches. Complete the steps below to earn your badge."
              />
            </View>

            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Requirements"
            />
            {requirements.map(item => (
              <View key={item.id} style={styles.checkRow}>
                <MaterialCommunityIcons
                  name={item.done ? 'check-circle' : 'circle-outline'}
                  size={22}
                  color={
                    item.done ? theme.custom.success : theme.custom.textTertiary
                  }
                />
                <BaseText
                  variant="body"
                  color={item.done ? theme.custom.text : theme.custom.textSecondary}
                  style={styles.checkLabel}
                  children={item.label}
                />
              </View>
            ))}

            {!isVerified && (
              <>
                <BaseText
                  variant="body"
                  color={theme.custom.textSecondary}
                  style={styles.sectionLabel}
                  children="Verify with selfie"
                />
                <TouchableOpacity
                  style={[
                    styles.selfieCard,
                    {
                      borderColor: selfieConfirmed
                        ? theme.custom.success
                        : theme.custom.border,
                      backgroundColor: theme.custom.surfaceVariant,
                    },
                  ]}
                  onPress={() => setSelfieConfirmed(prev => !prev)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="camera-account"
                    size={32}
                    color={theme.colors.primary}
                  />
                  <View style={styles.selfieText}>
                    <BaseText
                      variant="body"
                      color={theme.custom.text}
                      children="Take a verification selfie"
                    />
                    <BaseText
                      variant="caption"
                      color={theme.custom.textTertiary}
                      children="Mock step — tap to confirm you've taken a photo"
                    />
                  </View>
                  <MaterialCommunityIcons
                    name={selfieConfirmed ? 'check-circle' : 'chevron-right'}
                    size={22}
                    color={
                      selfieConfirmed
                        ? theme.custom.success
                        : theme.custom.textTertiary
                    }
                  />
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <GradientButton
                label={isVerified ? 'Done' : 'Submit verification'}
                size="lg"
                onPress={handleSubmit}
                disabled={!isVerified && (!canSubmit || !selfieConfirmed)}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: metrics.radius['2xl'],
    borderTopRightRadius: metrics.radius['2xl'],
    ...metrics.shadows.lg,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  sheetHeader: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.md,
    gap: metrics.spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    padding: metrics.spacing.lg,
    borderRadius: metrics.radius.lg,
    marginBottom: metrics.spacing.md,
  },
  heroText: {
    flex: 1,
    lineHeight: 20,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: metrics.spacing.sm,
    marginTop: metrics.spacing.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    paddingVertical: metrics.spacing.sm,
  },
  checkLabel: {
    flex: 1,
  },
  selfieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    padding: metrics.spacing.lg,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
  },
  selfieText: {
    flex: 1,
    gap: metrics.spacing.xs,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
});
