import React from 'react';
import { StyleSheet, View, ViewProps, Image, ImageStyle } from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '../BaseText';

interface ProfileAvatarProps extends ViewProps {
  uri?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  verified?: boolean;
  onPress?: () => void;
}

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 80,
  xl: 120,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: metrics.radius.full,
  },
  initials: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.full,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderRadius: metrics.radius.full,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.full,
  },
});

export const ProfileAvatar = React.forwardRef<View, ProfileAvatarProps>(
  (
    {
      uri,
      initials = 'U',
      size = 'md',
      online = false,
      verified = false,
      style: customStyle,
      onPress: _onPress,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const sizePixels = sizeMap[size];
    const indicatorSize = sizePixels * 0.25;
    const badgeSize = sizePixels * 0.3;

    const containerStyle: ViewProps['style'] = {
      width: sizePixels,
      height: sizePixels,
    };

    const imageStyle: ImageStyle = {
      width: sizePixels,
      height: sizePixels,
    };

    return (
      <View
        ref={ref}
        style={[styles.container, containerStyle, customStyle]}
        {...props}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, imageStyle]}
          />
        ) : (
          <View
            style={[
              styles.initials,
              containerStyle,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
          >
            <BaseText
              variant="h3"
              color="#FFFFFF"
              children={initials}
            />
          </View>
        )}

        {online && (
          <View
            style={[
              styles.onlineIndicator,
              {
                width: indicatorSize,
                height: indicatorSize,
                backgroundColor: theme.custom.success,
                borderColor: theme.colors.surface,
              },
            ]}
          />
        )}

        {verified && (
          <View
            style={[
              styles.verifiedBadge,
              {
                width: badgeSize,
                height: badgeSize,
                backgroundColor: theme.colors.tertiary,
              },
            ]}
          >
            <BaseText
              variant="h3"
              color="#FFFFFF"
              children="✓"
            />
          </View>
        )}
      </View>
    );
  }
);

ProfileAvatar.displayName = 'ProfileAvatar';
