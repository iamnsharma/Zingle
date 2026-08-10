import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { ExploreStackNavigationProp, ExploreStackParamList } from '@types';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, SafeAreaContainer } from '@components/atoms';
import {
  getExploreCategoryById,
  getExploreMemberCount,
} from '@constants/explore';
import { getExploreProfilesForCategory } from '@services/mock/data';
import type { UserProfile } from '@types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = metrics.spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - metrics.spacing.lg * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    gap: metrics.spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
  },
  list: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 0.72,
    borderRadius: metrics.radius.lg,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: metrics.radius.lg,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: metrics.spacing.md,
  },
  onlineDot: {
    position: 'absolute',
    top: metrics.spacing.sm,
    right: metrics.spacing.sm,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: metrics.spacing.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.xl,
    gap: metrics.spacing.md,
  },
});

interface ProfileCardProps {
  profile: UserProfile;
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onPress }) => {
  const { theme } = useThemeStore();
  const photo = profile.photos[0];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: photo }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          {profile.online ? (
            <View style={[styles.onlineDot, { backgroundColor: theme.custom.success }]} />
          ) : null}
          <BaseText
            variant="body"
            color="#FFFFFF"
            style={{ fontWeight: '700' }}
            numberOfLines={1}
            children={`${profile.name}, ${profile.age}`}
          />
          {profile.profession ? (
            <BaseText
              variant="caption"
              color="rgba(255,255,255,0.85)"
              numberOfLines={1}
              children={profile.profession}
            />
          ) : null}
          <View style={styles.swipeHint}>
            <MaterialCommunityIcons name="gesture-swipe" size={12} color="rgba(255,255,255,0.7)" />
            <BaseText
              variant="caption"
              color="rgba(255,255,255,0.7)"
              children="Tap to view"
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export const ExploreCategoryScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<ExploreStackNavigationProp>();
  const route = useRoute<RouteProp<ExploreStackParamList, 'ExploreCategory'>>();
  const { categoryId } = route.params;

  const category = getExploreCategoryById(categoryId);
  const profiles = useMemo(
    () => getExploreProfilesForCategory(categoryId),
    [categoryId],
  );
  const count = category ? getExploreMemberCount(category) : 0;

  const rowIndices = useMemo(
    () => profiles.map((_, i) => i).filter(i => i % 2 === 0),
    [profiles],
  );

  const openProfile = useCallback(
    (userId: string) => {
      navigation.navigate('ExploreProfile', { userId, categoryId });
    },
    [navigation, categoryId],
  );

  if (!category) {
    return (
      <SafeAreaContainer>
        <BaseText variant="body" children="Category not found" />
      </SafeAreaContainer>
    );
  }

  const renderRow = ({ item: startIndex }: { item: number }) => {
    const left = profiles[startIndex];
    const right = profiles[startIndex + 1];
    return (
      <View style={styles.row}>
        <ProfileCard profile={left} onPress={() => openProfile(left.id)} />
        {right ? (
          <ProfileCard profile={right} onPress={() => openProfile(right.id)} />
        ) : (
          <View style={styles.card} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaContainer style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.custom.surfaceVariant }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.custom.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <BaseText variant="h2" color={theme.custom.text} children={category.title} />
          <BaseText
            variant="caption"
            color={theme.custom.textSecondary}
            children={category.subtitle}
          />
        </View>
        <View style={[styles.countPill, { backgroundColor: theme.colors.primary + '18' }]}>
          <MaterialCommunityIcons name="account-group" size={14} color={theme.colors.primary} />
          <BaseText
            variant="caption"
            color={theme.colors.primary}
            style={{ fontWeight: '700' }}
            children={String(count)}
          />
        </View>
      </View>

      {profiles.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="account-off-outline"
            size={48}
            color={theme.custom.textTertiary}
          />
          <BaseText variant="body" color={theme.custom.text} children="No profiles yet" />
        </View>
      ) : (
        <FlatList
          data={rowIndices}
          renderItem={renderRow}
          keyExtractor={item => `explore-profile-row-${item}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaContainer>
  );
};
