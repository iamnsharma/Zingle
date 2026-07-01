import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  Animated,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface ChatBubbleProps extends ViewProps {
  message: string;
  timestamp?: string;
  isOwn?: boolean;
  isRead?: boolean;
  variant?: 'text' | 'image' | 'voice';
}

const styles = StyleSheet.create({
  container: {
    marginVertical: metrics.spacing.xs,
    marginHorizontal: metrics.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: metrics.radius.lg,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
  },
  ownBubble: {
    borderBottomRightRadius: metrics.radius.sm,
  },
  otherBubble: {
    borderBottomLeftRadius: metrics.radius.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: metrics.spacing.xs,
  },
  timestamp: {
    fontSize: 12,
    marginHorizontal: metrics.spacing.sm,
  },
  readReceipt: {
    marginLeft: metrics.spacing.xs,
  },
});

export const ChatBubble = React.forwardRef<View, ChatBubbleProps>(
  (
    {
      message,
      timestamp,
      isOwn = false,
      isRead = false,
      variant: _variant = 'text',
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View
        ref={ref}
        style={[
          styles.container,
          isOwn && styles.ownContainer,
          { opacity: fadeAnim },
          customStyle,
        ]}
        {...props}
      >
        <View
          style={[
            styles.bubble,
            isOwn ? styles.ownBubble : styles.otherBubble,
            {
              backgroundColor: isOwn
                ? theme.colors.primary
                : theme.custom.surfaceVariant,
            },
          ]}
        >
          <BaseText
            variant="body"
            color={isOwn ? '#FFFFFF' : theme.custom.text}
            children={message}
          />
        </View>

        {(timestamp || isRead) && (
          <View style={styles.footer}>
            {timestamp && (
              <BaseText
                variant="caption"
                color={theme.custom.textTertiary}
                style={styles.timestamp}
                children={timestamp}
              />
            )}
            {isOwn && isRead && (
              <BaseText
                variant="caption"
                color={theme.colors.primary}
                style={styles.readReceipt}
                children="✓✓"
              />
            )}
          </View>
        )}
      </Animated.View>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';
