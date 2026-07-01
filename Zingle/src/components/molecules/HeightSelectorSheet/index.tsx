import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { BottomSheet } from '../BottomSheet';
import {
  CM_MIN,
  CM_MAX,
  type HeightUnit,
  cmToFeetInches,
} from '@constants/pickers';

interface HeightSelectorSheetProps {
  visible: boolean;
  valueCm?: number;
  onClose: () => void;
  onConfirm: (heightCm: number | undefined, unit: HeightUnit) => void;
}

const TICK_WIDTH = 20;

const UNITS: { id: HeightUnit; label: string }[] = [
  { id: 'cm', label: 'CM' },
  { id: 'ft', label: 'FT/IN' },
];

const cmValues = Array.from(
  { length: CM_MAX - CM_MIN + 1 },
  (_, i) => CM_MIN + i
);

const styles = StyleSheet.create({
  unitRow: {
    flexDirection: 'row',
    gap: metrics.spacing.sm,
    marginBottom: metrics.spacing.md,
  },
  unitTab: {
    flex: 1,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  unitTabActive: {
    borderWidth: 0,
  },
  unitTabLabel: {
    fontWeight: '700',
  },
  valueDisplay: {
    alignItems: 'center',
    marginBottom: metrics.spacing.sm,
  },
  valueText: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  rulerWrap: {
    height: 88,
    marginBottom: metrics.spacing.sm,
    position: 'relative',
  },
  centerIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 24,
    width: 3,
    alignSelf: 'center',
    borderRadius: 2,
    zIndex: 2,
  },
  tick: {
    width: TICK_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 64,
  },
  tickLine: {
    width: 2,
    borderRadius: 1,
  },
  tickLineMajor: {
    height: 32,
  },
  tickLineMinor: {
    height: 16,
  },
  tickLabel: {
    marginTop: 4,
    fontSize: 10,
  },
  moreRow: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.xs,
  },
});

export const HeightSelectorSheet: React.FC<HeightSelectorSheetProps> = ({
  visible,
  valueCm,
  onClose,
  onConfirm,
}) => {
  const { theme } = useThemeStore();
  const { width: screenWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<number>>(null);
  const draftRef = useRef(valueCm || 170);
  const isSnapping = useRef(false);
  const [unit, setUnit] = useState<HeightUnit>('cm');
  const [draftCm, setDraftCm] = useState(draftRef.current);

  const sidePadding = screenWidth / 2 - TICK_WIDTH / 2;

  const scrollToCm = useCallback((cm: number, animated = true) => {
    const clamped = Math.min(CM_MAX, Math.max(CM_MIN, cm));
    const index = clamped - CM_MIN;
    draftRef.current = clamped;
    setDraftCm(clamped);
    isSnapping.current = true;
    listRef.current?.scrollToOffset({
      offset: index * TICK_WIDTH,
      animated,
    });
    setTimeout(
      () => {
        isSnapping.current = false;
      },
      animated ? 280 : 32
    );
  }, []);

  useEffect(() => {
    if (visible) {
      const cm = valueCm || 170;
      draftRef.current = cm;
      setDraftCm(cm);
      setUnit('cm');
      requestAnimationFrame(() => {
        scrollToCm(cm, false);
      });
    }
  }, [visible, valueCm, scrollToCm]);

  const snapFromOffset = useCallback((offsetX: number, animated: boolean) => {
    const index = Math.round(offsetX / TICK_WIDTH);
    const clampedIndex = Math.min(cmValues.length - 1, Math.max(0, index));
    const targetOffset = clampedIndex * TICK_WIDTH;
    const cm = CM_MIN + clampedIndex;

    draftRef.current = cm;
    setDraftCm(cm);

    if (Math.abs(offsetX - targetOffset) > 0.5 && !isSnapping.current) {
      isSnapping.current = true;
      listRef.current?.scrollToOffset({
        offset: targetOffset,
        animated,
      });
      setTimeout(
        () => {
          isSnapping.current = false;
        },
        animated ? 280 : 32
      );
    }
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isSnapping.current) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / TICK_WIDTH);
    const clampedIndex = Math.min(cmValues.length - 1, Math.max(0, index));
    const cm = CM_MIN + clampedIndex;
    if (cm !== draftRef.current) {
      draftRef.current = cm;
      setDraftCm(cm);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    snapFromOffset(e.nativeEvent.contentOffset.x, true);
  };

  const handleUnitChange = (next: HeightUnit) => {
    setUnit(next);
    scrollToCm(draftRef.current, false);
  };

  const displayValue =
    unit === 'cm'
      ? `${draftCm}`
      : (() => {
          const { feet, inches } = cmToFeetInches(draftCm);
          return `${feet}'${inches}"`;
        })();

  const renderItem = useCallback(
    ({ item: cm }: { item: number }) => {
      const isMajor = cm % 5 === 0;
      const label =
        unit === 'cm'
          ? isMajor
            ? `${cm}`
            : ''
          : isMajor
            ? `${cmToFeetInches(cm).feet}'`
            : '';
      return (
        <View style={styles.tick}>
          <View
            style={[
              styles.tickLine,
              isMajor ? styles.tickLineMajor : styles.tickLineMinor,
              {
                backgroundColor: isMajor
                  ? theme.custom.textSecondary
                  : theme.custom.border,
              },
            ]}
          />
          {label ? (
            <BaseText
              variant="caption"
              color={theme.custom.textTertiary}
              style={styles.tickLabel}
              children={label}
            />
          ) : null}
        </View>
      );
    },
    [theme.custom.border, theme.custom.textSecondary, theme.custom.textTertiary, unit]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, index: number) => ({
      length: TICK_WIDTH,
      offset: TICK_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Your height"
      subtitle="Slide the scale to select"
      heightRatio={0.54}
      footer={
        <GradientButton
          label="Confirm height"
          size="lg"
          onPress={() => onConfirm(draftRef.current, unit)}
        />
      }
    >
      <View style={styles.unitRow}>
        {UNITS.map(tab => {
          const active = unit === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.unitTab,
                active
                  ? [styles.unitTabActive, { backgroundColor: theme.colors.primary }]
                  : { borderColor: theme.custom.border },
              ]}
              onPress={() => handleUnitChange(tab.id)}
            >
              <BaseText
                variant="bodyMedium"
                color={active ? '#FFFFFF' : theme.custom.textSecondary}
                style={styles.unitTabLabel}
                children={tab.label}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.valueDisplay}>
        <BaseText
          variant="h1"
          color={theme.custom.text}
          style={styles.valueText}
          children={displayValue}
        />
        {unit === 'cm' ? (
          <BaseText
            variant="body"
            color={theme.custom.textSecondary}
            children="cm"
          />
        ) : null}
      </View>

      <View style={styles.rulerWrap}>
        <View
          style={[styles.centerIndicator, { backgroundColor: theme.colors.primary }]}
        />
        <FlatList
          ref={listRef}
          data={cmValues}
          horizontal
          keyExtractor={item => String(item)}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_WIDTH}
          decelerationRate="normal"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
          initialNumToRender={30}
          maxToRenderPerBatch={20}
          windowSize={9}
          removeClippedSubviews
        />
      </View>

      <TouchableOpacity
        style={styles.moreRow}
        onPress={() => onConfirm(undefined, unit)}
      >
        <BaseText
          variant="body"
          color={theme.custom.textTertiary}
          children="Prefer not to say"
        />
      </TouchableOpacity>
    </BottomSheet>
  );
};
