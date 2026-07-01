import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, ProfileAvatar, SafeAreaContainer } from '@components/atoms';
import { MOCK_CONVERSATIONS } from '@services/mock/data';

interface ChatListScreenProps {
  onConversationPress?: (conversationId: string) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
  },
  title: {
    marginBottom: metrics.spacing.xs,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    borderBottomWidth: 1,
    gap: metrics.spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.xs,
  },
  conversationName: {
    flex: 1,
  },
  lastMessage: {
    marginBottom: metrics.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: 'themed',
    borderRadius: metrics.radius.full,
    width: 24,
    height: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  onConversationPress,
}) => {
  const { theme } = useThemeStore();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { borderBottomColor: theme.custom.border },
      ]}
      onPress={() => onConversationPress?.(item.id)}
    >
      <ProfileAvatar
        initials={item.userId2.charAt(0).toUpperCase()}
        size="md"
        online={Math.random() > 0.5}
      />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <BaseText
            variant="body"
            color={theme.custom.text}
            style={styles.conversationName}
            children={`User ${item.userId2}`}
          />
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children="Now"
          />
        </View>
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.lastMessage}
          numberOfLines={1}
          children="Last message preview..."
        />
      </View>
      {item.unreadCount > 0 && (
        <View
          style={[
            styles.unreadBadge,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <BaseText
            variant="caption"
            color="#FFFFFF"
            children={item.unreadCount.toString()}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  if (MOCK_CONVERSATIONS.length === 0) {
    return (
      <SafeAreaContainer>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="message-text-outline"
            size={64}
            color={theme.custom.textTertiary}
          />
          <BaseText
            variant="h2"
            color={theme.custom.text}
            children="No conversations yet"
          />
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <View style={styles.header}>
        <BaseText
          variant="h1"
          color={theme.custom.text}
          style={styles.title}
          children="Messages"
        />
      </View>
      <FlatList
        data={MOCK_CONVERSATIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
      />
    </SafeAreaContainer>
  );
};
