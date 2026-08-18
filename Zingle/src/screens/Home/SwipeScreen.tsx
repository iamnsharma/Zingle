import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  PanResponder,
  Animated,
  Text,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore, useProfileStore, useMembershipStore, useSafetyStore } from '@stores';
import { useMatchStore } from '@stores/matchStore';
import { useFilterStore } from '@stores/filterStore';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import {
  AnimatedSwipeCard,
  FilterBottomSheet,
  BottomSheet,
  EmptyState,
} from '@components/molecules';
import { hexToRgba } from '@utils/colorUtils';
import { MOCK_PROFILES } from '@services/mock/data';

const SWIPE_THRESHOLD = 100;
const PAN_ACTIVATE = 12;
const ROTATION_RANGE = 12;
const HEADER_ESTIMATE = 52;
const ACTION_BAR_HEIGHT = 72;
const TAB_BAR_ESTIMATE = 68;

const SPRING_SNAP = { friction: 8, tension: 100, useNativeDriver: true as const };
const EXIT_DURATION = 220;

const ACTION = {
  pass: { color: '#FF4458', icon: 'close' as const, size: 26 },
  superlike: { color: '#0099FF', icon: 'star-four-points' as const, size: 24 },
  like: { color: '#FF4458', icon: 'heart' as const, size: 26 },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
  },
  logo: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: metrics.spacing.sm },
  filterButton: { padding: metrics.spacing.xs, position: 'relative' },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.md,
    paddingTop: metrics.spacing.xs,
  },
  card: { alignSelf: 'center' },
  cardInner: {
    flex: 1,
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  tintOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
  emptyText: { textAlign: 'center', marginBottom: metrics.spacing.md },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.sm,
    gap: metrics.spacing.lg,
  },
  actionButtonOuter: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  actionButtonGlass: {
    borderWidth: 1,
  },
  actionFill: { ...StyleSheet.absoluteFillObject },
  glassSheen: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
  },
  iconLayer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStackStyle: {
    position: 'absolute' as const,
    zIndex: -1,
    opacity: 0.55,
  },
  stamp: {
    position: 'absolute',
    zIndex: 10,
    borderWidth: 4,
    borderRadius: metrics.radius.md,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
  },
  likeStamp: { top: 56, left: 24, borderColor: '#4CCC93' },
  nopeStamp: { top: 56, right: 24, borderColor: '#FF4458' },
  superlikeStamp: {
    top: 64,
    alignSelf: 'center',
    borderColor: '#0099FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.lg,
  },
  stampText: { fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  likeStampText: { color: '#4CCC93' },
  nopeStampText: { color: '#FF4458' },
  superlikeStampText: {
    color: '#0099FF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardFill: { width: '100%', height: '100%' },
});

type SwipeAction = 'like' | 'pass' | 'superlike';

interface SwipeActionButtonProps {
  icon: string;
  iconSize: number;
  color: string;
  borderColor: string;
  highlight: Animated.AnimatedInterpolation<number>;
  scale: Animated.AnimatedInterpolation<number>;
  inactiveOpacity: Animated.AnimatedInterpolation<number>;
  glass?: boolean;
  onPress: () => void;
}

const SwipeActionButton: React.FC<SwipeActionButtonProps> = ({
  icon,
  iconSize,
  color,
  borderColor,
  highlight,
  scale,
  inactiveOpacity,
  glass = false,
  onPress,
}) => {
  const whiteIconOpacity = highlight;
  const colorIconOpacity = highlight.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const baseStyle = glass
    ? [
        styles.actionButton,
        styles.actionButtonGlass,
        { backgroundColor: hexToRgba(color, 0.12), borderColor: hexToRgba(color, 0.4) },
      ]
    : [styles.actionButton, { borderColor }];

  return (
    <Animated.View
      style={[
        styles.actionButtonOuter,
        { opacity: inactiveOpacity, transform: [{ scale }] },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={baseStyle}>
          {glass ? (
            <LinearGradient
              colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              locations={[0, 0.55, 1]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={styles.glassSheen}
              pointerEvents="none"
            />
          ) : null}
          <Animated.View
            style={[styles.actionFill, { backgroundColor: color, opacity: highlight }]}
          />
          <View style={styles.iconLayer}>
            <Animated.View style={{ opacity: colorIconOpacity, ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name={icon} size={iconSize} color={color} />
            </Animated.View>
            <Animated.View style={{ opacity: whiteIconOpacity, ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name={icon} size={iconSize} color="#FFFFFF" />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HomeScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const { hasActiveFilters, resetFilters, filters } = useFilterStore();
  const glassEnabled = useProfileStore(state => state.appSettings.liquidGlass);
  const interestedIn = useProfileStore(state => state.currentUser?.interestedIn);
  const consumeLike = useMembershipStore(state => state.consumeLike);
  const consumeSuperLike = useMembershipStore(state => state.consumeSuperLike);
  const seenIds = useMatchStore(state => state.seenIds);
  const recordPass = useMatchStore(state => state.recordPass);
  const recordLike = useMatchStore(state => state.recordLike);
  const blockedIds = useSafetyStore(state => state.blockedIds);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const profiles = useMemo(
    () =>
      MOCK_PROFILES.filter(profile => {
        if (seenIds.includes(profile.id)) return false;
        if (blockedIds.includes(profile.id)) return false;
        if (
          profile.age < (filters.ageMin ?? 18) ||
          profile.age > (filters.ageMax ?? 80)
        ) {
          return false;
        }
        const showMe =
          filters.showMe && filters.showMe.length > 0
            ? filters.showMe
            : interestedIn;
        if (showMe && showMe.length > 0 && !showMe.includes(profile.gender)) {
          return false;
        }
        return true;
      }),
    [seenIds, blockedIds, filters, interestedIn],
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState<'likes' | 'superLikes' | null>(null);

  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  // Lock a gesture to a single axis so only one action (like/pass OR super like)
  // is ever highlighted at a time — prevents diagonal "double stamp" glitches.
  const gestureAxis = useRef<'none' | 'h' | 'v'>('none');

  const resetPan = useCallback(() => {
    panX.setValue(0);
    panY.setValue(0);
  }, [panX, panY]);

  const currentProfile = profiles[0];

  React.useEffect(() => {
    resetPan();
  }, [currentProfile?.id, resetPan]);

  // Warm up remote images once so the first swipe doesn't stutter while the
  // next card decodes its photos.
  React.useEffect(() => {
    profiles.forEach(profile => {
      profile.photos?.forEach(uri => {
        if (uri) Image.prefetch(uri);
      });
    });
  }, [profiles]);

  const filtersActive = hasActiveFilters();

  const cardWidth = width - metrics.spacing.md * 2;
  const reservedHeight =
    HEADER_ESTIMATE +
    ACTION_BAR_HEIGHT +
    TAB_BAR_ESTIMATE +
    insets.top +
    metrics.spacing.sm;
  const cardHeight = Math.max(height - reservedHeight, cardWidth * 1.15);
  const cardSize = useMemo(
    () => ({ width: cardWidth, height: cardHeight }),
    [cardWidth, cardHeight],
  );

  const completeSwipe = useCallback(
    (action: SwipeAction) => {
      if (isAnimating.current || !currentProfile) return;
      isAnimating.current = true;
      const swiped = currentProfile;

      const targets: Record<SwipeAction, { x: number; y: number }> = {
        like: { x: width * 1.4, y: 0 },
        pass: { x: -width * 1.4, y: 0 },
        superlike: { x: 0, y: -height * 0.75 },
      };

      Animated.parallel([
        Animated.timing(panX, {
          toValue: targets[action].x,
          duration: EXIT_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(panY, {
          toValue: targets[action].y,
          duration: EXIT_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) {
          isAnimating.current = false;
          return;
        }
        if (action === 'pass') {
          recordPass(swiped);
        } else {
          recordLike(swiped, action === 'superlike' ? 'superlike' : 'like');
        }
        isAnimating.current = false;
      });
    },
    [width, height, panX, panY, currentProfile, recordPass, recordLike],
  );

  const snapBack = useCallback(() => {
    Animated.parallel([
      Animated.spring(panX, { toValue: 0, ...SPRING_SNAP }),
      Animated.spring(panY, { toValue: 0, ...SPRING_SNAP }),
    ]).start();
  }, [panX, panY]);

  const handlePass = useCallback(() => completeSwipe('pass'), [completeSwipe]);

  const handleLike = useCallback(() => {
    if (consumeLike()) {
      completeSwipe('like');
    } else {
      snapBack();
      setLimitOpen('likes');
    }
  }, [consumeLike, completeSwipe, snapBack]);

  const handleSuperLike = useCallback(() => {
    if (consumeSuperLike()) {
      completeSwipe('superlike');
    } else {
      snapBack();
      setLimitOpen('superLikes');
    }
  }, [consumeSuperLike, completeSwipe, snapBack]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, { dx, dy }) =>
          !isAnimating.current &&
          (Math.abs(dx) > PAN_ACTIVATE || Math.abs(dy) > PAN_ACTIVATE),
        onPanResponderGrant: () => {
          gestureAxis.current = 'none';
        },
        onPanResponderMove: (_, { dx, dy }) => {
          // Decide the axis on first significant movement, then stay locked.
          if (gestureAxis.current === 'none') {
            if (Math.abs(dx) > PAN_ACTIVATE || Math.abs(dy) > PAN_ACTIVATE) {
              // Only treat as vertical (super like) when clearly upward-dominant.
              gestureAxis.current =
                dy < 0 && Math.abs(dy) > Math.abs(dx) * 1.2 ? 'v' : 'h';
            }
          }

          if (gestureAxis.current === 'v') {
            panY.setValue(dy);
            panX.setValue(0);
          } else if (gestureAxis.current === 'h') {
            panX.setValue(dx);
            panY.setValue(0);
          }
        },
        onPanResponderRelease: (_, { dx, dy, vx, vy }) => {
          const axis = gestureAxis.current;
          gestureAxis.current = 'none';

          if (axis === 'v' && (dy < -SWIPE_THRESHOLD || vy < -0.45)) {
            handleSuperLike();
          } else if (axis === 'h' && (dx > SWIPE_THRESHOLD || vx > 0.45)) {
            handleLike();
          } else if (axis === 'h' && (dx < -SWIPE_THRESHOLD || vx < -0.45)) {
            handlePass();
          } else {
            snapBack();
          }
        },
        onPanResponderTerminate: () => {
          gestureAxis.current = 'none';
          snapBack();
        },
      }),
    [panX, panY, handlePass, handleLike, handleSuperLike, snapBack],
  );

  const handleFilterPress = () => {
    if (filtersActive) {
      resetFilters();
    } else {
      setFilterOpen(true);
    }
  };

  const rotate = panX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [`-${ROTATION_RANGE}deg`, '0deg', `${ROTATION_RANGE}deg`],
    extrapolate: 'clamp',
  });

  const likeOpacity = panX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const superlikeOpacity = panY.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const likeStampScale = panX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0.85, 1.05],
    extrapolate: 'clamp',
  });

  const nopeStampScale = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1.05, 0.85],
    extrapolate: 'clamp',
  });

  const superStampScale = panY.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1.05, 0.85],
    extrapolate: 'clamp',
  });

  const likeRotate = panX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: ['-10deg', '-16deg'],
    extrapolate: 'clamp',
  });

  const nopeRotate = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: ['16deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeTintOpacity = panX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 0.2],
    extrapolate: 'clamp',
  });

  const nopeTintOpacity = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [0.2, 0],
    extrapolate: 'clamp',
  });

  const superlikeTintOpacity = panY.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [0.24, 0],
    extrapolate: 'clamp',
  });

  // Bottom button highlights — Tinder-style
  const passHighlight = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.35, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const likeHighlight = panX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.35, SWIPE_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const superHighlight = panY.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.35, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const passBtnScale = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [1.28, 1, 0.88],
    extrapolate: 'clamp',
  });

  const likeBtnScale = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [0.88, 1, 1.28],
    extrapolate: 'clamp',
  });

  const superBtnScale = panY.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1.28, 1],
    extrapolate: 'clamp',
  });

  const passInactive = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD * 0.3],
    outputRange: [1, 0.55, 0.55],
    extrapolate: 'clamp',
  });

  const likeInactive = panX.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 0.3, 0, SWIPE_THRESHOLD],
    outputRange: [0.55, 0.55, 1],
    extrapolate: 'clamp',
  });

  const superInactive = panY.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.2, 0],
    outputRange: [1, 0.55, 0.55],
    extrapolate: 'clamp',
  });

  const cardTransform = {
    transform: [
      { translateX: panX },
      { translateY: panY },
      { rotate },
    ],
  };

  if (!currentProfile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <BaseText variant="h2" color={theme.colors.primary} style={styles.logo} children="Zingle" />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
              <MaterialCommunityIcons name="tune-variant" size={26} color={theme.custom.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="cards-playing-outline"
            title="No more profiles"
            subtitle="Come back later, or loosen filters to see more people."
          />
        </View>
        <FilterBottomSheet visible={filterOpen} onClose={() => setFilterOpen(false)} />
      </SafeAreaView>
    );
  }

  const nextProfile = profiles[1];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <BaseText variant="h2" color={theme.colors.primary} style={styles.logo} children="Zingle" />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            onLongPress={() => setFilterOpen(true)}
            delayLongPress={280}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons
              name={filtersActive ? 'filter-remove-outline' : 'tune-variant'}
              size={26}
              color={filtersActive ? theme.colors.primary : theme.custom.textSecondary}
            />
            {filtersActive ? (
              <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]} />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {nextProfile ? (
          <View
            style={[
              styles.card,
              styles.cardStackStyle,
              cardSize,
              { transform: [{ scale: 0.965 }, { translateY: 10 }] },
            ]}
          >
            <AnimatedSwipeCard
              photos={nextProfile.photos}
              name={nextProfile.name}
              age={nextProfile.age}
              distance={5}
              profession={nextProfile.profession}
              bio={nextProfile.bio}
              interests={nextProfile.interests}
              blendToHeader
              style={styles.cardFill}
            />
          </View>
        ) : null}

        <Animated.View
          key={currentProfile.id}
          style={[styles.card, cardSize, cardTransform]}
          renderToHardwareTextureAndroid
          shouldRasterizeIOS
          {...panResponder.panHandlers}
        >
          <View style={styles.cardInner}>
            <AnimatedSwipeCard
              photos={currentProfile.photos}
              name={currentProfile.name}
              age={currentProfile.age}
              distance={5}
              profession={currentProfile.profession}
              bio={currentProfile.bio}
              interests={currentProfile.interests}
              blendToHeader
              style={styles.cardFill}
            />

            <Animated.View
              style={[styles.tintOverlay, { backgroundColor: '#4CCC93', opacity: likeTintOpacity }]}
              pointerEvents="none"
            />
            <Animated.View
              style={[styles.tintOverlay, { backgroundColor: '#FF4458', opacity: nopeTintOpacity }]}
              pointerEvents="none"
            />
            <Animated.View
              style={[styles.tintOverlay, { backgroundColor: '#0099FF', opacity: superlikeTintOpacity }]}
              pointerEvents="none"
            />

            <Animated.View
              style={[
                styles.stamp,
                styles.likeStamp,
                { opacity: likeOpacity, transform: [{ rotate: likeRotate }, { scale: likeStampScale }] },
              ]}
              pointerEvents="none"
            >
              <Text style={[styles.stampText, styles.likeStampText]}>LIKE</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.stamp,
                styles.nopeStamp,
                { opacity: nopeOpacity, transform: [{ rotate: nopeRotate }, { scale: nopeStampScale }] },
              ]}
              pointerEvents="none"
            >
              <Text style={[styles.stampText, styles.nopeStampText]}>NOPE</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.stamp,
                styles.superlikeStamp,
                { opacity: superlikeOpacity, transform: [{ scale: superStampScale }] },
              ]}
              pointerEvents="none"
            >
              <MaterialCommunityIcons name="star-four-points" size={22} color="#0099FF" />
              <Text style={[styles.stampText, styles.superlikeStampText]}>SUPER LIKE</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionContainer}>
        <SwipeActionButton
          icon={ACTION.pass.icon}
          iconSize={ACTION.pass.size}
          color={ACTION.pass.color}
          borderColor="#E5E7EB"
          highlight={passHighlight}
          scale={passBtnScale}
          inactiveOpacity={passInactive}
          glass={glassEnabled}
          onPress={handlePass}
        />
        <SwipeActionButton
          icon={ACTION.superlike.icon}
          iconSize={ACTION.superlike.size}
          color={ACTION.superlike.color}
          borderColor="#FAB938"
          highlight={superHighlight}
          scale={superBtnScale}
          inactiveOpacity={superInactive}
          glass={glassEnabled}
          onPress={handleSuperLike}
        />
        <SwipeActionButton
          icon={ACTION.like.icon}
          iconSize={ACTION.like.size}
          color={ACTION.like.color}
          borderColor="#FF4458"
          highlight={likeHighlight}
          scale={likeBtnScale}
          inactiveOpacity={likeInactive}
          glass={glassEnabled}
          onPress={handleLike}
        />
      </View>

      <FilterBottomSheet visible={filterOpen} onClose={() => setFilterOpen(false)} />
      <BottomSheet
        visible={limitOpen !== null}
        onClose={() => setLimitOpen(null)}
        title={limitOpen === 'superLikes' ? "You're out of Super Likes" : "You're out of Likes"}
        heightRatio={0.42}
      >
        <EmptyState
          icon={limitOpen === 'superLikes' ? 'star-four-points-outline' : 'heart-outline'}
          title="That's all for now"
          subtitle="Zingle is free for now. Keep passing, or come back later."
        />
      </BottomSheet>
    </SafeAreaView>
  );
};
