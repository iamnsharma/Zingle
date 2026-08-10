import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
  ImageStyle,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface MatchAvatarProps extends Omit<TouchableOpacityProps, 'children'> {
  uri?: string;
  name: string;
  onPress?: () => void;
  size?: 'sm' | 'md';
  unreadCount?: number;
}

const sizeMap = {
  sm: 50,
  md: 70,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: metrics.spacing.md,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.full,
    marginBottom: metrics.spacing.sm,
    position: 'relative',
    ...metrics.shadows.md,
  },
  image: {
    borderRadius: metrics.radius.full,
  },
  initials: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.full,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: metrics.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  name: {
    maxWidth: 70,
  },
});

export const MatchAvatar = React.forwardRef<View, MatchAvatarProps>(
  (
    {
      uri,
      name,
      onPress,
      size = 'md',
      unreadCount,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const sizePixels = sizeMap[size];
    const badgeCount = unreadCount ?? 0;

    const imageStyle: ImageStyle = {
      width: sizePixels,
      height: sizePixels,
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.container, customStyle]}
        {...props}
      >
        <View
          style={[
            styles.avatarContainer,
            {
              width: sizePixels,
              height: sizePixels,
            },
          ]}
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
                imageStyle,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <BaseText
                variant="h3"
                color="#FFFFFF"
                children={name.charAt(0).toUpperCase()}
              />
            </View>
          )}

          {badgeCount > 0 ? (
            <View
              style={[
                styles.unreadBadge,
                {
                  backgroundColor: theme.custom.error,
                  borderColor: theme.colors.surface,
                },
              ]}
            >
              <BaseText
                variant="caption"
                color="#FFFFFF"
                children={badgeCount > 99 ? '99+' : String(badgeCount)}
              />
            </View>
          ) : null}
        </View>

        <BaseText
          variant="caption"
          color={theme.custom.text}
          style={styles.name}
          numberOfLines={1}
          children={name}
        />
      </TouchableOpacity>
    );
  }
);

MatchAvatar.displayName = 'MatchAvatar';
