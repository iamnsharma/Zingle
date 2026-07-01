import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores';
import { useFilterStore, defaultFilters } from '@stores/filterStore';
import { metrics } from '@styling/metrics';
import { BaseText, FilterChip, GradientButton } from '@components/atoms';

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DISMISS_THRESHOLD = 120;

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
            Math.max(0, 1 - dy / (sheetHeight * 0.6))
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
    })
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

  const toggleBool = (key: keyof typeof draft) => {
    setDraft(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setAgeMin = (val: number) =>
    setDraft(prev => ({ ...prev, ageMin: Math.min(val, (prev.ageMax || 65) - 1) }));
  const setAgeMax = (val: number) =>
    setDraft(prev => ({ ...prev, ageMax: Math.max(val, (prev.ageMin || 18) + 1) }));
  const setDistanceMax = (val: number) =>
    setDraft(prev => ({ ...prev, distanceMax: val }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </Pressable>

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
            <BaseText variant="h2" color={theme.custom.text} children="Filters" />
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <BaseText
                variant="body"
                color={theme.colors.primary}
                style={styles.clearTextBold}
                children="Clear all"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Maximum distance"
            />
            <View style={styles.chipRow}>
              {[5, 10, 25, 50, 100].map(km => (
                <FilterChip
                  key={km}
                  label={`${km} km`}
                  selected={draft.distanceMax === km}
                  onPress={() => setDistanceMax(km)}
                />
              ))}
            </View>

            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Age range"
            />
            <View style={styles.chipRow}>
              {[18, 21, 25, 30, 35, 40].map(age => (
                <FilterChip
                  key={`min-${age}`}
                  label={`${age}+ min`}
                  selected={draft.ageMin === age}
                  onPress={() => setAgeMin(age)}
                />
              ))}
            </View>
            <View style={styles.chipRow}>
              {[30, 35, 40, 45, 50, 65].map(age => (
                <FilterChip
                  key={`max-${age}`}
                  label={`${age} max`}
                  selected={draft.ageMax === age}
                  onPress={() => setAgeMax(age)}
                />
              ))}
            </View>

            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              style={styles.sectionLabel}
              children="Show me"
            />
            <View style={styles.chipRow}>
              <FilterChip
                label="Verified only"
                selected={Boolean(draft.verifiedOnly)}
                onPress={() => toggleBool('verifiedOnly')}
              />
              <FilterChip
                label="Has bio"
                selected={Boolean(draft.hasBio)}
                onPress={() => toggleBool('hasBio')}
              />
              <FilterChip
                label="Online now"
                selected={Boolean(draft.onlineNow)}
                onPress={() => toggleBool('onlineNow')}
              />
              <FilterChip
                label="Recently active"
                selected={Boolean(draft.recentlyActive)}
                onPress={() => toggleBool('recentlyActive')}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <GradientButton label="Apply filters" size="lg" onPress={handleApply} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    ...(Platform.OS === 'ios' && {
      // Frosted feel via layered opacity; true blur needs native module
    }),
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
    fontWeight: '600',
    marginBottom: metrics.spacing.sm,
    marginTop: metrics.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
  clearTextBold: {
    fontWeight: '600',
  },
});
