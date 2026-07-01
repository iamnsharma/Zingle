import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '@stores';
import { useProfileStore } from '@stores/profileStore';
import type { MainAppNavigationProp } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton, SafeAreaContainer } from '@components/atoms';
import { MOCK_PROFILES } from '@services/mock/data';

interface ProfileScreenProps {
  onEditPress?: () => void;
  onLogoutPress?: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoCarousel: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    marginBottom: metrics.spacing.lg,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: metrics.spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  nameAge: {
    marginBottom: metrics.spacing.sm,
  },
  profession: {
    marginBottom: metrics.spacing.xs,
  },
  section: {
    marginBottom: metrics.spacing.xl,
  },
  sectionTitle: {
    marginBottom: metrics.spacing.md,
  },
  sectionContent: {
    gap: metrics.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: metrics.spacing.sm,
    borderBottomWidth: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
  },
  chip: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
  },
  buttonContainer: {
    gap: metrics.spacing.md,
  },
});

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onEditPress,
  onLogoutPress,
}) => {
  const { theme } = useThemeStore();
  const { currentUser } = useProfileStore();
  const navigation = useNavigation<MainAppNavigationProp>();

  const profile = currentUser || MOCK_PROFILES[0];

  const handleEditProfile = () => {
    if (onEditPress) {
      onEditPress();
      return;
    }
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Carousel */}
        {profile.photos.length > 0 && (
          <Image
            source={{ uri: profile.photos[0] }}
            style={styles.photoCarousel}
          />
        )}

        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <BaseText
                variant="h1"
                color={theme.custom.text}
                style={styles.nameAge}
                children={`${profile.name}, ${profile.age}`}
              />
              {profile.profession && (
                <BaseText
                  variant="body"
                  color={theme.custom.textSecondary}
                  style={styles.profession}
                  children={profile.profession}
                />
              )}
              {profile.location && (
                <BaseText
                  variant="body"
                  color={theme.custom.textTertiary}
                  children={profile.location.city}
                />
              )}
            </View>
            <TouchableOpacity onPress={onEditPress}>
              <BaseText
                variant="h2"
                color={theme.colors.primary}
                children="✎"
              />
            </TouchableOpacity>
          </View>

          {/* Bio */}
          {profile.bio && (
            <View style={styles.section}>
              <BaseText
                variant="body"
                color={theme.custom.text}
                children={profile.bio}
              />
            </View>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.section}>
              <BaseText
                variant="h3"
                color={theme.custom.text}
                style={styles.sectionTitle}
                children="Interests"
              />
              <View style={styles.chipContainer}>
                {profile.interests.map((interest) => (
                  <View
                    key={interest}
                    style={[
                      styles.chip,
                      { backgroundColor: theme.custom.surfaceVariant },
                    ]}
                  >
                    <BaseText
                      variant="caption"
                      color={theme.custom.text}
                      children={interest}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Details */}
          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Details"
            />
            <View style={styles.sectionContent}>
              {profile.height && (
                <View
                  style={[
                    styles.infoRow,
                    { borderBottomColor: theme.custom.border },
                  ]}
                >
                  <BaseText
                    variant="body"
                    color={theme.custom.textSecondary}
                    children="Height"
                  />
                  <BaseText
                    variant="body"
                    color={theme.custom.text}
                    children={`${profile.height} cm`}
                  />
                </View>
              )}
              {profile.education && (
                <View
                  style={[
                    styles.infoRow,
                    { borderBottomColor: theme.custom.border },
                  ]}
                >
                  <BaseText
                    variant="body"
                    color={theme.custom.textSecondary}
                    children="Education"
                  />
                  <BaseText
                    variant="body"
                    color={theme.custom.text}
                    children={profile.education.charAt(0).toUpperCase() + profile.education.slice(1)}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <GradientButton
              label="Edit Profile"
              size="lg"
              onPress={handleEditProfile}
            />
            <TouchableOpacity onPress={onLogoutPress}>
              <BaseText
                variant="body"
                color={theme.custom.error}
                children="Logout"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
};
