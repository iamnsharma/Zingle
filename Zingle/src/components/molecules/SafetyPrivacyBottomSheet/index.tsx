import React, { useEffect, useRef, useState } from 'react';
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
import { useThemeStore, useProfileStore } from '@stores';
import { defaultPrivacySettings } from '@stores/profileStore';
import type { PrivacySettings } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { SheetToggleRow } from '../SheetToggleRow';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';

interface SafetyPrivacyBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onOpenBlocked?: () => void;
  onOpenReport?: () => void;
}

const DISMISS_THRESHOLD = 120;

interface InfoRowProps {
  icon: string;
  label: string;
  onPress?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, onPress }) => {
  const { theme } = useThemeStore();

  return (
    <TouchableOpacity style={styles.infoRow} activeOpacity={0.7} onPress={onPress}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={theme.colors.primary}
      />
      <BaseText
        variant="body"
        color={theme.custom.text}
        style={styles.infoLabel}
        children={label}
      />
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={theme.custom.textTertiary}
      />
    </TouchableOpacity>
  );
};

export const SafetyPrivacyBottomSheet: React.FC<SafetyPrivacyBottomSheetProps> = ({
  visible,
  onClose,
  onOpenBlocked,
  onOpenReport,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { privacySettings, updatePrivacySettings } = useProfileStore();

  const [draft, setDraft] = useState<PrivacySettings>(privacySettings);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = screenHeight * 0.78;

  useEffect(() => {
    if (visible) {
      setDraft(privacySettings);
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
  }, [visible, privacySettings, sheetHeight, translateY, backdropOpacity]);

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

  const handleSave = () => {
    updatePrivacySettings(draft);
    closeSheet();
  };

  const handleReset = () => {
    setDraft({ ...defaultPrivacySettings });
    updatePrivacySettings(defaultPrivacySettings);
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
              children="Safety & Privacy"
            />
            <TouchableOpacity onPress={handleReset}>
              <BaseText
                variant="body"
                color={theme.colors.primary}
                style={styles.resetBold}
                children="Reset"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Discovery"
            />
            <View
              style={[
                styles.groupCard,
                {
                  backgroundColor: theme.custom.surfaceVariant,
                  borderColor: theme.custom.border,
                },
              ]}
            >
              <SheetToggleRow
                label="Show me on Zingle"
                description="Others can discover your profile"
                value={draft.showOnApp}
                onValueChange={v => setDraft(prev => ({ ...prev, showOnApp: v }))}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Show my age"
                value={draft.showAge}
                onValueChange={v => setDraft(prev => ({ ...prev, showAge: v }))}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Show distance"
                value={draft.showDistance}
                onValueChange={v => setDraft(prev => ({ ...prev, showDistance: v }))}
              />
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Messaging"
            />
            <View
              style={[
                styles.groupCard,
                {
                  backgroundColor: theme.custom.surfaceVariant,
                  borderColor: theme.custom.border,
                },
              ]}
            >
              <SheetToggleRow
                label="Matches only"
                description="Only people you match with can message you"
                value={draft.matchesOnlyMessages}
                onValueChange={v =>
                  setDraft(prev => ({ ...prev, matchesOnlyMessages: v }))
                }
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Read receipts"
                value={draft.readReceipts}
                onValueChange={v => setDraft(prev => ({ ...prev, readReceipts: v }))}
              />
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Privacy"
            />
            <View
              style={[
                styles.groupCard,
                {
                  backgroundColor: theme.custom.surfaceVariant,
                  borderColor: theme.custom.border,
                },
              ]}
            >
              <SheetToggleRow
                label="Hide from contacts"
                description="Block people in your phone contacts"
                value={draft.hideFromContacts}
                onValueChange={v =>
                  setDraft(prev => ({ ...prev, hideFromContacts: v }))
                }
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Incognito browsing"
                description="Only people you like can see you"
                value={draft.incognitoMode}
                onValueChange={v => setDraft(prev => ({ ...prev, incognitoMode: v }))}
              />
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Safety tools"
            />
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: theme.custom.surfaceVariant,
                  borderColor: theme.custom.border,
                },
              ]}
            >
              <InfoRow
                icon="account-cancel-outline"
                label="Block list"
                onPress={() => closeSheet(onOpenBlocked)}
              />
              <View
                style={[
                  styles.infoDivider,
                  { backgroundColor: theme.custom.border },
                ]}
              />
              <InfoRow
                icon="flag-outline"
                label="Report a problem"
                onPress={() => closeSheet(onOpenReport)}
              />
            </View>
          </ScrollView>

            <View style={styles.footer}>
              <GradientButton label="Save settings" size="lg" onPress={handleSave} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.md,
  },
  resetBold: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  sectionLabel: {
    fontWeight: '700',
    marginBottom: metrics.spacing.sm,
    marginTop: metrics.spacing.md,
  },
  groupCard: {
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    paddingHorizontal: metrics.spacing.md,
    overflow: 'hidden',
  },
  groupDivider: {
    height: StyleSheet.hairlineWidth,
  },
  infoCard: {
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  infoLabel: {
    flex: 1,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: metrics.spacing.lg + 22 + metrics.spacing.md,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
});
