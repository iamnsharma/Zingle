import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { hexToRgba } from '@utils/colorUtils';

interface AnimatedSwipeCardProps {
  image?: string;
  photos?: string[];
  name: string;
  age: number;
  distance: number;
  profession?: string;
  bio?: string;
  interests?: string[];
  blendToHeader?: boolean;
  style?: object;
}

const TOP_BLEND_HEIGHT = 220;

const styles = StyleSheet.create({
  container: {
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    ...metrics.shadows.lg,
  },
  containerEdgeToHeader: {
    borderTopLeftRadius: metrics.radius.md,
    borderTopRightRadius: metrics.radius.md,
    borderBottomLeftRadius: metrics.radius.xl,
    borderBottomRightRadius: metrics.radius.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBlend: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_BLEND_HEIGHT,
    zIndex: 2,
  },
  photoIndicators: {
    position: 'absolute',
    top: metrics.spacing.sm,
    left: metrics.spacing.md,
    right: metrics.spacing.md,
    flexDirection: 'row',
    gap: 4,
    zIndex: 6,
  },
  indicatorTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  indicatorFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 4,
  },
  tapHalf: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: metrics.spacing.lg,
    zIndex: 3,
  },
  content: {
    marginBottom: metrics.spacing.md,
  },
  header: {
    marginBottom: metrics.spacing.md,
  },
  nameAge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: metrics.spacing.xs,
  },
  distance: {
    marginTop: metrics.spacing.xs,
  },
  profession: {
    marginTop: metrics.spacing.xs,
  },
  bio: {
    marginTop: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
  },
  interestTag: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

interface PhotoCarouselProps {
  photos: string[];
  photosKey: string;
}

/** Isolated hook state for gallery — keeps parent hook order stable */
const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, photosKey }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setPhotoIndex(0);
    fadeAnim.setValue(1);
  }, [photosKey, fadeAnim]);

  const goToPhoto = useCallback(
    (nextIndex: number) => {
      if (photos.length <= 1 || nextIndex === photoIndex) return;
      if (nextIndex < 0 || nextIndex >= photos.length) return;

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        setPhotoIndex(nextIndex);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeAnim, photoIndex, photos.length],
  );

  const currentPhoto = photos[photoIndex] ?? photos[0];

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        {currentPhoto ? (
          <Image source={{ uri: currentPhoto }} style={styles.image} resizeMode="cover" />
        ) : null}
      </Animated.View>

      {photos.length > 1 && (
        <View style={styles.photoIndicators} pointerEvents="none">
          {photos.map((uri, index) => {
            const isPast = index < photoIndex;
            const isActive = index === photoIndex;
            return (
              <View key={`${index}-${uri}`} style={styles.indicatorTrack}>
                <View
                  style={[
                    styles.indicatorFill,
                    {
                      width: isPast || isActive ? '100%' : '0%',
                      opacity: isActive ? 1 : isPast ? 0.75 : 0,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      )}

      {photos.length > 1 && (
        <View style={styles.tapZones} pointerEvents="box-none">
          <Pressable style={styles.tapHalf} onPress={() => goToPhoto(photoIndex - 1)} />
          <Pressable style={styles.tapHalf} onPress={() => goToPhoto(photoIndex + 1)} />
        </View>
      )}
    </>
  );
};

export const AnimatedSwipeCard: React.FC<AnimatedSwipeCardProps> = ({
  image,
  photos: photosProp,
  name,
  age,
  distance,
  profession,
  bio,
  interests = [],
  blendToHeader = false,
  style: customStyle,
}) => {
  const { theme } = useThemeStore();
  const photos = photosProp?.length ? photosProp : image ? [image] : [];
  const photosKey = photos.join('|');

  const headerColor = theme.colors.background;
  const topBlendColors = blendToHeader
    ? [
        hexToRgba(headerColor, 0.28),
        hexToRgba(headerColor, 0.14),
        hexToRgba(headerColor, 0.06),
        hexToRgba(headerColor, 0.015),
        'transparent',
      ]
    : [];

  return (
    <View
      style={[
        styles.container,
        blendToHeader && styles.containerEdgeToHeader,
        customStyle,
      ]}
    >
      <PhotoCarousel photos={photos} photosKey={photosKey} />

      {blendToHeader && topBlendColors.length > 0 && (
        <LinearGradient
          colors={topBlendColors}
          locations={[0, 0.15, 0.38, 0.68, 1]}
          style={styles.topBlend}
          pointerEvents="none"
        />
      )}

      <LinearGradient
        colors={theme.custom.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.overlay}
        pointerEvents="none"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.nameAge}>
              <BaseText variant="h2" color="#FFFFFF" children={`${name}, ${age}`} />
            </View>
            <BaseText
              variant="body"
              color="rgba(255, 255, 255, 0.8)"
              style={styles.distance}
              children={`${distance} km away`}
            />
            {profession && (
              <BaseText
                variant="body"
                color="rgba(255, 255, 255, 0.8)"
                style={styles.profession}
                children={profession}
              />
            )}
          </View>
          {bio && (
            <BaseText
              variant="body"
              color="rgba(255, 255, 255, 0.9)"
              style={styles.bio}
              children={bio}
              numberOfLines={2}
            />
          )}
          {interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <BaseText variant="caption" color="#FFFFFF" children={interest} />
                </View>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

AnimatedSwipeCard.displayName = 'AnimatedSwipeCard';
