import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafetyStore, useThemeStore } from '@stores';
import type { MainAppNavigationProp } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, ProfileAvatar, SafeAreaContainer } from '@components/atoms';
import { EmptyState, ScreenHeader } from '@components/molecules';
import { getProfileById } from '@services/mock/data';

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  name: {
    flex: 1,
    fontWeight: '600',
  },
  unblock: {
    fontWeight: '700',
  },
});

export const BlockedAccountsScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<MainAppNavigationProp>();
  const blockedIds = useSafetyStore(state => state.blockedIds);
  const unblockUser = useSafetyStore(state => state.unblockUser);

  const people = blockedIds
    .map(id => getProfileById(id))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile));

  return (
    <SafeAreaContainer>
      <ScreenHeader title="Blocked accounts" onBack={() => navigation.goBack()} />
      {people.length === 0 ? (
        <EmptyState
          icon="account-cancel-outline"
          title="No blocked accounts"
          subtitle="People you block will show up here. You can unblock them anytime."
        />
      ) : (
        <FlatList
          data={people}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ProfileAvatar
                uri={item.photos[0]}
                initials={item.name.charAt(0)}
                size="sm"
              />
              <BaseText
                variant="body"
                color={theme.custom.text}
                style={styles.name}
                children={item.name}
              />
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(`Unblock ${item.name}?`, undefined, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Unblock', onPress: () => unblockUser(item.id) },
                  ])
                }
              >
                <BaseText
                  variant="bodyMedium"
                  color={theme.colors.primary}
                  style={styles.unblock}
                  children="Unblock"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaContainer>
  );
};
