import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {
  useThemeStore,
  useProfileStore,
  useOnboardingStore,
  useAuthStore,
} from '@stores';
import type { MainAppNavigationProp, UserProfile } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton, SafeAreaContainer } from '@components/atoms';
import {
  SafetyPrivacyBottomSheet,
  SettingsBottomSheet,
  ProfileSectionSheet,
  ReportBottomSheet,
  type ProfileEditSection,
} from '@components/molecules';
import {
  buildProfileFromOnboarding,
  DEFAULT_MY_PROFILE,
  formatEducationLabel,
  formatGenderLabel,
  formatHabitLabel,
  formatHeightDisplay,
  formatInterestedIn,
  formatLanguages,
  formatLookingFor,
  formatRelationshipGoals,
  formatReligion,
  getMissingProfileTips,
  getProfileCompletionPercent,
} from '@utils/profileUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: metrics.spacing.xs,
    paddingBottom: metrics.spacing['3xl'],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: metrics.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    marginHorizontal: metrics.spacing.lg,
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    marginBottom: metrics.spacing.md,
    borderWidth: 1,
    ...metrics.shadows.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.lg,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    marginBottom: metrics.spacing.xs,
  },
  completionLabel: {
    marginBottom: metrics.spacing.sm,
  },
  progressTrack: {
    height: 6,
    borderRadius: metrics.radius.full,
    overflow: 'hidden',
    marginBottom: metrics.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: metrics.radius.full,
  },
  completionHint: {
    marginTop: metrics.spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: metrics.spacing.sm,
    marginTop: metrics.spacing.lg,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: metrics.spacing.md,
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: metrics.spacing.xs,
  },
  editButtonWrap: {
    flex: 1.4,
  },
  sectionCard: {
    marginHorizontal: metrics.spacing.lg,
    marginBottom: metrics.spacing.lg,
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
  },
  sectionTitleBold: {
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.sm,
    gap: metrics.spacing.md,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontWeight: '700',
  },
  detailDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
  },
  bioText: {
    lineHeight: 22,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
  },
  interestChip: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
  },
  menuCard: {
    marginHorizontal: metrics.spacing.lg,
    marginBottom: metrics.spacing.lg,
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuSectionWrap: {
    marginHorizontal: metrics.spacing.lg,
    marginBottom: metrics.spacing.lg,
    gap: metrics.spacing.sm,
  },
  menuCardNested: {
    marginHorizontal: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  menuRowText: {
    flex: 1,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: metrics.spacing.lg + 24 + metrics.spacing.md,
  },
  logoutWrap: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.lg,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  emptyPassions: {
    paddingVertical: metrics.spacing.md,
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
});

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  const { theme } = useThemeStore();
  return (
    <BaseText
      variant="h3"
      color={theme.custom.text}
      style={styles.sectionTitleBold}
      children={title}
    />
  );
};

interface SectionEditButtonProps {
  onPress: () => void;
}

const SectionEditButton: React.FC<SectionEditButtonProps> = ({ onPress }) => {
  const { theme } = useThemeStore();
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <MaterialCommunityIcons
        name="pencil-outline"
        size={20}
        color={theme.colors.primary}
      />
    </TouchableOpacity>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  showDivider?: boolean;
  onPress?: () => void;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  showDivider = true,
  onPress,
}) => {
  const { theme } = useThemeStore();
  const content = (
    <>
      <View
        style={[
          styles.detailIcon,
          { backgroundColor: theme.custom.surfaceVariant },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.detailContent}>
        <BaseText
          variant="caption"
          color={theme.custom.textTertiary}
          style={styles.detailLabel}
          children={label}
        />
        <BaseText
          variant="body"
          color={theme.custom.text}
          children={value}
        />
      </View>
      {onPress && (
        <MaterialCommunityIcons
          name="pencil-outline"
          size={18}
          color={theme.custom.textTertiary}
        />
      )}
    </>
  );

  return (
    <>
      {onPress ? (
        <TouchableOpacity
          style={styles.detailRow}
          onPress={onPress}
          activeOpacity={0.7}
        >
          {content}
        </TouchableOpacity>
      ) : (
        <View style={styles.detailRow}>{content}</View>
      )}
      {showDivider && (
        <View
          style={[styles.detailDivider, { backgroundColor: theme.custom.border }]}
        />
      )}
    </>
  );
};

export const ProfileScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<MainAppNavigationProp>();
  const { currentUser, setCurrentUser } = useProfileStore();
  const { data: onboardingData, isCompleted } = useOnboardingStore();
  const { logout } = useAuthStore();
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ProfileEditSection | null>(
    null,
  );

  useEffect(() => {
    if (currentUser) return;
    if (isCompleted && Object.keys(onboardingData).length > 0) {
      setCurrentUser(buildProfileFromOnboarding(onboardingData));
      return;
    }
    setCurrentUser(DEFAULT_MY_PROFILE);
  }, [currentUser, isCompleted, onboardingData, setCurrentUser]);

  const profile: UserProfile = currentUser ?? DEFAULT_MY_PROFILE;
  const completion = getProfileCompletionPercent(profile);
  const missingTips = getMissingProfileTips(profile);
  const mainPhoto = profile.photos[0];

  const openEdit = () => navigation.navigate('EditProfile');
  const openSection = (section: ProfileEditSection) => setActiveSection(section);

  const chainFromSettings = (action: () => void) => {
    setSettingsOpen(false);
    setTimeout(action, 280);
  };

  const completionColor =
    completion >= 80
      ? theme.custom.success
      : completion >= 50
        ? theme.colors.tertiary
        : theme.colors.primary;

  return (
    <SafeAreaContainer style={styles.container}>
      <View style={styles.topBar}>
        <BaseText variant="h2" color={theme.custom.text} children="Profile" />
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: theme.custom.surfaceVariant },
            ]}
            onPress={() => setSafetyOpen(true)}
          >
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={22}
              color={theme.custom.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: theme.custom.surfaceVariant },
            ]}
            onPress={() => setSettingsOpen(true)}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color={theme.custom.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.custom.border,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View
            style={[
              styles.avatarRing,
              { backgroundColor: completionColor },
            ]}
          >
            <View style={styles.avatarInner}>
              {mainPhoto ? (
                <Image
                  source={{ uri: mainPhoto }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.avatarImage,
                    styles.avatarPlaceholder,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <BaseText
                    variant="h2"
                    color="#FFFFFF"
                    children={profile.name.charAt(0).toUpperCase()}
                  />
                </View>
              )}
            </View>
            {profile.verified && (
              <View
                style={[
                  styles.verifiedBadge,
                  {
                    backgroundColor: theme.colors.tertiary,
                    borderColor: theme.colors.surface,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={12}
                  color="#FFFFFF"
                />
              </View>
            )}
          </View>

          <View style={styles.heroInfo}>
            <BaseText
              variant="h2"
              color={theme.custom.text}
              style={styles.heroName}
              children={`${profile.name}, ${profile.age}`}
            />
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.completionLabel}
              children={`${completion}% complete`}
            />
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: theme.custom.surfaceVariant },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${completion}%`,
                    backgroundColor: completionColor,
                  },
                ]}
              />
            </View>
            {missingTips[0] && completion < 100 && (
              <BaseText
                variant="caption"
                color={theme.custom.textTertiary}
                style={styles.completionHint}
                children={`Next: ${missingTips[0]}`}
              />
            )}
          </View>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.editButtonWrap}>
            <GradientButton
              label="Edit profile"
              size="md"
              onPress={openEdit}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: theme.custom.border,
                backgroundColor: theme.custom.surfaceVariant,
              },
            ]}
            onPress={() => openSection('media')}
          >
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={18}
              color={theme.custom.text}
            />
            <BaseText
              variant="caption"
              color={theme.custom.text}
              children="Add media"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <SectionTitle title="About me" />
            <SectionEditButton onPress={() => openSection('about')} />
          </View>
          <TouchableOpacity onPress={() => openSection('about')} activeOpacity={0.8}>
            <BaseText
              variant="body"
              color={profile.bio ? theme.custom.text : theme.custom.textTertiary}
              style={styles.bioText}
              children={
                profile.bio ||
                'Add a bio so people know what makes you unique.'
              }
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <SectionTitle title="Essentials" />
            <SectionEditButton onPress={() => openSection('essentials')} />
          </View>
          <DetailRow
            icon="cake-variant-outline"
            label="Age"
            value={`${profile.age} years old`}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="human-male-height-variant"
            label="Height"
            value={formatHeightDisplay(profile.height)}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="gender-male-female"
            label="Gender"
            value={formatGenderLabel(profile.gender)}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="account-heart-outline"
            label="Show me"
            value={formatInterestedIn(profile.interestedIn)}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="map-marker-outline"
            label="Location"
            value={profile.location?.city ?? 'Add location'}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="briefcase-outline"
            label="Job"
            value={
              profile.profession
                ? profile.company
                  ? `${profile.profession} at ${profile.company}`
                  : profile.profession
                : 'Add job'
            }
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="school-outline"
            label="Education"
            value={formatEducationLabel(profile.education)}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="translate"
            label="Languages"
            value={formatLanguages(profile.languages)}
            onPress={() => openSection('essentials')}
          />
          <DetailRow
            icon="hands-pray"
            label="Religion"
            value={formatReligion(profile.religion)}
            onPress={() => openSection('lifestyle')}
            showDivider={false}
          />
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <SectionTitle title="Passions" />
            <SectionEditButton onPress={() => openSection('passions')} />
          </View>
          {(profile.interests?.length ?? 0) > 0 ? (
            <View style={styles.chipWrap}>
              {profile.interests?.map(interest => (
                <View
                  key={interest}
                  style={[
                    styles.interestChip,
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
          ) : (
            <View style={styles.emptyPassions}>
              <BaseText
                variant="body"
                color={theme.custom.textTertiary}
                children="Add passions to find better matches"
              />
              <TouchableOpacity onPress={() => openSection('passions')}>
                <BaseText
                  variant="body"
                  color={theme.colors.primary}
                  children="Add passions"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <SectionTitle title="Lifestyle" />
            <SectionEditButton onPress={() => openSection('lifestyle')} />
          </View>
          <DetailRow
            icon="heart-outline"
            label="Looking for"
            value={formatLookingFor(profile.lookingFor)}
            onPress={() => openSection('lifestyle')}
          />
          <DetailRow
            icon="target"
            label="Relationship goals"
            value={formatRelationshipGoals(profile.relationshipGoals)}
            onPress={() => openSection('lifestyle')}
          />
          <DetailRow
            icon="glass-cocktail"
            label="Drinking"
            value={formatHabitLabel(profile.drinking)}
            onPress={() => openSection('lifestyle')}
          />
          <DetailRow
            icon="smoking"
            label="Smoking"
            value={formatHabitLabel(profile.smoking)}
            onPress={() => openSection('lifestyle')}
          />
          <DetailRow
            icon="dumbbell"
            label="Workout"
            value={formatHabitLabel(profile.workout)}
            onPress={() => openSection('lifestyle')}
          />
          <DetailRow
            icon="paw"
            label="Pets"
            value={formatHabitLabel(profile.pets)}
            onPress={() => openSection('lifestyle')}
            showDivider={false}
          />
        </View>

        <View style={styles.menuSectionWrap}>
          <SectionTitle title="Quick actions" />
          <View
            style={[
              styles.menuCard,
              styles.menuCardNested,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.custom.border,
              },
            ]}
          >
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setSafetyOpen(true)}
          >
            <MaterialCommunityIcons
              name="shield-outline"
              size={22}
              color={theme.colors.primary}
            />
            <View style={styles.menuRowText}>
              <BaseText
                variant="body"
                color={theme.custom.text}
                children="Safety & Privacy"
              />
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={theme.custom.textTertiary}
            />
          </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      <SettingsBottomSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenSafety={() => chainFromSettings(() => setSafetyOpen(true))}
        onOpenEditProfile={() => chainFromSettings(openEdit)}
        onOpenHelp={() =>
          chainFromSettings(() => navigation.navigate('HelpSupport'))
        }
        onOpenBlocked={() =>
          chainFromSettings(() => navigation.navigate('BlockedAccounts'))
        }
        onOpenLegal={document =>
          chainFromSettings(() => navigation.navigate('Legal', { document }))
        }
        onLogout={() => chainFromSettings(logout)}
        onDeleteAccount={() =>
          chainFromSettings(() => navigation.navigate('DeleteAccount'))
        }
      />
      <ProfileSectionSheet
        visible={activeSection !== null}
        section={activeSection}
        onClose={() => setActiveSection(null)}
        onOpenFullEditor={() => {
          setActiveSection(null);
          openEdit();
        }}
      />
      <SafetyPrivacyBottomSheet
        visible={safetyOpen}
        onClose={() => setSafetyOpen(false)}
        onOpenBlocked={() => navigation.navigate('BlockedAccounts')}
        onOpenReport={() => setReportOpen(true)}
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
