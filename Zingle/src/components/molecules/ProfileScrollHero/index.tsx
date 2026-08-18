import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { hexToRgba } from '@utils/colorUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_WIDTH * 1.15;
const COMPACT_HEIGHT = 60;
const COLLAPSE_POINT = HERO_HEIGHT * 0.55;
const BOTTOM_BLEND_HEIGHT = 200;
const BODY_OVERLAP = 28;

interface ProfileScrollHeroProps {
  photoUri: string;
  name: string;
  age: number;
  profession?: string;
  verified?: boolean;
  heroBadge?: React.ReactNode;
  onBack: () => void;
  onMore?: () => void;
  onNearBottomChange?: (near: boolean) => void;
  children: React.ReactNode;
}

const BOTTOM_THRESHOLD = 90;

export const ProfileScrollHero: React.FC<ProfileScrollHeroProps> = ({
  photoUri,
  name,
  age,
  profession,
  verified,
  heroBadge,
  onBack,
  onMore,
  onNearBottomChange,
  children,
}) => {
  const { theme } = useThemeStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const nearBottomRef = useRef(false);

  const surfaceColor = theme.colors.surface;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceToBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    const near = distanceToBottom < BOTTOM_THRESHOLD;
    if (near !== nearBottomRef.current) {
      nearBottomRef.current = near;
      onNearBottomChange?.(near);
    }
  };

  // Parallax + overscroll stretch (native driver)
  const imageTranslateY = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0, HERO_HEIGHT],
    outputRange: [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.35],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0],
    outputRange: [2.2, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });

  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_POINT * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const compactOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_POINT * 0.6, COLLAPSE_POINT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const compactTranslateY = scrollY.interpolate({
    inputRange: [COLLAPSE_POINT * 0.6, COLLAPSE_POINT],
    outputRange: [-8, 0],
    extrapolate: 'clamp',
  });

  const bottomBlendColors = [
    'transparent',
    hexToRgba(surfaceColor, 0.02),
    hexToRgba(surfaceColor, 0.08),
    hexToRgba(surfaceColor, 0.2),
    hexToRgba(surfaceColor, 0.4),
  ];

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true, listener: handleScroll },
        )}
      >
        <View style={styles.heroWrap}>
          <Animated.View
            style={[
              styles.heroImageWrap,
              {
                transform: [
                  { translateY: imageTranslateY },
                  { scale: imageScale },
                ],
              },
            ]}
          >
            <Image
              source={{ uri: photoUri }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </Animated.View>

          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <LinearGradient
            colors={bottomBlendColors}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            style={styles.bottomBlend}
            pointerEvents="none"
          />

          <Animated.View
            style={[styles.heroOverlay, { opacity: overlayOpacity }]}
            pointerEvents="none"
          >
            {heroBadge}
            <BaseText variant="h1" color="#FFFFFF" children={`${name}, ${age}`} />
            {profession ? (
              <BaseText
                variant="body"
                color="rgba(255,255,255,0.9)"
                children={profession}
              />
            ) : null}
            {verified ? (
              <View style={styles.verifiedRow}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={18}
                  color={theme.colors.tertiary}
                />
                <BaseText
                  variant="caption"
                  color="rgba(255,255,255,0.85)"
                  children="Verified"
                />
              </View>
            ) : null}
          </Animated.View>
        </View>

        <View
          style={[
            styles.body,
            { backgroundColor: surfaceColor, marginTop: -BODY_OVERLAP },
          ]}
        >
          {children}
        </View>
      </Animated.ScrollView>

      {/* Compact sticky header */}
      <Animated.View
        style={[
          styles.compactHeader,
          {
            opacity: compactOpacity,
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.custom.border,
            transform: [{ translateY: compactTranslateY }],
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.compactSpacer} />
        <Image source={{ uri: photoUri }} style={styles.compactAvatar} />
        <View style={styles.compactText}>
          <BaseText
            variant="bodyMedium"
            color={theme.custom.text}
            style={styles.compactName}
            numberOfLines={1}
            children={`${name}, ${age}`}
          />
        </View>
      </Animated.View>

      {/* Fixed top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
          onPress={onBack}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#FFF" />
        </TouchableOpacity>
        {onMore ? (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
            onPress={onMore}
          >
            <MaterialCommunityIcons name="dots-horizontal" size={22} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    minHeight: HERO_HEIGHT + SCREEN_HEIGHT * 0.6,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    height: COMPACT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    gap: metrics.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  compactSpacer: {
    width: 40,
  },
  compactAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111',
  },
  compactText: {
    flex: 1,
  },
  compactName: {
    fontWeight: '700',
  },
  heroWrap: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  heroImageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  bottomBlend: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_BLEND_HEIGHT,
    zIndex: 2,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BODY_OVERLAP + metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    zIndex: 3,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginTop: metrics.spacing.xs,
  },
  body: {
    borderTopLeftRadius: metrics.radius.xl,
    borderTopRightRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    paddingBottom: 140,
    gap: metrics.spacing.lg,
    zIndex: 5,
    flex: 1,
  },
});
