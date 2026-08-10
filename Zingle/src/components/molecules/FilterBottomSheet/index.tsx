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
import { useThemeStore } from '@stores';
import { useFilterStore, defaultFilters } from '@stores/filterStore';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { FilterSingleSlider, FilterRangeSlider } from '../FilterSliders';
import { SheetToggleRow } from '../SheetToggleRow';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DISMISS_THRESHOLD = 120;
const DISTANCE_MIN = 1;
const DISTANCE_MAX = 100;
const AGE_MIN = 18;
const AGE_MAX = 100;

const formatDistance = (km: number) =>
  km >= DISTANCE_MAX ? '100+ km' : `${km} km`;

const formatAgeRange = (min: number, max: number) =>
  max >= AGE_MAX ? `${min} – ${AGE_MAX}+` : `${min} – ${max}`;

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { filters, updateFilters, resetFilters } = useFilterStore();

  const [draft, setDraft] = useState(filters);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = screenHeight * 0.78;

  useEffect(() => {
    if (visible) {
      setDraft(filters);
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
  }, [visible, filters, sheetHeight, translateY, backdropOpacity]);

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

  const handleApply = () => {
    updateFilters(draft);
    closeSheet();
  };

  const handleClear = () => {
    setDraft({ ...defaultFilters });
    resetFilters();
    closeSheet();
  };

  const toggleBool = (key: keyof typeof draft, value: boolean) => {
    setDraft(prev => ({ ...prev, [key]: value }));
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
            <BaseText variant="h2" color={theme.custom.text} children="Discovery Settings" />
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <BaseText
                variant="body"
                color={theme.colors.primary}
                style={styles.clearTextBold}
                children="Reset"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <FilterSingleSlider
              label="Maximum distance"
              value={draft.distanceMax ?? DISTANCE_MAX}
              min={DISTANCE_MIN}
              max={DISTANCE_MAX}
              step={1}
              formatValue={formatDistance}
              onChange={distanceMax => setDraft(prev => ({ ...prev, distanceMax }))}
            />

            <FilterRangeSlider
              label="Age range"
              minValue={draft.ageMin ?? AGE_MIN}
              maxValue={draft.ageMax ?? AGE_MAX}
              min={AGE_MIN}
              max={AGE_MAX}
              step={1}
              minGap={1}
              formatRange={formatAgeRange}
              onChange={(ageMin, ageMax) =>
                setDraft(prev => ({ ...prev, ageMin, ageMax }))
              }
            />

            <BaseText
              variant="bodyMedium"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Show me people who"
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
                label="Are verified"
                value={Boolean(draft.verifiedOnly)}
                onValueChange={v => toggleBool('verifiedOnly', v)}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Have a bio"
                value={Boolean(draft.hasBio)}
                onValueChange={v => toggleBool('hasBio', v)}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Are online now"
                value={Boolean(draft.onlineNow)}
                onValueChange={v => toggleBool('onlineNow', v)}
              />
              <View
                style={[styles.groupDivider, { backgroundColor: theme.custom.border }]}
              />
              <SheetToggleRow
                label="Were recently active"
                value={Boolean(draft.recentlyActive)}
                onValueChange={v => toggleBool('recentlyActive', v)}
              />
            </View>
          </ScrollView>

            <View style={styles.footer}>
              <GradientButton label="Apply" size="lg" onPress={handleApply} />
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
  scrollContent: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  sectionLabel: {
    fontWeight: '700',
    marginTop: metrics.spacing.xl,
    marginBottom: metrics.spacing.sm,
  },
  groupCard: {
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: metrics.spacing.md,
  },
  groupDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: metrics.spacing.lg,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
  clearTextBold: {
    fontWeight: '600',
  },
});
