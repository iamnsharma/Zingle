import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { LikesStackNavigationProp } from '@types';
import { useThemeStore, useMatchStore, useSafetyStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, SafeAreaContainer } from '@components/atoms';
import { EmptyState } from '@components/molecules';
import type { UserLike } from '@types';

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
  subtitle: {
    marginBottom: metrics.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
    marginBottom: metrics.spacing.lg,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
  },
  gridContainer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.lg,
    gap: metrics.spacing.md,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 0.85,
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
  superlikeBadge: {
    position: 'absolute',
    top: metrics.spacing.sm,
    right: metrics.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(250, 185, 56, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    marginBottom: 2,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: metrics.spacing.md,
  },
});

interface LikeCardProps {
  like: UserLike;
  onPress: () => void;
}

const LikeCard: React.FC<LikeCardProps> = ({ like, onPress }) => {
  const photo = like.user.photos[0];

  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: photo }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.overlay}
        >
          {like.type === 'superlike' && (
            <View style={styles.superlikeBadge}>
              <MaterialCommunityIcons name="star-four-points" size={18} color="#FFF" />
            </View>
          )}
          <BaseText
            variant="body"
            color="#FFFFFF"
            style={styles.itemName}
            children={like.user.name}
          />
          <BaseText
            variant="caption"
            color="rgba(255,255,255,0.85)"
            children={`${like.user.age} · ${like.user.profession}`}
          />
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export const LikesScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<LikesStackNavigationProp>();
  const likes = useMatchStore(state => state.likes);
  const blockedIds = useSafetyStore(state => state.blockedIds);
  const visibleLikes = likes.filter(like => !blockedIds.includes(like.userId));

  const superlikeCount = visibleLikes.filter(l => l.type === 'superlike').length;

  const handleProfilePress = (userId: string) => {
    navigation.navigate('LikeProfile', { userId });
  };

  const renderLikeItem = ({ index }: { index: number }) => {
    const left = visibleLikes[index];
    const right = visibleLikes[index + 1];

    return (
      <View style={styles.gridRow}>
        <LikeCard like={left} onPress={() => handleProfilePress(left.userId)} />
        {right ? (
          <LikeCard like={right} onPress={() => handleProfilePress(right.userId)} />
        ) : (
          <View style={styles.gridItem} />
        )}
      </View>
    );
  };

  if (visibleLikes.length === 0) {
    return (
      <SafeAreaContainer style={styles.container}>
        <View style={styles.header}>
          <BaseText variant="h1" color={theme.custom.text} style={styles.title} children="Likes" />
        </View>
        <EmptyState
          icon="heart-outline"
          title="No likes yet"
          subtitle="When someone likes you, they'll show up here."
        />
      </SafeAreaContainer>
    );
  }

  const evenIndices = visibleLikes.map((_, i) => i).filter(i => i % 2 === 0);

  return (
    <SafeAreaContainer style={styles.container}>
      <View style={styles.header}>
        <BaseText variant="h1" color={theme.custom.text} style={styles.title} children="Likes" />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.subtitle}
          children={`${visibleLikes.length} people liked you`}
        />
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: theme.colors.primary + '18' }]}>
            <MaterialCommunityIcons name="heart" size={16} color={theme.colors.primary} />
            <BaseText variant="caption" color={theme.colors.primary} children={`${visibleLikes.length} Likes`} />
          </View>
          {superlikeCount > 0 && (
            <View style={[styles.statPill, { backgroundColor: theme.colors.tertiary + '22' }]}>
              <MaterialCommunityIcons name="star-four-points" size={16} color={theme.colors.tertiary} />
              <BaseText variant="caption" color={theme.colors.tertiary} children={`${superlikeCount} Super Likes`} />
            </View>
          )}
        </View>
      </View>
      <FlatList
        data={evenIndices}
        renderItem={renderLikeItem}
        keyExtractor={item => `like-row-${item}`}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaContainer>
  );
};
