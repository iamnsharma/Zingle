import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore, useProfileStore, useOnboardingStore } from '@stores';
import type {
  MainAppNavigationProp,
  ProfileGender,
  RelationshipGoal,
  UserProfile,
} from '@types';
import { metrics } from '@styling/metrics';
import {
  BaseText,
  BaseInput,
  GradientButton,
  SafeAreaContainer,
  InterestChip,
  FilterChip,
} from '@components/atoms';
import {
  AgeSelectorSheet,
  HeightSelectorSheet,
  CitySelectorSheet,
} from '@components/molecules';
import { ImagePickerGrid } from '@components/molecules';
import { INTERESTS, GENDER_OPTIONS, MIN_INTERESTS } from '@constants/onboarding';
import { pickProfilePhotos } from '@utils/pickProfilePhotos';
import {
  DEFAULT_MY_PROFILE,
  DRINKING_OPTIONS,
  EDUCATION_OPTIONS,
  INTERESTED_IN_OPTIONS,
  LANGUAGE_OPTIONS,
  LOOKING_FOR_OPTIONS,
  PET_OPTIONS,
  profileToOnboardingData,
  RELATIONSHIP_GOAL_OPTIONS,
  RELIGION_OPTIONS,
  SMOKING_OPTIONS,
  WORKOUT_OPTIONS,
} from '@utils/profileUtils';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  content: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing['3xl'],
  },
  section: {
    marginTop: metrics.spacing.xl,
  },
  sectionTitle: {
    marginBottom: metrics.spacing.md,
  },
  selectorField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    marginBottom: metrics.spacing.md,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    flex: 1,
  },
  selectorText: {
    flex: 1,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
  },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.radius.full,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  hint: {
    marginTop: metrics.spacing.sm,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldLabel: {
    marginBottom: metrics.spacing.sm,
    marginTop: metrics.spacing.sm,
  },
});

interface SelectorFieldProps {
  icon: string;
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
}

const SelectorField: React.FC<SelectorFieldProps> = ({
  icon,
  label,
  value,
  placeholder,
  onPress,
}) => {
  const { theme } = useThemeStore();
  const display = value || placeholder;

  return (
    <TouchableOpacity
      style={[
        styles.selectorField,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.custom.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.selectorLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={theme.colors.primary}
        />
        <View style={styles.selectorText}>
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children={label}
          />
          <BaseText
            variant="body"
            color={value ? theme.custom.text : theme.custom.textTertiary}
            children={display}
          />
        </View>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={theme.custom.textTertiary}
      />
    </TouchableOpacity>
  );
};

export const EditProfileScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<MainAppNavigationProp>();
  const { currentUser, updateCurrentUser } = useProfileStore();
  const { updateData: updateOnboardingData } = useOnboardingStore();

  const [draft, setDraft] = useState<UserProfile>(() => ({
    ...(currentUser ?? DEFAULT_MY_PROFILE),
  }));
  const [ageSheetOpen, setAgeSheetOpen] = useState(false);
  const [heightSheetOpen, setHeightSheetOpen] = useState(false);
  const [citySheetOpen, setCitySheetOpen] = useState(false);

  const patchDraft = useCallback((updates: Partial<UserProfile>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const gridImages = useMemo(
    () =>
      draft.photos.map((uri, index) => ({
        id: `photo-${index}`,
        uri,
      })),
    [draft.photos],
  );

  const toggleInterest = useCallback(
    (interest: string) => {
      const current = draft.interests ?? [];
      const next = current.includes(interest)
        ? current.filter(i => i !== interest)
        : [...current, interest];
      patchDraft({ interests: next });
    },
    [draft.interests, patchDraft],
  );

  const toggleInterestedIn = useCallback(
    (gender: ProfileGender) => {
      const current = draft.interestedIn ?? [];
      const next = current.includes(gender)
        ? current.filter(g => g !== gender)
        : [...current, gender];
      patchDraft({ interestedIn: next });
    },
    [draft.interestedIn, patchDraft],
  );

  const toggleRelationshipGoal = useCallback(
    (goal: RelationshipGoal) => {
      const current = draft.relationshipGoals ?? [];
      const next = current.includes(goal)
        ? current.filter(g => g !== goal)
        : [...current, goal];
      patchDraft({ relationshipGoals: next });
    },
    [draft.relationshipGoals, patchDraft],
  );

  const toggleLanguage = useCallback(
    (language: string) => {
      const current = draft.languages ?? [];
      const next = current.includes(language)
        ? current.filter(l => l !== language)
        : [...current, language];
      patchDraft({ languages: next });
    },
    [draft.languages, patchDraft],
  );

  const handleAddPhoto = useCallback(async () => {
    if (draft.photos.length >= 6) return;
    const uris = await pickProfilePhotos(6 - draft.photos.length);
    if (uris.length === 0) return;
    patchDraft({ photos: [...draft.photos, ...uris].slice(0, 6) });
  }, [draft.photos, patchDraft]);

  const handleRemovePhoto = useCallback(
    (id: string) => {
      const index = Number(id.replace('photo-', ''));
      patchDraft({
        photos: draft.photos.filter((_, i) => i !== index),
      });
    },
    [draft.photos, patchDraft],
  );

  const handleReorderPhoto = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= draft.photos.length) return;
      const next = [...draft.photos];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      patchDraft({ photos: next });
    },
    [draft.photos, patchDraft],
  );

  const handleSave = useCallback(() => {
    if (!draft.age || draft.age < 18) {
      Alert.alert('18+ only', 'You must be 18 or older to use Zingle.');
      return;
    }
    if (draft.photos.length < 1) {
      Alert.alert('Add a photo', 'Your profile needs at least one photo.');
      return;
    }
    const updated: UserProfile = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    updateCurrentUser(updated);
    updateOnboardingData(profileToOnboardingData(updated));
    navigation.goBack();
  }, [draft, navigation, updateCurrentUser, updateOnboardingData]);

  const city = draft.location?.city;
  const interestCount = draft.interests?.length ?? 0;

  return (
    <SafeAreaContainer style={styles.root}>
      <View
        style={[styles.header, { borderBottomColor: theme.custom.border }]}
      >
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="close"
              size={26}
              color={theme.custom.text}
            />
          </TouchableOpacity>
        </View>
        <BaseText variant="h3" color={theme.custom.text} children="Edit Info" />
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <TouchableOpacity onPress={handleSave}>
            <BaseText
              variant="body"
              color={theme.colors.primary}
              children="Done"
            />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Media"
            />
            <ImagePickerGrid
              images={gridImages}
              maxImages={6}
              columns={3}
              onAddPress={handleAddPhoto}
              onRemovePress={handleRemovePhoto}
              onReorder={handleReorderPhoto}
            />
            <BaseText
              variant="caption"
              color={theme.custom.textTertiary}
              style={styles.hint}
              children="Tap + to add photos. Use arrows to reorder — first photo is your main picture."
            />
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="About"
            />
            <BaseInput
              label="Name"
              value={draft.name}
              onChangeText={name => patchDraft({ name })}
              placeholder="Your first name"
            />
            <SelectorField
              icon="cake-variant-outline"
              label="Age"
              value={draft.age ? `${draft.age}` : undefined}
              placeholder="Select age"
              onPress={() => setAgeSheetOpen(true)}
            />
            <SelectorField
              icon="human-male-height-variant"
              label="Height"
              value={draft.height ? `${draft.height} cm` : undefined}
              placeholder="Select height"
              onPress={() => setHeightSheetOpen(true)}
            />
            <BaseInput
              label="Bio"
              value={draft.bio ?? ''}
              onChangeText={bio => patchDraft({ bio })}
              placeholder="Tell people about yourself..."
              multiline
              numberOfLines={4}
              style={styles.bioInput}
            />
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Gender"
            />
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map(option => {
                const selected = draft.gender === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.genderChip,
                      {
                        backgroundColor: selected
                          ? theme.colors.primary
                          : theme.custom.surfaceVariant,
                        borderColor: selected
                          ? theme.colors.primary
                          : theme.custom.border,
                      },
                    ]}
                    onPress={() =>
                      patchDraft({
                        gender: option.id as UserProfile['gender'],
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={16}
                      color={selected ? '#FFFFFF' : theme.custom.text}
                    />
                    <BaseText
                      variant="caption"
                      color={selected ? '#FFFFFF' : theme.custom.text}
                      children={option.label}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Work & Location"
            />
            <BaseInput
              label="Job title"
              value={draft.profession ?? ''}
              onChangeText={profession => patchDraft({ profession })}
              placeholder="What do you do?"
            />
            <BaseInput
              label="Company"
              value={draft.company ?? ''}
              onChangeText={company => patchDraft({ company })}
              placeholder="Where do you work?"
            />
            <SelectorField
              icon="map-marker-outline"
              label="City"
              value={city}
              placeholder="Select city"
              onPress={() => setCitySheetOpen(true)}
            />
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Education & more"
            />
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Education"
            />
            <View style={styles.chipRow}>
              {EDUCATION_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.education === option.value}
                  onPress={() => patchDraft({ education: option.value })}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Religion"
            />
            <View style={styles.chipRow}>
              {RELIGION_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.religion === option.value}
                  onPress={() => patchDraft({ religion: option.value })}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Languages"
            />
            <View style={styles.chipRow}>
              {LANGUAGE_OPTIONS.map(language => (
                <FilterChip
                  key={language}
                  label={language}
                  selected={draft.languages?.includes(language) ?? false}
                  onPress={() => toggleLanguage(language)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Preferences"
            />
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Show me"
            />
            <View style={styles.chipRow}>
              {INTERESTED_IN_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.interestedIn?.includes(option.value) ?? false}
                  onPress={() => toggleInterestedIn(option.value)}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Looking for"
            />
            <View style={styles.chipRow}>
              {LOOKING_FOR_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.lookingFor === option.value}
                  onPress={() => patchDraft({ lookingFor: option.value })}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Relationship goals"
            />
            <View style={styles.chipRow}>
              {RELATIONSHIP_GOAL_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={
                    draft.relationshipGoals?.includes(option.value) ?? false
                  }
                  onPress={() => toggleRelationshipGoal(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children="Lifestyle"
            />
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Drinking"
            />
            <View style={styles.chipRow}>
              {DRINKING_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.drinking === option.value}
                  onPress={() => patchDraft({ drinking: option.value })}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Smoking"
            />
            <View style={styles.chipRow}>
              {SMOKING_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.smoking === option.value}
                  onPress={() => patchDraft({ smoking: option.value })}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Workout"
            />
            <View style={styles.chipRow}>
              {WORKOUT_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.workout === option.value}
                  onPress={() => patchDraft({ workout: option.value })}
                />
              ))}
            </View>
            <BaseText
              variant="caption"
              color={theme.custom.textSecondary}
              style={styles.fieldLabel}
              children="Pets"
            />
            <View style={styles.chipRow}>
              {PET_OPTIONS.map(option => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.pets === option.value}
                  onPress={() => patchDraft({ pets: option.value })}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <BaseText
              variant="h3"
              color={theme.custom.text}
              style={styles.sectionTitle}
              children={`Interests (${interestCount})`}
            />
            <View style={styles.chipWrap}>
              {INTERESTS.map(interest => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected={draft.interests?.includes(interest) ?? false}
                  onPress={() => toggleInterest(interest)}
                  size="sm"
                />
              ))}
            </View>
            {interestCount < MIN_INTERESTS && (
              <BaseText
                variant="caption"
                color={theme.colors.primary}
                style={styles.hint}
                children={`Pick at least ${MIN_INTERESTS} interests`}
              />
            )}
          </View>
        </ScrollView>

        <View
          style={[styles.footer, { borderTopColor: theme.custom.border }]}
        >
          <GradientButton label="Save changes" size="lg" onPress={handleSave} />
        </View>
      </KeyboardAvoidingView>

      <AgeSelectorSheet
        visible={ageSheetOpen}
        value={draft.age}
        onClose={() => setAgeSheetOpen(false)}
        onConfirm={age => {
          patchDraft({ age });
          setAgeSheetOpen(false);
        }}
      />

      <HeightSelectorSheet
        visible={heightSheetOpen}
        valueCm={draft.height}
        onClose={() => setHeightSheetOpen(false)}
        onConfirm={heightCm => {
          patchDraft({ height: heightCm });
          setHeightSheetOpen(false);
        }}
      />

      <CitySelectorSheet
        visible={citySheetOpen}
        value={city}
        onClose={() => setCitySheetOpen(false)}
        onConfirm={selectedCity => {
          patchDraft({
            location: {
              latitude: draft.location?.latitude ?? 0,
              longitude: draft.location?.longitude ?? 0,
              city: selectedCity,
            },
          });
          setCitySheetOpen(false);
        }}
      />
    </SafeAreaContainer>
  );
};
