import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { ChatStackNavigationProp } from '@types';
import { useThemeStore, useSafetyStore, useChatStore } from '@stores';
import { metrics } from '@styling/metrics';
import { Fonts } from '@styling/globalStyles/typography';
import { BaseText, ProfileAvatar, SafeAreaContainer } from '@components/atoms';
import { EmptyState } from '@components/molecules';
import {
  getOtherUserId,
  getProfileById,
  formatMessageTime,
} from '@services/mock/data';
import type { Conversation } from '@types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.sm,
  },
  title: {
    fontSize: 30,
    marginBottom: metrics.spacing.md,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.full,
    gap: metrics.spacing.sm,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    fontFamily: Fonts.regular,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: metrics.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  content: {
    flex: 1,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    marginLeft: metrics.spacing.sm,
  },
  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
  },
  preview: {
    flex: 1,
    fontSize: 14,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: metrics.spacing.lg + 56 + metrics.spacing.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.xl,
    paddingTop: metrics.spacing['4xl'],
  },
});

export const ChatListScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<ChatStackNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const openConversation = useCallback(
    (conversationId: string) => {
      Keyboard.dismiss();
      navigation.navigate('ChatThread', { conversationId });
    },
    [navigation],
  );

  const conversations = useChatStore(state => state.conversations);
  const blockedIds = useSafetyStore(state => state.blockedIds);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = conversations.filter(conv => {
      const otherId = getOtherUserId(conv);
      if (blockedIds.includes(otherId)) return false;
      if (q.length === 0) return true;
      const profile = getProfileById(otherId);
      const name = profile?.name ?? '';
      const preview = conv.lastMessage?.text ?? '';
      return (
        name.toLowerCase().includes(q) || preview.toLowerCase().includes(q)
      );
    });

    return list.sort(
      (a, b) =>
        new Date(b.lastMessageAt ?? b.createdAt).getTime() -
        new Date(a.lastMessageAt ?? a.createdAt).getTime(),
    );
  }, [searchQuery, conversations, blockedIds]);

  const renderRow = useCallback(
    ({ item }: { item: Conversation }) => {
      const otherUserId = getOtherUserId(item);
      const profile = getProfileById(otherUserId);
      const name = profile?.name ?? `User ${otherUserId}`;
      const preview = item.lastMessage?.text ?? 'Start the conversation';
      const time = formatMessageTime(item.lastMessageAt);
      const hasUnread = item.unreadCount > 0;
      const isFromMe = item.lastMessage?.senderId === 'me';

      return (
        <>
          <TouchableOpacity
            style={styles.row}
            onPress={() => openConversation(item.id)}
            activeOpacity={0.7}
          >
            <ProfileAvatar
              uri={profile?.photos[0]}
              initials={name.charAt(0)}
              size="md"
              online={profile?.online}
            />
            <View style={styles.content}>
              <View style={styles.topLine}>
                <BaseText
                  color={theme.custom.text}
                  numberOfLines={1}
                  style={[styles.name, { fontWeight: hasUnread ? '700' : '600' }]}
                  children={name}
                />
                <BaseText
                  color={hasUnread ? theme.colors.primary : theme.custom.textTertiary}
                  style={styles.time}
                  children={time}
                />
              </View>
              <View style={styles.bottomLine}>
                {isFromMe ? (
                  <MaterialCommunityIcons
                    name={item.lastMessage?.readAt ? 'check-all' : 'check'}
                    size={15}
                    color={
                      item.lastMessage?.readAt
                        ? theme.colors.primary
                        : theme.custom.textTertiary
                    }
                  />
                ) : null}
                <BaseText
                  color={hasUnread ? theme.custom.text : theme.custom.textSecondary}
                  numberOfLines={1}
                  style={[styles.preview, { fontWeight: hasUnread ? '600' : '400' }]}
                  children={preview}
                />
                {hasUnread ? (
                  <View
                    style={[styles.badge, { backgroundColor: theme.colors.primary }]}
                  >
                    <BaseText
                      color="#FFFFFF"
                      style={styles.badgeText}
                      children={item.unreadCount > 99 ? '99+' : String(item.unreadCount)}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.rowDivider, { backgroundColor: theme.custom.border }]} />
        </>
      );
    },
    [openConversation, theme],
  );

  return (
    <SafeAreaContainer style={styles.container}>
      <View style={styles.header}>
        <BaseText
          variant="display"
          color={theme.custom.text}
          style={styles.title}
          children="Messages"
        />
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: theme.custom.surfaceVariant },
          ]}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.custom.textTertiary}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.custom.text }]}
            placeholder="Search"
            placeholderTextColor={theme.custom.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={theme.custom.textTertiary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={filtered}
        renderItem={renderRow}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <EmptyState
            icon={
              searchQuery.length > 0
                ? 'account-search-outline'
                : 'message-text-outline'
            }
            title={
              searchQuery.length > 0 ? 'No results found' : 'No conversations yet'
            }
            subtitle={
              searchQuery.length > 0
                ? 'Try a different name or message'
                : 'Match with someone and start chatting'
            }
          />
        }
      />
    </SafeAreaContainer>
  );
};
