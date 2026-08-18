import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useProfileStore, useOnboardingStore } from '@stores';
import type {
  ProfileGender,
  RelationshipGoal,
  UserProfile,
} from '@types';
import { metrics } from '@styling/metrics';
import {
  BaseText,
  BaseInput,
  FilterChip,
  GradientButton,
  InterestChip,
} from '@components/atoms';
import { AgeSelectorSheet } from '../AgeSelectorSheet';
import { HeightSelectorSheet } from '../HeightSelectorSheet';
import { CitySelectorSheet } from '../CitySelectorSheet';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';
import { INTERESTS, GENDER_OPTIONS, MIN_INTERESTS } from '@constants/onboarding';
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

export type ProfileEditSection =
  | 'media'
  | 'about'
  | 'essentials'
  | 'lifestyle'
  | 'passions';

interface ProfileSectionSheetProps {
  visible: boolean;
  section: ProfileEditSection | null;
  onClose: () => void;
  onOpenFullEditor?: () => void;
}

const DISMISS_THRESHOLD = 120;

const SECTION_META: Record<
  ProfileEditSection,
  { title: string; subtitle: string }
> = {
  media: {
    title: 'My photos',
    subtitle: 'Your first photo is your main profile picture',
  },
  about: {
    title: 'About me',
    subtitle: 'Tell people what makes you unique',
  },
  essentials: {
    title: 'Essentials',
    subtitle: 'Basic info people see on your profile',
  },
  lifestyle: {
    title: 'Lifestyle',
    subtitle: 'Share your habits and what you want',
  },
  passions: {
    title: 'Passions',
    subtitle: 'Pick interests to find better matches',
  },
};

export const ProfileSectionSheet: React.FC<ProfileSectionSheetProps> = ({
  visible,
  section,
  onClose,
  onOpenFullEditor,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { currentUser, updateCurrentUser } = useProfileStore();
  const { updateData: updateOnboardingData } = useOnboardingStore();

  const [draft, setDraft] = useState<UserProfile>(() => ({
    ...(currentUser ?? DEFAULT_MY_PROFILE),
  }));
  const [ageSheetOpen, setAgeSheetOpen] = useState(false);
  const [heightSheetOpen, setHeightSheetOpen] = useState(false);
  const [citySheetOpen, setCitySheetOpen] = useState(false);

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetHeight = screenHeight * 0.78;

  useEffect(() => {
    if (visible && section) {
      setDraft({ ...(currentUser ?? DEFAULT_MY_PROFILE) });
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, section, currentUser, sheetHeight, translateY, backdropOpacity]);

  const closeSheet = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 4,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) {
          translateY.setValue(dy);
          backdropOpacity.setValue(
            Math.max(0, 1 - dy / (sheetHeight * 0.6)),
          );
        }
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > 0.8) {
          closeSheet();
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const patchDraft = useCallback((updates: Partial<UserProfile>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = () => {
    const updated: UserProfile = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    updateCurrentUser(updated);
    updateOnboardingData(profileToOnboardingData(updated));
    closeSheet();
  };

  const toggleInterest = (interest: string) => {
    const current = draft.interests ?? [];
    const next = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    patchDraft({ interests: next });
  };

  const toggleInterestedIn = (gender: ProfileGender) => {
    const current = draft.interestedIn ?? [];
    const next = current.includes(gender)
      ? current.filter(g => g !== gender)
      : [...current, gender];
    patchDraft({ interestedIn: next });
  };

  const toggleRelationshipGoal = (goal: RelationshipGoal) => {
    const current = draft.relationshipGoals ?? [];
    const next = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    patchDraft({ relationshipGoals: next });
  };

  const toggleLanguage = (language: string) => {
    const current = draft.languages ?? [];
    const next = current.includes(language)
      ? current.filter(l => l !== language)
      : [...current, language];
    patchDraft({ languages: next });
  };

  if (!visible || !section) return null;

  const meta = SECTION_META[section];
  const city = draft.location?.city;

  const renderFieldLabel = (label: string) => (
    <BaseText
      variant="bodyMedium"
      color={theme.custom.textSecondary}
      style={styles.fieldLabel}
      children={label}
    />
  );

  const renderChipRow = (
    options: { value: string; label: string }[],
    selected: string | undefined,
    onSelect: (value: string) => void,
  ) => (
    <View style={styles.chipRow}>
      {options.map(option => (
        <FilterChip
          key={option.value}
          label={option.label}
          selected={selected === option.value}
          onPress={() => onSelect(option.value)}
        />
      ))}
    </View>
  );

  const renderMultiChipRow = (
    options: { value: string; label: string }[],
    selected: string[] | undefined,
    onToggle: (value: string) => void,
  ) => (
    <View style={styles.chipRow}>
      {options.map(option => (
        <FilterChip
          key={option.value}
          label={option.label}
          selected={selected?.includes(option.value) ?? false}
          onPress={() => onToggle(option.value)}
        />
      ))}
    </View>
  );

  const renderContent = () => {
    switch (section) {
      case 'media':
        return (
          <>
            <View
              style={[
                styles.mediaHero,
                { backgroundColor: theme.custom.surfaceVariant },
              ]}
            >
              <MaterialCommunityIcons
                name="image-multiple-outline"
                size={48}
                color={theme.colors.primary}
              />
              <BaseText
                variant="body"
                color={theme.custom.textSecondary}
                style={styles.mediaHint}
                children={`${draft.photos.length} of 6 photos added`}
              />
            </View>
            {onOpenFullEditor && (
              <TouchableOpacity
                style={[
                  styles.fullEditorLink,
                  { borderColor: theme.custom.border },
                ]}
                onPress={() => closeSheet(onOpenFullEditor)}
              >
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={22}
                  color={theme.colors.primary}
                />
                <BaseText
                  variant="bodyMedium"
                  color={theme.colors.primary}
                  children="Open photo editor"
                />
              </TouchableOpacity>
            )}
          </>
        );

      case 'about':
        return (
          <BaseInput
            label="Bio"
            value={draft.bio ?? ''}
            onChangeText={bio => patchDraft({ bio })}
            placeholder="Write something fun and genuine..."
            multiline
            numberOfLines={6}
            style={styles.bioInput}
          />
        );

      case 'essentials':
        return (
          <>
            <BaseInput
              label="Name"
              value={draft.name}
              onChangeText={name => patchDraft({ name })}
              placeholder="Your first name"
            />
            <TouchableOpacity
              style={[
                styles.selectorRow,
                {
                  borderColor: theme.custom.border,
                  backgroundColor: theme.custom.surfaceVariant,
                },
              ]}
              onPress={() => setAgeSheetOpen(true)}
            >
              <BaseText variant="body" color={theme.custom.textSecondary} children="Age" />
              <BaseText variant="bodyMedium" color={theme.custom.text} children={`${draft.age}`} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectorRow,
                {
                  borderColor: theme.custom.border,
                  backgroundColor: theme.custom.surfaceVariant,
                },
              ]}
              onPress={() => setHeightSheetOpen(true)}
            >
              <BaseText variant="body" color={theme.custom.textSecondary} children="Height" />
              <BaseText
                variant="bodyMedium"
                color={theme.custom.text}
                children={draft.height ? `${draft.height} cm` : 'Add'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectorRow,
                {
                  borderColor: theme.custom.border,
                  backgroundColor: theme.custom.surfaceVariant,
                },
              ]}
              onPress={() => setCitySheetOpen(true)}
            >
              <BaseText variant="body" color={theme.custom.textSecondary} children="City" />
              <BaseText variant="bodyMedium" color={theme.custom.text} children={city ?? 'Add'} />
            </TouchableOpacity>
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
            {renderFieldLabel('Gender')}
            <View style={styles.chipRow}>
              {GENDER_OPTIONS.map(option => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={draft.gender === option.id}
                  onPress={() =>
                    patchDraft({ gender: option.id as UserProfile['gender'] })
                  }
                />
              ))}
            </View>
            {renderFieldLabel('Show me')}
            {renderMultiChipRow(
              INTERESTED_IN_OPTIONS,
              draft.interestedIn,
              g => toggleInterestedIn(g as ProfileGender),
            )}
            {renderFieldLabel('Education')}
            {renderChipRow(
              EDUCATION_OPTIONS,
              draft.education,
              v => patchDraft({ education: v as UserProfile['education'] }),
            )}
            {renderFieldLabel('Languages')}
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
          </>
        );

      case 'lifestyle':
        return (
          <>
            {renderFieldLabel('Looking for')}
            {renderChipRow(
              LOOKING_FOR_OPTIONS,
              draft.lookingFor,
              v => patchDraft({ lookingFor: v as UserProfile['lookingFor'] }),
            )}
            {renderFieldLabel('Relationship goals')}
            {renderMultiChipRow(
              RELATIONSHIP_GOAL_OPTIONS,
              draft.relationshipGoals,
              g => toggleRelationshipGoal(g as RelationshipGoal),
            )}
            {renderFieldLabel('Drinking')}
            {renderChipRow(
              DRINKING_OPTIONS,
              draft.drinking,
              v => patchDraft({ drinking: v as UserProfile['drinking'] }),
            )}
            {renderFieldLabel('Smoking')}
            {renderChipRow(
              SMOKING_OPTIONS,
              draft.smoking,
              v => patchDraft({ smoking: v as UserProfile['smoking'] }),
            )}
            {renderFieldLabel('Workout')}
            {renderChipRow(
              WORKOUT_OPTIONS,
              draft.workout,
              v => patchDraft({ workout: v as UserProfile['workout'] }),
            )}
            {renderFieldLabel('Pets')}
            {renderChipRow(
              PET_OPTIONS,
              draft.pets,
              v => patchDraft({ pets: v as UserProfile['pets'] }),
            )}
            {renderFieldLabel('Religion')}
            {renderChipRow(
              RELIGION_OPTIONS,
              draft.religion,
              v => patchDraft({ religion: v as UserProfile['religion'] }),
            )}
          </>
        );

      case 'passions':
        return (
          <>
            <View style={styles.chipRow}>
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
            {(draft.interests?.length ?? 0) < MIN_INTERESTS && (
              <BaseText
                variant="caption"
                color={theme.colors.primary}
                style={styles.hint}
                children={`Pick at least ${MIN_INTERESTS} passions`}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {visible ? (
        <SheetBlurBackdrop opacity={backdropOpacity} placement="underlay" />
      ) : null}
      <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
        <View style={styles.modalRoot} pointerEvents="box-none">
          <SheetDismissLayer onPress={() => closeSheet()} />

          <Animated.View
            style={[
              styles.sheet,
              {
                height: sheetHeight,
                paddingBottom: insets.bottom + metrics.spacing.md,
                backgroundColor: theme.colors.surface,
                transform: [{ translateY }],
              },
            ]}
          >
            <View {...panResponder.panHandlers} style={styles.handleArea}>
              <View
                style={[styles.handle, { backgroundColor: theme.custom.border }]}
              />
            </View>

          <View style={styles.sheetHeader}>
            <BaseText variant="h2" color={theme.custom.text} children={meta.title} />
            <BaseText
              variant="caption"
              color={theme.custom.textTertiary}
              children={meta.subtitle}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderContent()}
          </ScrollView>

          <View style={styles.footer}>
            <GradientButton label="Save" size="lg" onPress={handleSave} />
          </View>
        </Animated.View>
      </View>

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
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: metrics.radius['2xl'],
    borderTopRightRadius: metrics.radius['2xl'],
    ...metrics.shadows.lg,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  sheetHeader: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.md,
    gap: metrics.spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: metrics.spacing.lg,
    paddingBottom: metrics.spacing.lg,
  },
  fieldLabel: {
    fontWeight: '700',
    marginBottom: metrics.spacing.sm,
    marginTop: metrics.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.spacing.md,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    marginBottom: metrics.spacing.md,
  },
  bioInput: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  mediaHero: {
    alignItems: 'center',
    padding: metrics.spacing['2xl'],
    borderRadius: metrics.radius.xl,
    marginBottom: metrics.spacing.lg,
  },
  mediaHint: {
    marginTop: metrics.spacing.sm,
  },
  fullEditorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    padding: metrics.spacing.lg,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
  },
  hint: {
    marginTop: metrics.spacing.sm,
  },
  footer: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.sm,
  },
});
