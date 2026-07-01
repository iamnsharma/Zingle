import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  PanResponder,
  Animated,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { useMatchStore } from '@stores/matchStore';
import { useFilterStore } from '@stores/filterStore';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { AnimatedSwipeCard, FilterBottomSheet } from '@components/molecules';
import { MOCK_PROFILES } from '@services/mock/data';

const SWIPE_THRESHOLD = 100;
const ROTATION_RANGE = 12;
const CARD_ASPECT = 1.22; // width : height (~4:5 Tinder ratio)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  filterButton: {
    padding: metrics.spacing.xs,
    position: 'relative',
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
  card: {
    alignSelf: 'center',
  },
  cardInner: {
    flex: 1,
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: metrics.spacing.md,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.sm,
    gap: metrics.spacing.lg,
  },
  actionButton: {
    width: 52,
    height: 52,
    borderRadius: metrics.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...metrics.shadows.md,
  },
  passButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  superlikeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FAB938',
  },
  likeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF4458',
  },
  boostButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#9B59B6',
  },
  cardStackStyle: {
    position: 'absolute' as const,
    zIndex: -1,
    opacity: 0.55,
  },
  stamp: {
    position: 'absolute',
    zIndex: 10,
    borderWidth: 3,
    borderRadius: metrics.radius.sm,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: 4,
  },
  likeStamp: {
    top: 32,
    left: 20,
    transform: [{ rotate: '-18deg' }],
    borderColor: '#4CCC93',
  },
  nopeStamp: {
    top: 32,
    right: 20,
    transform: [{ rotate: '18deg' }],
    borderColor: '#FF4458',
  },
  superlikeStamp: {
    top: 36,
    alignSelf: 'center',
    left: '22%',
    right: '22%',
    borderColor: '#0099FF',
  },
  stampText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  likeStampText: {
    color: '#4CCC93',
  },
  nopeStampText: {
    color: '#FF4458',
  },
  superlikeStampText: {
    color: '#0099FF',
    fontSize: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardFill: {
    width: '100%',
    height: '100%',
  },
});

type SwipeAction = 'like' | 'pass' | 'superlike';

export const HomeScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const { setProfiles } = useMatchStore();
  const { hasActiveFilters, resetFilters } = useFilterStore();
  const { width, height } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles] = useState(MOCK_PROFILES);
  const [filterOpen, setFilterOpen] = useState(false);
  // Fresh Animated.ValueXY per card to avoid swipe blink
  const pan = React.useMemo(
    () => new Animated.ValueXY(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex],
  );
  const isAnimating = useRef(false);

  const filtersActive = hasActiveFilters();

  const cardWidth = width - metrics.spacing.lg * 2;
  const maxCardHeight = height * 0.52;
  const cardHeight = Math.min(cardWidth * CARD_ASPECT, maxCardHeight);
  const cardSize = { width: cardWidth, height: cardHeight };

  React.useEffect(() => {
    setProfiles(profiles);
  }, [profiles, setProfiles]);

  const completeSwipe = useCallback(
    (action: SwipeAction) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const targets: Record<SwipeAction, { x: number; y: number }> = {
        like: { x: width * 1.5, y: 0 },
        pass: { x: -width * 1.5, y: 0 },
        superlike: { x: 0, y: -height * 0.8 },
      };

      Animated.timing(pan, {
        toValue: targets[action],
        duration: 280,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (!finished) {
          isAnimating.current = false;
          return;
        }
        setCurrentIndex(prev => prev + 1);
        isAnimating.current = false;
      });
    },
    [width, height, pan]
  );

  const handlePass = useCallback(() => completeSwipe('pass'), [completeSwipe]);
  const handleLike = useCallback(() => completeSwipe('like'), [completeSwipe]);
  const handleSuperLike = useCallback(
    () => completeSwipe('superlike'),
    [completeSwipe]
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isAnimating.current,
        onMoveShouldSetPanResponder: () => !isAnimating.current,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, { dx, dy, vx, vy }) => {
          if (dy < -SWIPE_THRESHOLD || vy < -0.5) {
            handleSuperLike();
          } else if (dx > SWIPE_THRESHOLD || vx > 0.5) {
            handleLike();
          } else if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
            handlePass();
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [pan, handlePass, handleLike, handleSuperLike]
  );

  const handleFilterPress = () => {
    if (filtersActive) {
      resetFilters();
    } else {
      setFilterOpen(true);
    }
  };

  const handleFilterLongPress = () => {
    setFilterOpen(true);
  };

  const currentProfile = profiles[currentIndex];

  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [`-${ROTATION_RANGE}deg`, '0deg', `${ROTATION_RANGE}deg`],
    extrapolate: 'clamp',
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superlikeOpacity = pan.y.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderFilterIcon = () => (
    <TouchableOpacity
      style={styles.filterButton}
      onPress={handleFilterPress}
      onLongPress={handleFilterLongPress}
      delayLongPress={280}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <MaterialCommunityIcons
        name={filtersActive ? 'filter-remove-outline' : 'tune-variant'}
        size={26}
        color={filtersActive ? theme.colors.primary : theme.custom.textSecondary}
      />
      {filtersActive && (
        <View
          style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}
        />
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <BaseText
        variant="h2"
        color={theme.colors.primary}
        style={styles.logo}
        children="Zingle"
      />
      <View style={styles.headerActions}>{renderFilterIcon()}</View>
    </View>
  );

  if (!currentProfile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="heart-off-outline"
            size={64}
            color={theme.custom.textTertiary}
          />
          <BaseText
            variant="h2"
            color={theme.custom.text}
            style={styles.emptyText}
            children="No more profiles"
          />
          <BaseText
            variant="body"
            color={theme.custom.textSecondary}
            children="Come back later for more matches"
          />
        </View>
        <FilterBottomSheet
          visible={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
      </SafeAreaView>
    );
  }

  const hasMore = currentIndex < profiles.length - 1;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {renderHeader()}

      <View style={styles.cardContainer}>
        {hasMore && (
          <View
            style={[
              styles.card,
              styles.cardStackStyle,
              cardSize,
              { transform: [{ scale: 0.96 }, { translateY: 8 }] },
            ]}
          >
            <AnimatedSwipeCard
              image={profiles[currentIndex + 1]?.photos[0]}
              name={profiles[currentIndex + 1]?.name}
              age={profiles[currentIndex + 1]?.age}
              distance={5}
              profession={profiles[currentIndex + 1]?.profession}
              bio={profiles[currentIndex + 1]?.bio}
              interests={profiles[currentIndex + 1]?.interests}
              style={styles.cardFill}
            />
          </View>
        )}

        <Animated.View
          key={currentProfile.id}
          style={[
            styles.card,
            cardSize,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.cardInner}>
            <AnimatedSwipeCard
              image={currentProfile.photos[0]}
              name={currentProfile.name}
              age={currentProfile.age}
              distance={5}
              profession={currentProfile.profession}
              bio={currentProfile.bio}
              interests={currentProfile.interests}
              style={styles.cardFill}
            />

            <Animated.View
              style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}
              pointerEvents="none"
            >
              <Text style={[styles.stampText, styles.likeStampText]}>LIKE</Text>
            </Animated.View>

            <Animated.View
              style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}
              pointerEvents="none"
            >
              <Text style={[styles.stampText, styles.nopeStampText]}>NOPE</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.stamp,
                styles.superlikeStamp,
                { opacity: superlikeOpacity },
              ]}
              pointerEvents="none"
            >
              <Text style={[styles.stampText, styles.superlikeStampText]}>
                SUPER LIKE
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handlePass}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="close" size={26} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superlikeButton]}
          onPress={handleSuperLike}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="star" size={24} color="#FAB938" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="heart" size={26} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.boostButton]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="flash" size={24} color="#9B59B6" />
        </TouchableOpacity>
      </View>

      <FilterBottomSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </SafeAreaView>
  );
};
