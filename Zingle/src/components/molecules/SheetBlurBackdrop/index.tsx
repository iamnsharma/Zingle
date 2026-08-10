import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'react-native-parity-blur';

interface SheetBlurBackdropProps {
  /** Animated opacity (0–1) driven by the sheet open/drag animations. */
  opacity: Animated.Value | Animated.AnimatedInterpolation<number>;
  /** When set, wraps the blur in a pressable dismiss layer (used inside Modal). */
  onPress?: () => void;
  /**
   * `underlay` — render in the app tree (outside Modal) so live blur can
   * capture real screen content. Pair with a transparent Modal sheet on top.
   * `modal` — render inside Modal (dismiss pressable included).
   */
  placement?: 'underlay' | 'modal';
  style?: StyleProp<ViewStyle>;
}

/**
 * Live backdrop blur for bottom sheets via react-native-parity-blur.
 *
 * Prefer `placement="underlay"`: RN Modal is a separate native window, so a
 * BlurView inside it cannot capture the app behind it. Render the underlay
 * as a sibling outside the Modal, then keep the Modal transparent.
 */
export const SheetBlurBackdrop: React.FC<SheetBlurBackdropProps> = ({
  opacity,
  onPress,
  placement = 'underlay',
  style,
}) => {
  const blur = (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        mode="live"
        blurRadius={22}
        saturation={1.25}
        overlayColor="rgba(16, 16, 16, 0.38)"
        fallbackColor="rgba(20, 20, 20, 0.78)"
        quality="balanced"
        maxFps={30}
      />
    </Animated.View>
  );

  if (placement === 'underlay') {
    return (
      <View style={styles.underlay} pointerEvents="none">
        {blur}
      </View>
    );
  }

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
      {blur}
    </Pressable>
  );
};

/** Invisible full-screen dismiss target for use inside a transparent Modal. */
export const SheetDismissLayer: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />;

const styles = StyleSheet.create({
  underlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 900,
    elevation: 900,
  },
});
