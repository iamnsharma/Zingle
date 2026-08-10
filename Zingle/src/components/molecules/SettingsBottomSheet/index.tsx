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
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useProfileStore, useMembershipStore } from '@stores';
import { defaultAppSettings } from '@stores/profileStore';
import type { AppSettings } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import {
  MEMBERSHIP_PLANS,
  DISCOVERY_SETTINGS,
  UNLIMITED,
  type MembershipPlan,
} from '@constants/membership';
import { SheetToggleRow } from '../SheetToggleRow';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';

interface SettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onOpenSafety: () => void;
  onOpenVerified: () => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
}

const DISMISS_THRESHOLD = 120;

interface NavRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

const NavRow: React.FC<NavRowProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  danger,
}) => {
  const { theme } = useThemeStore();

  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.navIcon,
          {
            backgroundColor: danger
              ? theme.custom.error + '18'
              : theme.custom.surfaceVariant,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={danger ? theme.custom.error : theme.colors.primary}
        />
      </View>
      <View style={styles.navText}>
        <BaseText
          variant="bodyMedium"
          color={danger ? theme.custom.error : theme.custom.text}
          children={label}
        />
        {subtitle ? (
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children={subtitle}
          />
        ) : null}
      </View>
      {!danger && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.custom.textTertiary}
        />
      )}
    </TouchableOpacity>
  );
};

interface PlanCardProps {
  plan: MembershipPlan;
  owned: boolean;
  onUpgrade: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, owned, onUpgrade }) => (
  <LinearGradient
    colors={plan.gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.planCard}
  >
    <View style={styles.planCardHeader}>
      <MaterialCommunityIcons name={plan.icon} size={22} color="#FFFFFF" />
      <BaseText variant="caption" color="rgba(255,255,255,0.9)" children={plan.priceLabel} />
    </View>
    <BaseText variant="h3" color="#FFFFFF" style={styles.planTitle} children={plan.title} />
    <BaseText variant="caption" color="rgba(255,255,255,0.85)" children={plan.benefit} />
    <TouchableOpacity
      style={[styles.upgradeBtn, owned && styles.upgradeBtnOwned]}
      onPress={onUpgrade}
      activeOpacity={0.85}
      disabled={owned}
    >
      {owned ? (
        <View style={styles.ownedRow}>
          <MaterialCommunityIcons name="check-circle" size={14} color="#FFFFFF" />
          <BaseText variant="caption" color="#FFFFFF" style={styles.upgradeBtnText} children="Purchased" />
        </View>
      ) : (
        <BaseText variant="caption" color="#FFFFFF" style={styles.upgradeBtnText} children="Upgrade" />
      )}
    </TouchableOpacity>
  </LinearGradient>
);

export const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = ({
  visible,
  onClose,
  onOpenSafety,
  onOpenVerified,
  onOpenEditProfile,
  onLogout,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { appSettings, updateAppSettings } = useProfileStore();
  const likes = useMembershipStore(state => state.likes);
  const superLikes = useMembershipStore(state => state.superLikes);
  const boosts = useMembershipStore(state => state.boosts);
  const activePlanId = useMembershipStore(state => state.activePlanId);
  const purchasePlan = useMembershipStore(state => state.purchasePlan);
  const likesLabel = likes === UNLIMITED ? 'Unlimited' : `${likes}`;

  const [draft, setDraft] = useState<AppSettings>(appSettings);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = screenHeight * 0.82;

  useEffect(() => {
    if (visible) {
      setDraft(appSettings);
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
  }, [visible, appSettings, sheetHeight, translateY, backdropOpacity]);

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

  const patch = (updates: Partial<AppSettings>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    updateAppSettings(draft);
    closeSheet();
  };

  const handleReset = () => {
    setDraft({ ...defaultAppSettings });
    updateAppSettings(defaultAppSettings);
  };

  const openSubSheet = (action: () => void) => {
    updateAppSettings(draft);
    closeSheet(action);
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
            <BaseText variant="h2" color={theme.custom.text} children="Settings" />
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
              style={[styles.sectionLabel, styles.sectionLabelFirst]}
              children="Premium"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plansScroll}
            >
              {MEMBERSHIP_PLANS.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  owned={activePlanId === plan.id}
                  onUpgrade={() => purchasePlan(plan.id)}
                />
              ))}
            </ScrollView>

            <View
              style={[
                styles.inventoryRow,
                {
                  backgroundColor: theme.custom.surfaceVariant,
                  borderColor: theme.custom.border,
                },
              ]}
            >
              <View style={styles.inventoryItem}>
                <MaterialCommunityIcons name="heart" size={20} color={theme.colors.primary} />
                <BaseText
                  variant="caption"
                  color={theme.custom.text}
                  style={styles.inventoryCount}
                  children={likesLabel}
                />
                <BaseText variant="caption" color={theme.custom.textTertiary} children="Likes" />
              </View>
              <View style={[styles.inventoryDivider, { backgroundColor: theme.custom.border }]} />
              <View style={styles.inventoryItem}>
                <MaterialCommunityIcons name="star-four-points" size={20} color={theme.colors.tertiary} />
                <BaseText
                  variant="caption"
                  color={theme.custom.text}
                  style={styles.inventoryCount}
                  children={`${superLikes}`}
                />
                <BaseText variant="caption" color={theme.custom.textTertiary} children="Super Likes" />
              </View>
              <View style={[styles.inventoryDivider, { backgroundColor: theme.custom.border }]} />
              <View style={styles.inventoryItem}>
                <MaterialCommunityIcons name="flash" size={20} color="#9B59B6" />
                <BaseText
                  variant="caption"
                  color={theme.custom.text}
                  style={styles.inventoryCount}
                  children={`${boosts}`}
                />
                <BaseText variant="caption" color={theme.custom.textTertiary} children="Boosts" />
              </View>
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Appearance"
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
                label="Liquid glass"
                description="Frosted glass style for buttons & icons"
                value={draft.liquidGlass}
                onValueChange={v => patch({ liquidGlass: v })}
              />
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Account"
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
              <NavRow
                icon="account-edit-outline"
                label="Edit profile"
                subtitle="Photos, bio, and details"
                onPress={() => openSubSheet(onOpenEditProfile)}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <NavRow
                icon="check-decagram-outline"
                label="Get Verified"
                subtitle="Earn a trust badge"
                onPress={() => openSubSheet(onOpenVerified)}
              />
            </View>

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
              {DISCOVERY_SETTINGS.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <View
                      style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
                    />
                  )}
                  <NavRow
                    icon={item.icon}
                    label={item.label}
                    subtitle={item.value}
                    onPress={() => closeSheet()}
                  />
                </React.Fragment>
              ))}
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Notifications"
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
                label="Push notifications"
                description="Stay updated on activity"
                value={draft.pushNotifications}
                onValueChange={v => patch({ pushNotifications: v })}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="New matches"
                value={draft.matchAlerts}
                onValueChange={v => patch({ matchAlerts: v })}
                disabled={!draft.pushNotifications}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Messages"
                value={draft.messageAlerts}
                onValueChange={v => patch({ messageAlerts: v })}
                disabled={!draft.pushNotifications}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Likes"
                value={draft.likeAlerts}
                onValueChange={v => patch({ likeAlerts: v })}
                disabled={!draft.pushNotifications}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Email updates"
                value={draft.emailUpdates}
                onValueChange={v => patch({ emailUpdates: v })}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="In-app sounds"
                value={draft.soundEffects}
                onValueChange={v => patch({ soundEffects: v })}
              />
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Privacy & safety"
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
              <NavRow
                icon="shield-lock-outline"
                label="Safety & Privacy"
                subtitle="Discovery, messaging, and visibility"
                onPress={() => openSubSheet(onOpenSafety)}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <NavRow
                icon="account-cancel-outline"
                label="Blocked accounts"
                subtitle="Manage blocked users"
                onPress={() => closeSheet()}
              />
            </View>

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Support"
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
              <NavRow
                icon="help-circle-outline"
                label="Help & support"
                onPress={() => closeSheet()}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <NavRow
                icon="logout"
                label="Log out"
                onPress={() => openSubSheet(onLogout)}
                danger
              />
            </View>

            <BaseText
              variant="caption"
              color={theme.custom.textTertiary}
              style={styles.version}
              children="Zingle v1.0.0"
            />
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
  sectionLabelFirst: {
    marginTop: 0,
  },
  plansScroll: {
    gap: metrics.spacing.md,
    paddingBottom: metrics.spacing.md,
  },
  planCard: {
    width: 200,
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    ...metrics.shadows.md,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.sm,
  },
  planTitle: {
    fontWeight: '800',
    marginBottom: metrics.spacing.xs,
  },
  upgradeBtn: {
    marginTop: metrics.spacing.md,
    alignSelf: 'flex-start',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  upgradeBtnOwned: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  ownedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upgradeBtnText: {
    fontWeight: '700',
  },
  inventoryCount: {
    fontWeight: '800',
  },
  inventoryRow: {
    flexDirection: 'row',
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    marginBottom: metrics.spacing.sm,
    overflow: 'hidden',
  },
  inventoryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.md,
  },
  inventoryDivider: {
    width: StyleSheet.hairlineWidth,
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
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    flex: 1,
    gap: metrics.spacing.xs,
  },
  version: {
    textAlign: 'center',
    marginTop: metrics.spacing.xl,
    marginBottom: metrics.spacing.sm,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
});
