import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 4;
const MIN_TRACK_WIDTH = 200;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const snapToStep = (value: number, min: number, step: number) =>
  min + Math.round((value - min) / step) * step;

interface FilterSingleSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue: (value: number) => string;
  onChange: (value: number) => void;
}

export const FilterSingleSlider: React.FC<FilterSingleSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  onChange,
}) => {
  const { theme } = useThemeStore();
  const trackWidthRef = useRef(MIN_TRACK_WIDTH);
  const [, setLayoutTick] = useState(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const valueToX = useCallback(
    (v: number) => {
      const range = max - min;
      if (range <= 0) return 0;
      return ((clamp(v, min, max) - min) / range) * trackWidthRef.current;
    },
    [min, max],
  );

  const xToValue = useCallback(
    (x: number) => {
      const range = max - min;
      const ratio = clamp(x, 0, trackWidthRef.current) / trackWidthRef.current;
      const raw = min + ratio * range;
      return clamp(snapToStep(raw, min, step), min, max);
    },
    [min, max, step],
  );

  const updateFromPageX = useCallback(
    (pageX: number, trackLeft: number) => {
      const localX = pageX - trackLeft - THUMB_SIZE / 2;
      onChangeRef.current(xToValue(localX));
    },
    [xToValue],
  );

  const trackRef = useRef<View>(null);
  const trackLeftRef = useRef(0);

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow(x => {
      trackLeftRef.current = x;
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        measureTrack();
        updateFromPageX(evt.nativeEvent.pageX, trackLeftRef.current);
      },
      onPanResponderMove: evt => {
        updateFromPageX(evt.nativeEvent.pageX, trackLeftRef.current);
      },
    }),
  ).current;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width - THUMB_SIZE;
    trackWidthRef.current = Math.max(w, 1);
    setLayoutTick(t => t + 1);
    measureTrack();
  };

  const thumbLeft = valueToX(value);
  const fillWidth = thumbLeft + THUMB_SIZE / 2;

  return (
    <View style={styles.section}>
      <View style={styles.labelRow}>
        <BaseText
          variant="bodyMedium"
          color={theme.custom.text}
          style={styles.labelBold}
          children={label}
        />
        <BaseText
          variant="bodyMedium"
          color={theme.colors.primary}
          style={styles.valueBold}
          children={formatValue(value)}
        />
      </View>

      <View
        ref={trackRef}
        style={styles.trackWrap}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
      >
        <View
          style={[styles.track, { backgroundColor: theme.custom.surfaceVariant }]}
        >
          <View
            style={[
              styles.trackFill,
              {
                width: fillWidth,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            {
              left: thumbLeft,
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.18,
                  shadowRadius: 4,
                },
                android: { elevation: 3 },
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

interface FilterRangeSliderProps {
  label: string;
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step?: number;
  minGap?: number;
  formatRange: (minVal: number, maxVal: number) => string;
  onChange: (minVal: number, maxVal: number) => void;
}

export const FilterRangeSlider: React.FC<FilterRangeSliderProps> = ({
  label,
  minValue,
  maxValue,
  min,
  max,
  step = 1,
  minGap = 1,
  formatRange,
  onChange,
}) => {
  const { theme } = useThemeStore();
  const trackWidthRef = useRef(MIN_TRACK_WIDTH);
  const [, setLayoutTick] = useState(0);
  const activeThumb = useRef<'min' | 'max'>('min');
  const trackLeftRef = useRef(0);
  const trackRef = useRef<View>(null);
  const valuesRef = useRef({ minValue, maxValue });
  valuesRef.current = { minValue, maxValue };

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const valueToX = useCallback(
    (v: number) => {
      const range = max - min;
      if (range <= 0) return 0;
      return ((clamp(v, min, max) - min) / range) * trackWidthRef.current;
    },
    [min, max],
  );

  const xToValue = useCallback(
    (x: number) => {
      const range = max - min;
      const ratio = clamp(x, 0, trackWidthRef.current) / trackWidthRef.current;
      const raw = min + ratio * range;
      return clamp(snapToStep(raw, min, step), min, max);
    },
    [min, max, step],
  );

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow(x => {
      trackLeftRef.current = x;
    });
  }, []);

  const updateFromPageX = useCallback(
    (pageX: number) => {
      const localX = pageX - trackLeftRef.current - THUMB_SIZE / 2;
      const next = xToValue(localX);
      const { minValue: curMin, maxValue: curMax } = valuesRef.current;

      if (activeThumb.current === 'min') {
        onChangeRef.current(Math.min(next, curMax - minGap), curMax);
      } else {
        onChangeRef.current(curMin, Math.max(next, curMin + minGap));
      }
    },
    [minGap, xToValue],
  );

  const pickThumb = useCallback(
    (pageX: number) => {
      const localX = pageX - trackLeftRef.current - THUMB_SIZE / 2;
      const minX = valueToX(minValue);
      const maxX = valueToX(maxValue);
      activeThumb.current =
        Math.abs(localX - minX) <= Math.abs(localX - maxX) ? 'min' : 'max';
    },
    [minValue, maxValue, valueToX],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        measureTrack();
        pickThumb(evt.nativeEvent.pageX);
        updateFromPageX(evt.nativeEvent.pageX);
      },
      onPanResponderMove: evt => {
        updateFromPageX(evt.nativeEvent.pageX);
      },
    }),
  ).current;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width - THUMB_SIZE;
    trackWidthRef.current = Math.max(w, 1);
    setLayoutTick(t => t + 1);
    measureTrack();
  };

  const minThumbLeft = valueToX(minValue);
  const maxThumbLeft = valueToX(maxValue);
  const rangeFillLeft = minThumbLeft + THUMB_SIZE / 2;
  const rangeFillWidth = Math.max(maxThumbLeft - minThumbLeft, 0);

  return (
    <View style={styles.section}>
      <View style={styles.labelRow}>
        <BaseText
          variant="bodyMedium"
          color={theme.custom.text}
          style={styles.labelBold}
          children={label}
        />
        <BaseText
          variant="bodyMedium"
          color={theme.colors.primary}
          style={styles.valueBold}
          children={formatRange(minValue, maxValue)}
        />
      </View>

      <View
        ref={trackRef}
        style={styles.trackWrap}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
      >
        <View
          style={[styles.track, { backgroundColor: theme.custom.surfaceVariant }]}
        >
          <View
            style={[
              styles.trackFill,
              {
                left: rangeFillLeft,
                width: rangeFillWidth,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>

        <View
          style={[
            styles.thumb,
            {
              left: minThumbLeft,
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
              zIndex: 2,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.18,
                  shadowRadius: 4,
                },
                android: { elevation: 3 },
              }),
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              left: maxThumbLeft,
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
              zIndex: 2,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.18,
                  shadowRadius: 4,
                },
                android: { elevation: 3 },
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: metrics.spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
  },
  labelBold: {
    fontWeight: '700',
  },
  valueBold: {
    fontWeight: '700',
  },
  trackWrap: {
    height: THUMB_SIZE + metrics.spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    top: (THUMB_SIZE + metrics.spacing.sm - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
