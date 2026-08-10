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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore, useMembershipStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { MEMBERSHIP_PLANS } from '@constants/membership';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';

export type PaywallReason = 'likes' | 'superLikes';

interface PaywallBottomSheetProps {
  visible: boolean;
  reason: PaywallReason;
  onClose: () => void;
}

const DISMISS_THRESHOLD = 120;

const REASON_CONFIG: Record<
  PaywallReason,
  {
    gradient: [string, string];
    accent: string;
    icon: string;
    title: string;
    subtitle: string;
    refillLabel: string;
    refillPrice: string;
  }
> = {
  likes: {
    gradient: ['#FF4458', '#FF6B6B'],
    accent: '#FF4458',
    icon: 'heart',
    title: "You're out of Likes",
    subtitle:
      'Upgrade for unlimited likes, or grab a quick refill to keep swiping.',
    refillLabel: 'Refill 10 Likes',
    refillPrice: '₹199',
  },
  superLikes: {
    gradient: ['#0099FF', '#33B5FF'],
    accent: '#0099FF',
    icon: 'star-four-points',
    title: "You're out of Super Likes",
    subtitle:
      'Stand out from the crowd — go premium for more each week, or top up now.',
    refillLabel: 'Get 5 Super Likes',
    refillPrice: '₹499',
  },
};

export const PaywallBottomSheet: React.FC<PaywallBottomSheetProps> = ({
  visible,
  reason,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const purchasePlan = useMembershipStore(state => state.purchasePlan);
  const refillLikes = useMembershipStore(state => state.refillLikes);
  const purchaseSuperLikes = useMembershipStore(state => state.purchaseSuperLikes);

  const config = REASON_CONFIG[reason];
  const [selectedId, setSelectedId] = useState<string>(MEMBERSHIP_PLANS[0].id);

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = screenHeight * 0.85;

  useEffect(() => {
    if (visible) {
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
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
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 240,
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
          backdropOpacity.setValue(Math.max(0, 1 - dy / (sheetHeight * 0.6)));
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
              duration: 160,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const handleRefill = () => {
    if (reason === 'likes') {
      closeSheet(refillLikes);
    } else {
      closeSheet(() => purchaseSuperLikes(5));
    }
  };

  const handlePurchasePlan = () => {
    closeSheet(() => purchasePlan(selectedId));
  };

  const selectedPlan =
    MEMBERSHIP_PLANS.find(p => p.id === selectedId) ?? MEMBERSHIP_PLANS[0];

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
              <View style={[styles.handle, { backgroundColor: theme.custom.border }]} />
            </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero */}
            <LinearGradient
              colors={config.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.iconGlow}>
                <MaterialCommunityIcons name={config.icon} size={40} color="#FFFFFF" />
              </View>
              <BaseText color="#FFFFFF" style={styles.heroTitle} children={config.title} />
              <BaseText
                color="rgba(255,255,255,0.9)"
                style={styles.heroSubtitle}
                children={config.subtitle}
              />
            </LinearGradient>

            {/* Quick refill */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRefill}
              style={[
                styles.refillBtn,
                { borderColor: config.accent, backgroundColor: config.accent + '10' },
              ]}
            >
              <View style={styles.refillLeft}>
                <MaterialCommunityIcons name={config.icon} size={20} color={config.accent} />
                <BaseText
                  color={theme.custom.text}
                  style={styles.refillLabel}
                  children={config.refillLabel}
                />
              </View>
              <BaseText
                color={config.accent}
                style={styles.refillPrice}
                children={config.refillPrice}
              />
            </TouchableOpacity>

            {/* Plans */}
            <BaseText
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Go premium for more"
            />

            <View style={styles.plans}>
              {MEMBERSHIP_PLANS.map(plan => {
                const selected = plan.id === selectedId;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedId(plan.id)}
                    style={[
                      styles.planCard,
                      {
                        borderColor: selected ? plan.gradient[0] : theme.custom.border,
                        backgroundColor: selected
                          ? plan.gradient[0] + '10'
                          : theme.custom.surfaceVariant,
                        borderWidth: selected ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.planIcon, { backgroundColor: plan.gradient[0] + '1A' }]}>
                      <MaterialCommunityIcons
                        name={plan.icon}
                        size={22}
                        color={plan.gradient[0]}
                      />
                    </View>
                    <View style={styles.planInfo}>
                      <BaseText
                        color={theme.custom.text}
                        style={styles.planTitle}
                        children={plan.title}
                      />
                      <BaseText
                        color={theme.custom.textTertiary}
                        style={styles.planBenefit}
                        children={plan.benefit}
                      />
                    </View>
                    <BaseText
                      color={theme.custom.text}
                      style={styles.planPrice}
                      children={plan.priceLabel}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.85} onPress={handlePurchasePlan}>
              <LinearGradient
                colors={selectedPlan.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.purchaseBtn}
              >
                <BaseText
                  color="#FFFFFF"
                  style={styles.purchaseText}
                  children={`Get ${selectedPlan.title} · ${selectedPlan.priceLabel}`}
                />
              </LinearGradient>
            </TouchableOpacity>
              <BaseText
                color={theme.custom.textTertiary}
                style={styles.footerNote}
                children="Cancel anytime · Restores your inventory instantly"
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
  scrollContent: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  hero: {
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.xl,
    alignItems: 'center',
    marginBottom: metrics.spacing.lg,
  },
  iconGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: metrics.spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  refillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    marginBottom: metrics.spacing.lg,
  },
  refillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  refillLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  refillPrice: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: metrics.spacing.md,
  },
  plans: {
    gap: metrics.spacing.md,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
    gap: 2,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  planBenefit: {
    fontSize: 12,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
    gap: metrics.spacing.sm,
  },
  purchaseBtn: {
    height: 54,
    borderRadius: metrics.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    fontSize: 11,
    textAlign: 'center',
  },
});
