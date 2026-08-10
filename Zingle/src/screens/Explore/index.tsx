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
import type { ExploreStackNavigationProp } from '@types';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, SafeAreaContainer } from '@components/atoms';
import {
  EXPLORE_CATEGORIES,
  getExploreMemberCount,
  type ExploreCategory,
} from '@constants/explore';

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
    marginBottom: metrics.spacing.lg,
  },
  gridContainer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.lg,
    gap: metrics.spacing.md,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 0.9,
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
  itemTitle: {
    marginBottom: metrics.spacing.xs,
    fontWeight: '700',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: 3,
    borderRadius: metrics.radius.full,
    marginBottom: metrics.spacing.xs,
  },
  chevron: {
    position: 'absolute',
    top: metrics.spacing.sm,
    right: metrics.spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface ExploreCardProps {
  category: ExploreCategory;
  onPress: () => void;
}

const ExploreCard: React.FC<ExploreCardProps> = ({ category, onPress }) => {
  const { theme } = useThemeStore();
  const memberCount = getExploreMemberCount(category);
  const countLabel =
    memberCount === 1 ? '1 person' : `${memberCount} people`;

  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPress} activeOpacity={0.85}>
      <ImageBackground
        source={category.image}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}
        >
          <View style={styles.chevron}>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#FFF" />
          </View>
          <View style={[styles.countBadge, { backgroundColor: theme.colors.primary + 'CC' }]}>
            <MaterialCommunityIcons name="account-group-outline" size={12} color="#FFF" />
            <BaseText
              variant="caption"
              color="#FFFFFF"
              style={{ fontWeight: '700' }}
              children={countLabel}
            />
          </View>
          <BaseText variant="body" color="#FFFFFF" style={styles.itemTitle} children={category.title} />
          <BaseText
            variant="caption"
            color="rgba(255, 255, 255, 0.85)"
            children={category.subtitle}
          />
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export const ExploreScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<ExploreStackNavigationProp>();

  const openCategory = (category: ExploreCategory) => {
    navigation.navigate('ExploreCategory', { categoryId: category.id });
  };

  const renderRow = ({ item: startIndex }: { item: number }) => {
    const left = EXPLORE_CATEGORIES[startIndex];
    const right = EXPLORE_CATEGORIES[startIndex + 1];

    return (
      <View style={styles.gridRow}>
        <ExploreCard category={left} onPress={() => openCategory(left)} />
        {right ? (
          <ExploreCard category={right} onPress={() => openCategory(right)} />
        ) : (
          <View style={styles.gridItem} />
        )}
      </View>
    );
  };

  const rowIndices = EXPLORE_CATEGORIES.map((_, i) => i).filter(i => i % 2 === 0);

  return (
    <SafeAreaContainer style={styles.container}>
      <View style={styles.header}>
        <BaseText
          variant="h1"
          color={theme.custom.text}
          style={styles.title}
          children="Explore"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.subtitle}
          children="Discover people by vibe"
        />
      </View>
      <FlatList
        data={rowIndices}
        renderItem={renderRow}
        keyExtractor={item => `explore-row-${item}`}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.container}>
            <MaterialCommunityIcons
              name="compass-outline"
              size={64}
              color={theme.custom.textTertiary}
            />
            <BaseText variant="h2" color={theme.custom.text} children="Nothing to explore yet" />
          </View>
        }
      />
    </SafeAreaContainer>
  );
};
