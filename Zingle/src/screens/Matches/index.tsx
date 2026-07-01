import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, ProfileAvatar } from '@components/atoms';
import { MOCK_PROFILES } from '@services/mock/data';

interface MatchesScreenProps {
  onMatchPress?: (userId: string) => void;
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
  horizontalScroll: {
    paddingHorizontal: metrics.spacing.lg,
    marginBottom: metrics.spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: metrics.spacing.lg,
  },
  avatarName: {
    marginTop: metrics.spacing.sm,
    maxWidth: 80,
  },
  sectionTitle: {
    paddingHorizontal: metrics.spacing.lg,
    marginBottom: metrics.spacing.md,
  },
  matchItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: metrics.radius.lg,
    margin: metrics.spacing.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: metrics.spacing.md,
  },
  matchContent: {
    justifyContent: 'flex-end',
  },
  matchName: {
    marginBottom: metrics.spacing.xs,
  },
});

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  onMatchPress,
}) => {
  const { theme } = useThemeStore();

  const recentMatches = MOCK_PROFILES.slice(0, 2);
  const allMatches = MOCK_PROFILES;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <BaseText
          variant="h1"
          color={theme.custom.text}
          style={styles.title}
          children="Matches"
        />
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.subtitle}
          children={`${allMatches.length} new matches`}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recent Matches - Horizontal */}
        <BaseText
          variant="h3"
          color={theme.custom.text}
          style={styles.sectionTitle}
          children="Recent Matches"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {recentMatches.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.avatarContainer}
              onPress={() => onMatchPress?.(profile.id)}
            >
              <ProfileAvatar
                uri={profile.photos[0]}
                initials={profile.name.charAt(0)}
                size="lg"
                online={profile.online}
              />
              <BaseText
                variant="caption"
                color={theme.custom.text}
                style={styles.avatarName}
                numberOfLines={1}
                children={profile.name}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Matches - Grid */}
        <BaseText
          variant="h3"
          color={theme.custom.text}
          style={styles.sectionTitle}
          children="All Matches"
        />
        <View style={{ paddingHorizontal: metrics.spacing.lg }}>
          {allMatches.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.matchItem,
                {
                  backgroundColor: theme.colors.primary,
                  marginBottom: metrics.spacing.md,
                },
              ]}
              onPress={() => onMatchPress?.(profile.id)}
            >
              <View style={styles.matchContent}>
                <BaseText
                  variant="body"
                  color="#FFFFFF"
                  style={styles.matchName}
                  children={profile.name}
                />
                <BaseText
                  variant="caption"
                  color="rgba(255, 255, 255, 0.8)"
                  children={`${profile.age}, ${profile.profession}`}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
