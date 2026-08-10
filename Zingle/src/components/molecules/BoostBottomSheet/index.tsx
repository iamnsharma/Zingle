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
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import {
  BOOST_GRADIENT,
  BOOST_PACKAGES,
  type BoostPackage,
} from '@constants/membership';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';

interface BoostBottomSheetProps {
  visible: boolean;
  boostsAvailable: number;
  onClose: () => void;
  onBoostNow?: () => void;
  onPurchase?: (pkg: BoostPackage) => void;
}

const DISMISS_THRESHOLD = 120;
const BOOST_PURPLE = '#B01EFF';

export const BoostBottomSheet: React.FC<BoostBottomSheetProps> = ({
  visible,
  boostsAvailable,
  onClose,
  onBoostNow,
  onPurchase,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const hasBoosts = boostsAvailable > 0;
  const [selectedId, setSelectedId] = useState<string>(
    BOOST_PACKAGES.find(p => p.popular)?.id ?? BOOST_PACKAGES[0].id,
  );

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = screenHeight * 0.82;

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

  const selectedPackage =
    BOOST_PACKAGES.find(p => p.id === selectedId) ?? BOOST_PACKAGES[0];

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
              colors={BOOST_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.iconGlow}>
                <MaterialCommunityIcons name="flash" size={40} color="#FFFFFF" />
              </View>
              <BaseText
                color="#FFFFFF"
                style={styles.heroTitle}
                children="Zingle Boost"
              />
              <BaseText
                color="rgba(255,255,255,0.9)"
                style={styles.heroSubtitle}
                children="Be one of the top profiles in your area for 30 minutes and get seen by more people."
              />
              <View style={styles.heroStatRow}>
                <MaterialCommunityIcons name="eye" size={16} color="#FFFFFF" />
                <BaseText
                  color="#FFFFFF"
                  style={styles.heroStatText}
                  children="Up to 10x more profile views"
                />
              </View>
            </LinearGradient>

            {/* Available boosts → boost now */}
            {hasBoosts ? (
              <View style={styles.availableBlock}>
                <BaseText
                  color={theme.custom.text}
                  style={styles.availableText}
                  children={`You have ${boostsAvailable} Boost${boostsAvailable > 1 ? 's' : ''}`}
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => closeSheet(onBoostNow)}
                >
                  <LinearGradient
                    colors={BOOST_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.boostNowBtn}
                  >
                    <MaterialCommunityIcons name="flash" size={20} color="#FFFFFF" />
                    <BaseText
                      color="#FFFFFF"
                      style={styles.boostNowText}
                      children="Boost my profile now"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.outBlock}>
                <MaterialCommunityIcons
                  name="flash-off"
                  size={20}
                  color={theme.custom.textSecondary}
                />
                <BaseText
                  color={theme.custom.textSecondary}
                  style={styles.outText}
                  children="You're out of Boosts"
                />
              </View>
            )}

            {/* Packages */}
            <BaseText
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children={hasBoosts ? 'Get more Boosts' : 'Choose a package'}
            />

            <View style={styles.packages}>
              {BOOST_PACKAGES.map(pkg => {
                const selected = pkg.id === selectedId;
                return (
                  <TouchableOpacity
                    key={pkg.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedId(pkg.id)}
                    style={[
                      styles.packageCard,
                      {
                        borderColor: selected ? BOOST_PURPLE : theme.custom.border,
                        backgroundColor: selected
                          ? BOOST_PURPLE + '10'
                          : theme.custom.surfaceVariant,
                        borderWidth: selected ? 2 : 1,
                      },
                    ]}
                  >
                    {pkg.tag ? (
                      <View
                        style={[styles.packageTag, { backgroundColor: BOOST_PURPLE }]}
                      >
                        <BaseText
                          color="#FFFFFF"
                          style={styles.packageTagText}
                          children={pkg.tag}
                        />
                      </View>
                    ) : null}

                    <View style={styles.packageLeft}>
                      <BaseText
                        color={BOOST_PURPLE}
                        style={styles.packageCount}
                        children={`${pkg.count}`}
                      />
                      <View style={styles.packageBoostLabel}>
                        <MaterialCommunityIcons
                          name="flash"
                          size={14}
                          color={BOOST_PURPLE}
                        />
                        <BaseText
                          color={theme.custom.text}
                          style={styles.packageBoostText}
                          children={pkg.count > 1 ? 'Boosts' : 'Boost'}
                        />
                      </View>
                    </View>

                    <View style={styles.packageRight}>
                      <BaseText
                        color={theme.custom.text}
                        style={styles.packagePrice}
                        children={pkg.priceLabel}
                      />
                      <BaseText
                        color={theme.custom.textTertiary}
                        style={styles.packagePer}
                        children={pkg.perLabel}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => closeSheet(() => onPurchase?.(selectedPackage))}
            >
              <LinearGradient
                colors={BOOST_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.purchaseBtn}
              >
                <BaseText
                  color="#FFFFFF"
                  style={styles.purchaseText}
                  children={`Get ${selectedPackage.count} Boost${selectedPackage.count > 1 ? 's' : ''} · ${selectedPackage.priceLabel}`}
                />
              </LinearGradient>
            </TouchableOpacity>
              <BaseText
                color={theme.custom.textTertiary}
                style={styles.footerNote}
                children="Auto-renews off · One-time purchase"
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
    fontSize: 26,
    fontWeight: '800',
    marginBottom: metrics.spacing.sm,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: metrics.spacing.md,
  },
  heroStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
  },
  heroStatText: {
    fontSize: 13,
    fontWeight: '600',
  },
  availableBlock: {
    marginBottom: metrics.spacing.lg,
    gap: metrics.spacing.sm,
  },
  availableText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  boostNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    height: 52,
    borderRadius: metrics.radius.full,
  },
  boostNowText: {
    fontSize: 16,
    fontWeight: '700',
  },
  outBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
    marginBottom: metrics.spacing.lg,
  },
  outText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: metrics.spacing.md,
  },
  packages: {
    gap: metrics.spacing.md,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.lg,
    position: 'relative',
  },
  packageTag: {
    position: 'absolute',
    top: -10,
    left: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: 2,
    borderRadius: metrics.radius.full,
  },
  packageTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  packageLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: metrics.spacing.xs,
  },
  packageCount: {
    fontSize: 26,
    fontWeight: '800',
  },
  packageBoostLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  packageBoostText: {
    fontSize: 15,
    fontWeight: '700',
  },
  packageRight: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 17,
    fontWeight: '800',
  },
  packagePer: {
    fontSize: 12,
    marginTop: 2,
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
