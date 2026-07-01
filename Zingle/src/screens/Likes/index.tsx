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
import { BaseText, SafeAreaContainer } from '@components/atoms';
import { MOCK_LIKES } from '@services/mock/data';

interface LikesScreenProps {
  onProfilePress?: (userId: string) => void;
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
    justifyContent: 'flex-end',
    padding: metrics.spacing.md,
  },
  itemContent: {
    justifyContent: 'flex-end',
  },
  itemName: {
    marginBottom: metrics.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const LikesScreen: React.FC<LikesScreenProps> = ({
  onProfilePress,
}) => {
  const { theme } = useThemeStore();

  const renderLikeItem = ({ item, index }: any) => {
    const isEvenRow = index % 2 === 0;
    return isEvenRow ? (
      <View style={styles.gridRow}>
        <TouchableOpacity
          style={[
            styles.gridItem,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => onProfilePress?.(item.userId)}
        >
          <View style={styles.itemContent}>
            <BaseText
              variant="body"
              color="#FFFFFF"
              style={styles.itemName}
              children={item.user.name}
            />
            <BaseText
              variant="caption"
              color="rgba(255, 255, 255, 0.8)"
              children={`${item.user.age}, ${item.user.profession}`}
            />
          </View>
        </TouchableOpacity>
        {MOCK_LIKES[index + 1] && (
          <TouchableOpacity
            style={[
              styles.gridItem,
              {
                backgroundColor: theme.colors.secondary,
              },
            ]}
            onPress={() => onProfilePress?.(MOCK_LIKES[index + 1].userId)}
          >
            <View style={styles.itemContent}>
              <BaseText
                variant="body"
                color="#FFFFFF"
                style={styles.itemName}
                children={MOCK_LIKES[index + 1].user.name}
              />
              <BaseText
                variant="caption"
                color="rgba(255, 255, 255, 0.8)"
                children={`${MOCK_LIKES[index + 1].user.age}, ${MOCK_LIKES[index + 1].user.profession}`}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    ) : null;
  };

  if (MOCK_LIKES.length === 0) {
    return (
      <SafeAreaContainer>
        <View style={styles.header}>
          <BaseText
            variant="h1"
            color={theme.custom.text}
            style={styles.title}
            children="Likes"
          />
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={64}
            color={theme.custom.textTertiary}
          />
          <BaseText
            variant="h2"
            color={theme.custom.text}
            children="No likes yet"
          />
        </View>
      </SafeAreaContainer>
    );
  }

  const evenIndices = MOCK_LIKES.map((_, i) => i).filter(i => i % 2 === 0);

  return (
    <SafeAreaContainer>
      <View style={styles.header}>
        <BaseText
          variant="h1"
          color={theme.custom.text}
          style={styles.title}
          children="Likes"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.subtitle}
          children={`${MOCK_LIKES.length} people liked you`}
        />
      </View>
      <FlatList
        data={evenIndices}
        renderItem={(item) => renderLikeItem({ ...item, item: MOCK_LIKES[item.index] })}
        keyExtractor={(item) => `like-${item}`}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={true}
      />
    </SafeAreaContainer>
  );
};
