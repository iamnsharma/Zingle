import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { LikesStackNavigationProp, LikesStackParamList } from '@types';
import { useThemeStore, useSafetyStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton, SafeAreaContainer } from '@components/atoms';
import { UserActionsSheet, ReportBottomSheet } from '@components/molecules';
import { getLikeByUserId, getProfileById } from '@services/mock/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.15,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: metrics.spacing.lg,
  },
  superlikeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    backgroundColor: 'rgba(250, 185, 56, 0.9)',
    marginBottom: metrics.spacing.sm,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginTop: metrics.spacing.xs,
  },
  body: {
    padding: metrics.spacing.lg,
    gap: metrics.spacing.lg,
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
    width: (SCREEN_WIDTH - metrics.spacing.lg * 2 - metrics.spacing.sm * 2) / 3,
    aspectRatio: 0.75,
    borderRadius: metrics.radius.lg,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  passBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBtnWrap: {
    flex: 1,
  },
});

export const LikeProfileScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<LikesStackNavigationProp>();
  const route = useRoute<RouteProp<LikesStackParamList, 'LikeProfile'>>();
  const { userId } = route.params;

  const profile = getProfileById(userId);
  const like = getLikeByUserId(userId);
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);

  if (!profile) {
    return (
      <SafeAreaContainer>
        <BaseText variant="body" children="Profile not found" />
      </SafeAreaContainer>
    );
  }

  const heroPhoto = profile.photos[0];

  return (
    <SafeAreaContainer style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <ImageBackground
          source={{ uri: heroPhoto }}
          style={styles.hero}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.75)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setActionsOpen(true)}>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroOverlay}>
            {like?.type === 'superlike' && (
              <View style={styles.superlikeBadge}>
                <MaterialCommunityIcons name="star-four-points" size={16} color="#FFF" />
                <BaseText variant="caption" color="#FFFFFF" children="Super Like" />
              </View>
            )}
            <BaseText
              variant="h1"
              color="#FFFFFF"
              children={`${profile.name}, ${profile.age}`}
            />
            {profile.profession && (
              <BaseText
                variant="body"
                color="rgba(255,255,255,0.9)"
                children={profile.profession}
              />
            )}
            {profile.verified && (
              <View style={styles.verifiedRow}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={18}
                  color={theme.colors.tertiary}
                />
                <BaseText variant="caption" color="rgba(255,255,255,0.85)" children="Verified" />
              </View>
            )}
          </View>
        </ImageBackground>

        <View style={styles.body}>
          {profile.location?.city && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={20}
                color={theme.colors.primary}
              />
              <BaseText variant="body" color={theme.custom.text} children={profile.location.city} />
            </View>
          )}

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

          {(profile.interests?.length ?? 0) > 0 && (
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
                    style={[
                      styles.chip,
                      { backgroundColor: theme.custom.surfaceVariant },
                    ]}
                  >
                    <BaseText variant="caption" color={theme.custom.text} children={interest} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {profile.photos.length > 1 && (
            <View style={styles.section}>
              <BaseText
                variant="h3"
                color={theme.custom.text}
                style={styles.sectionTitle}
                children="Photos"
              />
              <View style={styles.photoRow}>
                {profile.photos.slice(1, 4).map(uri => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { borderTopColor: theme.custom.border, backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity
          style={[styles.passBtn, { borderColor: theme.custom.border }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" size={28} color={theme.custom.textSecondary} />
        </TouchableOpacity>
        <View style={styles.likeBtnWrap}>
          <GradientButton
            label="Like back"
            size="lg"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
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
