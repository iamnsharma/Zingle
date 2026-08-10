import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { ChatStackNavigationProp, ChatStackParamList } from '@types';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, ProfileAvatar, SafeAreaContainer } from '@components/atoms';
import { ChatBubble, AttachmentSheet } from '@components/molecules';
import {
  getConversationById,
  getOtherUserId,
  getProfileById,
  getMessagesForConversation,
  formatMessageTime,
} from '@services/mock/data';
import type { Message } from '@types';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: metrics.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: metrics.spacing.sm,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 1,
  },
  messagesList: {
    paddingVertical: metrics.spacing.md,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: metrics.spacing.md,
  },
  datePill: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
  },
  datePillText: {
    fontSize: 12,
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: metrics.spacing.xl,
    paddingVertical: metrics.spacing['3xl'],
    gap: metrics.spacing.sm,
  },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: metrics.spacing.md,
    paddingTop: metrics.spacing.sm,
    gap: metrics.spacing.sm,
  },
  attachBtn: {
    width: 40,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrap: {
    flex: 1,
    borderRadius: metrics.radius.xl,
    paddingHorizontal: metrics.spacing.md,
    justifyContent: 'center',
    minHeight: 44,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    lineHeight: 21,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const ChatThreadScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<ChatStackNavigationProp>();
  const route = useRoute<RouteProp<ChatStackParamList, 'ChatThread'>>();
  const { conversationId } = route.params;
  const listRef = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();
  // iOS: manually lift the composer above the keyboard (KeyboardAvoidingView is
  // unreliable inside nested tab + native-stack navigators). Android relies on
  // the native `adjustResize` window mode instead.
  const kbOffset = useRef(new Animated.Value(0)).current;

  const [draft, setDraft] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [attachOpen, setAttachOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>(() =>
    getMessagesForConversation(conversationId),
  );

  const conversation = getConversationById(conversationId);
  const otherUserId = conversation ? getOtherUserId(conversation) : '';
  const profile = getProfileById(otherUserId);

  const composerBottomPad =
    keyboardHeight > 0
      ? metrics.spacing.xs
      : insets.bottom + metrics.spacing.sm;

  useEffect(() => {
    setLocalMessages(getMessagesForConversation(conversationId));
    setDraft('');
    setShowTyping(false);
  }, [conversationId]);

  useEffect(() => {
    const isIOS = Platform.OS === 'ios';
    const showEvent = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      if (isIOS) {
        Animated.timing(kbOffset, {
          toValue: e.endCoordinates.height,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      }
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    };
    const onHide = (e: KeyboardEvent) => {
      setKeyboardHeight(0);
      if (isIOS) {
        Animated.timing(kbOffset, {
          toValue: 0,
          duration: e?.duration || 200,
          useNativeDriver: false,
        }).start();
      }
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [kbOffset]);

  useEffect(() => {
    if (localMessages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [localMessages.length]);

  useEffect(() => {
    if (!profile?.online) return undefined;
    const timer = setTimeout(() => setShowTyping(true), 1500);
    const hide = setTimeout(() => setShowTyping(false), 4500);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, [conversationId, profile?.online]);

  const appendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length === 0) return;
      const newMsg: Message = {
        id: `local-${Date.now()}`,
        conversationId,
        senderId: 'me',
        text: trimmed,
        createdAt: new Date().toISOString(),
        readAt: new Date().toISOString(),
      };
      setLocalMessages(prev => [...prev, newMsg]);
      setDraft('');
      setShowTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    },
    [conversationId],
  );

  const handleSend = useCallback(() => {
    appendMessage(draft);
  }, [appendMessage, draft]);

  const openAttachments = useCallback(() => {
    Keyboard.dismiss();
    setAttachOpen(true);
  }, []);

  if (!conversation || !profile) {
    return (
      <SafeAreaContainer>
        <BaseText variant="body" children="Conversation not found" />
      </SafeAreaContainer>
    );
  }

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.senderId === 'me';
    const showDate =
      index === 0 ||
      new Date(item.createdAt).toDateString() !==
        new Date(localMessages[index - 1].createdAt).toDateString();

    return (
      <View>
        {showDate ? (
          <View style={styles.dateDivider}>
            <View style={[styles.datePill, { backgroundColor: theme.custom.surfaceVariant }]}>
              <BaseText
                color={theme.custom.textSecondary}
                style={styles.datePillText}
                children={new Date(item.createdAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              />
            </View>
          </View>
        ) : null}
        <ChatBubble
          message={item.text ?? ''}
          timestamp={formatMessageTime(item.createdAt)}
          isOwn={isOwn}
          isRead={Boolean(item.readAt)}
        />
      </View>
    );
  };

  const statusText = showTyping
    ? 'typing…'
    : profile.online
      ? 'online'
      : 'offline';
  const statusColor = showTyping
    ? theme.colors.primary
    : profile.online
      ? theme.custom.success
      : theme.custom.textTertiary;

  const canSend = draft.trim().length > 0;

  return (
    <SafeAreaContainer style={styles.root}>
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.custom.border, backgroundColor: theme.colors.surface },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.custom.text} />
        </TouchableOpacity>
        <ProfileAvatar
          uri={profile.photos[0]}
          initials={profile.name.charAt(0)}
          size="sm"
          online={profile.online}
        />
        <View style={styles.headerInfo}>
          <BaseText
            color={theme.custom.text}
            style={styles.headerName}
            numberOfLines={1}
            children={profile.name}
          />
          <BaseText
            color={statusColor}
            style={styles.headerStatus}
            children={statusText}
          />
        </View>
      </View>

      <Animated.View style={[styles.body, { paddingBottom: kbOffset }]}>
        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={localMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messagesList,
            localMessages.length === 0 && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => {
            if (keyboardHeight > 0) {
              listRef.current?.scrollToEnd({ animated: true });
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <MaterialCommunityIcons
                name="chat-outline"
                size={48}
                color={theme.custom.textTertiary}
              />
              <BaseText
                color={theme.custom.text}
                style={{ fontSize: 16, fontWeight: '700' }}
                children={`Say hi to ${profile.name}`}
              />
            </View>
          }
        />

        <View
          style={[
            styles.composer,
            {
              borderTopColor: theme.custom.border,
              backgroundColor: theme.colors.surface,
              paddingBottom: composerBottomPad,
            },
          ]}
        >
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn} onPress={openAttachments}>
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={26}
                color={theme.custom.textSecondary}
              />
            </TouchableOpacity>
            <View
              style={[
                styles.inputWrap,
                { backgroundColor: theme.custom.surfaceVariant },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.custom.text }]}
                placeholder="Message"
                placeholderTextColor={theme.custom.textTertiary}
                multiline
                value={draft}
                onChangeText={setDraft}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor: canSend
                    ? theme.colors.primary
                    : theme.custom.surfaceVariant,
                },
              ]}
              onPress={handleSend}
              disabled={!canSend}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="send"
                size={20}
                color={canSend ? '#FFFFFF' : theme.custom.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <AttachmentSheet
        visible={attachOpen}
        onClose={() => setAttachOpen(false)}
      />
    </SafeAreaContainer>
  );
};
