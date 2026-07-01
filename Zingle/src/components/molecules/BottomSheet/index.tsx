import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

const DISMISS_THRESHOLD = 120;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  heightRatio?: number;
  scrollable?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheet: {
    borderTopLeftRadius: metrics.radius['2xl'],
    borderTopRightRadius: metrics.radius['2xl'],
    ...metrics.shadows.lg,
  },
  sheetColumn: {
    flexDirection: 'column',
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
  header: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.sm,
    gap: metrics.spacing.xs,
  },
  body: {
    paddingHorizontal: metrics.spacing.lg,
    flexShrink: 1,
  },
  bodyScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.xs,
    flexShrink: 0,
  },
});

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  heightRatio = 0.52,
  scrollable = false,
  children,
  footer,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const maxSheetHeight = screenHeight * heightRatio;

  const translateY = useRef(new Animated.Value(maxSheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(maxSheetHeight);
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
  }, [visible, maxSheetHeight, translateY, backdropOpacity]);

  const closeSheet = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: maxSheetHeight,
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
            Math.max(0, 1 - dy / (maxSheetHeight * 0.6))
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

  if (!visible) return null;

  const bodyContent = scrollable ? (
    <ScrollView
      style={styles.bodyScroll}
      contentContainerStyle={styles.body}
      bounces={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.body}>{children}</View>
  );

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </Pressable>

        <Animated.View
          style={[
            styles.sheet,
            styles.sheetColumn,
            {
              maxHeight: maxSheetHeight,
              paddingBottom: insets.bottom + metrics.spacing.sm,
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

          <View style={styles.header}>
            <BaseText variant="h2" color={theme.custom.text} children={title} />
            {subtitle ? (
              <BaseText
                variant="body"
                color={theme.custom.textSecondary}
                children={subtitle}
              />
            ) : null}
          </View>

          {bodyContent}

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

export type BottomSheetCloseFn = (callback?: () => void) => void;
