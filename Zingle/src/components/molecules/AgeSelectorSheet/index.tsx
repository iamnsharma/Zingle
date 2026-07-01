import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { BottomSheet } from '../BottomSheet';
import { AGE_MIN, AGE_MAX } from '@constants/pickers';

interface AgeSelectorSheetProps {
  visible: boolean;
  value?: number;
  onClose: () => void;
  onConfirm: (age: number) => void;
}

const ITEM_HEIGHT = 48;
const VISIBLE_ROWS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

const ages = Array.from(
  { length: AGE_MAX - AGE_MIN + 1 },
  (_, i) => AGE_MIN + i
);

const styles = StyleSheet.create({
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.lg,
    marginBottom: metrics.spacing.md,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  counterValue: {
    minWidth: 88,
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
  },
  wheelWrap: {
    height: PICKER_HEIGHT,
    position: 'relative',
    marginBottom: metrics.spacing.sm,
  },
  wheelHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: metrics.radius.lg,
    zIndex: 2,
    backgroundColor: 'rgba(255, 68, 88, 0.12)',
  },
  wheelList: {
    flex: 1,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export const AgeSelectorSheet: React.FC<AgeSelectorSheetProps> = ({
  visible,
  value,
  onClose,
  onConfirm,
}) => {
  const { theme } = useThemeStore();
  const listRef = useRef<FlatList<number>>(null);
  const draftRef = useRef(value && value >= AGE_MIN ? value : 25);
  const isSnapping = useRef(false);
  const [draftAge, setDraftAge] = useState(draftRef.current);

  const scrollToAge = useCallback((age: number, animated = true) => {
    const clamped = Math.min(AGE_MAX, Math.max(AGE_MIN, age));
    const index = clamped - AGE_MIN;
    draftRef.current = clamped;
    setDraftAge(clamped);
    isSnapping.current = true;
    listRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
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
      const age = value && value >= AGE_MIN ? value : 25;
      draftRef.current = age;
      setDraftAge(age);
      requestAnimationFrame(() => {
        scrollToAge(age, false);
      });
    }
  }, [visible, value, scrollToAge]);

  const snapFromOffset = useCallback(
    (offsetY: number, animated: boolean) => {
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.min(ages.length - 1, Math.max(0, index));
      const targetOffset = clampedIndex * ITEM_HEIGHT;
      const age = AGE_MIN + clampedIndex;

      draftRef.current = age;
      setDraftAge(age);

      if (Math.abs(offsetY - targetOffset) > 0.5 && !isSnapping.current) {
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
    },
    []
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isSnapping.current) return;
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.min(ages.length - 1, Math.max(0, index));
    const age = AGE_MIN + clampedIndex;
    if (age !== draftRef.current) {
      draftRef.current = age;
      setDraftAge(age);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    snapFromOffset(e.nativeEvent.contentOffset.y, true);
  };

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <View style={styles.wheelItem}>
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.wheelText}
          children={String(item)}
        />
      </View>
    ),
    [theme.custom.textSecondary]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Your age"
      subtitle="You must be 18 or older"
      heightRatio={0.52}
      footer={
        <GradientButton
          label="Confirm age"
          size="lg"
          onPress={() => onConfirm(draftRef.current)}
        />
      }
    >
      <View style={styles.counterRow}>
        <TouchableOpacity
          style={[styles.counterBtn, { borderColor: theme.custom.border }]}
          onPress={() => scrollToAge(draftRef.current - 1)}
        >
          <MaterialCommunityIcons
            name="minus"
            size={26}
            color={theme.custom.text}
          />
        </TouchableOpacity>

        <View style={styles.counterValue}>
          <BaseText
            variant="h1"
            color={theme.colors.primary}
            style={styles.counterNumber}
            children={String(draftAge)}
          />
          <BaseText
            variant="caption"
            color={theme.custom.textSecondary}
            children="years old"
          />
        </View>

        <TouchableOpacity
          style={[styles.counterBtn, { borderColor: theme.custom.border }]}
          onPress={() => scrollToAge(draftRef.current + 1)}
        >
          <MaterialCommunityIcons
            name="plus"
            size={26}
            color={theme.custom.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.wheelWrap}>
        <FlatList
          ref={listRef}
          style={styles.wheelList}
          data={ages}
          keyExtractor={item => String(item)}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="normal"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={7}
          removeClippedSubviews
        />
        <View style={styles.wheelHighlight} pointerEvents="none" />
      </View>
    </BottomSheet>
  );
};
