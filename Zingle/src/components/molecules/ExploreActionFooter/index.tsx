import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

const BTN_HEIGHT = 56;
const SEPARATE_X = 46;
const DROP_Y = -34;

const SPRING = {
  friction: 7,
  tension: 65,
  useNativeDriver: true as const,
};

interface ExploreActionFooterProps {
  likeLabel?: string;
  revealed: boolean;
  onLike: () => void;
  onPass: () => void;
}

export const ExploreActionFooter: React.FC<ExploreActionFooterProps> = ({
  likeLabel = 'Like',
  revealed,
  onLike,
  onPass,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(reveal, {
      toValue: revealed ? 1 : 0,
      ...SPRING,
    }).start();
  }, [revealed, reveal]);

  const containerOpacity = reveal.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.6, 1],
  });
  const containerTranslateY = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const passTransform = {
    opacity: reveal,
    transform: [
      {
        translateY: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [DROP_Y, 0],
        }),
      },
      {
        translateX: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [SEPARATE_X, 0],
        }),
      },
      {
        scale: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
  };

  const likeTransform = {
    opacity: reveal,
    transform: [
      {
        translateY: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [DROP_Y, 0],
        }),
      },
      {
        translateX: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [-SEPARATE_X, 0],
        }),
      },
      {
        scale: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.footer,
        {
          borderTopColor: theme.custom.border,
          backgroundColor: theme.colors.surface,
          paddingBottom: insets.bottom + metrics.spacing.md,
          opacity: containerOpacity,
          transform: [{ translateY: containerTranslateY }],
        },
      ]}
      pointerEvents={revealed ? 'auto' : 'none'}
    >
      <View style={styles.row}>
        <Animated.View style={passTransform}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPass}
            style={[styles.passBtn, { borderColor: theme.custom.border }]}
          >
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.custom.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.likeWrap, likeTransform]}>
          <TouchableOpacity activeOpacity={0.85} onPress={onLike}>
            <LinearGradient
              colors={theme.custom.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.likeBtn}
            >
              <MaterialCommunityIcons name="heart" size={22} color="#FFFFFF" />
              <BaseText
                variant="button"
                color="#FFFFFF"
                style={styles.likeLabel}
                children={likeLabel}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
  },
  passBtn: {
    width: BTN_HEIGHT,
    height: BTN_HEIGHT,
    borderRadius: BTN_HEIGHT / 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  likeWrap: {
    flex: 1,
  },
  likeBtn: {
    height: BTN_HEIGHT,
    borderRadius: BTN_HEIGHT / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  likeLabel: {
    fontWeight: '700',
  },
});
