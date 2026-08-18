import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { ExploreStackNavigationProp, ExploreStackParamList } from '@types';
import { useThemeStore, useSafetyStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, SafeAreaContainer } from '@components/atoms';
import {
  ProfileScrollHero,
  ExploreActionFooter,
  UserActionsSheet,
  ReportBottomSheet,
} from '@components/molecules';
import { getProfileById } from '@services/mock/data';
import { getExploreCategoryById } from '@constants/explore';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: metrics.spacing.sm,
  },
  section: {
    gap: metrics.spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
  },
  chip: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  photoRow: {
    flexDirection: 'row',
    gap: metrics.spacing.sm,
  },
  thumb: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: metrics.radius.lg,
    overflow: 'hidden',
  },
});

export const ExploreProfileScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<ExploreStackNavigationProp>();
  const route = useRoute<RouteProp<ExploreStackParamList, 'ExploreProfile'>>();
  const { userId, categoryId } = route.params;

  const [atBottom, setAtBottom] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const profile = getProfileById(userId);
  const category = getExploreCategoryById(categoryId);

  if (!profile) {
    return (
      <SafeAreaContainer>
        <BaseText variant="body" children="Profile not found" />
      </SafeAreaContainer>
    );
  }

  const heroPhoto = profile.photos[0];

  const heroBadge =
    category != null ? (
      <View style={styles.categoryPill}>
        <MaterialCommunityIcons name="compass-outline" size={14} color="#FFF" />
        <BaseText variant="caption" color="#FFFFFF" children={category.title} />
      </View>
    ) : null;

  return (
    <SafeAreaContainer style={styles.root}>
      <ProfileScrollHero
        photoUri={heroPhoto}
        name={profile.name}
        age={profile.age}
        profession={profile.profession}
        verified={profile.verified}
        heroBadge={heroBadge}
        onBack={() => navigation.goBack()}
        onMore={() => setActionsOpen(true)}
        onNearBottomChange={setAtBottom}
      >
        {profile.location?.city ? (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color={theme.colors.primary}
            />
            <BaseText variant="body" color={theme.custom.text} children={profile.location.city} />
          </View>
        ) : null}

        <View style={styles.section}>
          <BaseText
            variant="h3"
            color={theme.custom.text}
            style={styles.sectionTitle}
            children="About"
          />
          <BaseText
            variant="body"
            color={theme.custom.textSecondary}
            children={profile.bio ?? 'No bio yet'}
          />
        </View>

        {(profile.interests?.length ?? 0) > 0 ? (
          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Interests"
            />
            <View style={styles.chipWrap}>
              {profile.interests?.map(interest => (
                <View
                  key={interest}
                  style={[styles.chip, { backgroundColor: theme.custom.surfaceVariant }]}
                >
                  <BaseText variant="caption" color={theme.custom.text} children={interest} />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {profile.photos.length > 1 ? (
          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Photos"
            />
            <View style={styles.photoRow}>
              {profile.photos.slice(1, 4).map(uri => (
                <Image key={uri} source={{ uri }} style={styles.thumb} resizeMode="cover" />
              ))}
            </View>
          </View>
        ) : null}
      </ProfileScrollHero>

      <ExploreActionFooter
        revealed={atBottom}
        onLike={() => navigation.goBack()}
        onPass={() => navigation.goBack()}
      />
      <UserActionsSheet
        visible={actionsOpen}
        userName={profile.name}
        onClose={() => setActionsOpen(false)}
        onReport={() => setReportOpen(true)}
        onBlock={() => {
          useSafetyStore.getState().blockUser(profile.id);
          navigation.goBack();
        }}
      />
      <ReportBottomSheet
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={() => {
          setReportOpen(false);
          Alert.alert('Report submitted', 'Thanks. Our team will review this.');
        }}
      />
    </SafeAreaContainer>
  );
};
