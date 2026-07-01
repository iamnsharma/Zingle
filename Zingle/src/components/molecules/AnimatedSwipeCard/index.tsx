import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  Image,
  ImageStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface AnimatedSwipeCardProps extends ViewProps {
  image: string;
  name: string;
  age: number;
  distance: number;
  profession?: string;
  bio?: string;
  interests?: string[];
  loading?: boolean;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    ...metrics.shadows.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: metrics.spacing.lg,
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

export const AnimatedSwipeCard = React.forwardRef<View, AnimatedSwipeCardProps>(
  (
    {
      image,
      name,
      age,
      distance,
      profession,
      bio,
      interests = [],
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();

    const imageStyle: ImageStyle = {
      width: '100%',
      height: '100%',
    };

    return (
      <View
        ref={ref}
        style={[styles.container, customStyle]}
        {...props}
      >
        <Image
          source={{ uri: image }}
          style={imageStyle}
        />
        <LinearGradient
          colors={theme.custom.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.nameAge}>
                <BaseText
                  variant="h2"
                  color="#FFFFFF"
                  children={`${name}, ${age}`}
                />
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
                    <BaseText
                      variant="caption"
                      color="#FFFFFF"
                      children={interest}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }
);

AnimatedSwipeCard.displayName = 'AnimatedSwipeCard';
