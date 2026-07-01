import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { useOnboardingStore } from '@stores/onboardingStore';
import { metrics } from '@styling/metrics';
import { BaseText, BaseInput } from '@components/atoms';
import {
  AnimatedInterestChip,
  SelectionCard,
  AgeSelectorSheet,
  HeightSelectorSheet,
  CitySelectorSheet,
} from '@components/molecules';
import {
  INTERESTS,
  INTEREST_ICONS,
  GENDER_OPTIONS,
  MIN_INTERESTS,
  type InterestName,
} from '@constants/onboarding';
import { formatHeight } from '@constants/pickers';

const styles = StyleSheet.create({
  container: {
    gap: metrics.spacing.lg,
  },
  stepHeader: {
    gap: metrics.spacing.sm,
    marginBottom: metrics.spacing.lg,
  },
  stepIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.xs,
  },
  inputContainer: {
    gap: metrics.spacing.sm,
  },
  inputLabel: {
    marginBottom: metrics.spacing.xs,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  counterBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    marginBottom: metrics.spacing.md,
  },
  photoGrid: {
    gap: metrics.spacing.sm,
  },
  photoRow: {
    flexDirection: 'row',
    gap: metrics.spacing.sm,
  },
  photoSlotWrap: {
    flex: 1,
  },
  photoSlot: {
    aspectRatio: 3 / 4,
    borderRadius: metrics.radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mainBadge: {
    position: 'absolute',
    bottom: metrics.spacing.sm,
    left: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: 2,
    borderRadius: metrics.radius.sm,
  },
  reviewCard: {
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    marginBottom: metrics.spacing.md,
    borderWidth: 1,
    ...metrics.shadows.md,
  },
  reviewHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    padding: metrics.spacing.lg,
    backgroundColor: 'rgba(255, 68, 88, 0.08)',
  },
  reviewAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  reviewAvatarText: {
    fontSize: 28,
    fontWeight: '800',
  },
  reviewHeroText: {
    flex: 1,
    gap: metrics.spacing.xs,
  },
  reviewHeroName: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  reviewHeroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
  },
  reviewHeroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: 3,
    borderRadius: metrics.radius.full,
  },
  reviewBody: {
    paddingHorizontal: metrics.spacing.md,
    paddingBottom: metrics.spacing.md,
  },
  reviewRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.xs,
  },
  reviewRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 88, 0.12)',
  },
  reviewRowContent: {
    flex: 1,
    gap: 2,
  },
  reviewRowValue: {
    fontWeight: '600',
  },
  reviewRowValueMuted: {
    opacity: 0.55,
    fontStyle: 'italic',
  },
  reviewDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 50,
  },
  reviewBioBox: {
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    marginTop: metrics.spacing.xs,
    borderLeftWidth: 3,
  },
  reviewBioText: {
    lineHeight: 22,
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.xs,
    paddingTop: metrics.spacing.sm,
    paddingBottom: metrics.spacing.xs,
  },
  reviewSectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 88, 0.12)',
  },
  reviewSectionTitle: {
    fontWeight: '700',
  },
  interestPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.xs,
    paddingBottom: metrics.spacing.sm,
  },
  interestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
  },
  interestPillLabel: {
    fontWeight: '600',
  },
  bioInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: metrics.spacing.xs,
  },
  counterEnough: {
    backgroundColor: 'rgba(255, 68, 88, 0.12)',
  },
  stepIconPrimaryBg: {
    backgroundColor: 'rgba(255, 68, 88, 0.12)',
  },
  counterTextBold: {
    fontWeight: '700',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    flex: 1,
  },
  selectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 88, 0.12)',
  },
  selectorTextWrap: {
    flex: 1,
  },
  selectorPlaceholder: {
    opacity: 0.5,
  },
});

const StepHeader: React.FC<{ iconName: string; title: string; subtitle: string }> = ({
  iconName,
  title,
  subtitle,
}) => {
  const { theme } = useThemeStore();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [iconName, title, fade]);

  return (
    <Animated.View style={[styles.stepHeader, { opacity: fade }]}>
      <View style={[styles.stepIconWrap, styles.stepIconPrimaryBg]}>
        <MaterialCommunityIcons
          name={iconName}
          size={26}
          color={theme.colors.primary}
        />
      </View>
      <BaseText variant="h2" color={theme.custom.text} children={title} />
      <BaseText variant="body" color={theme.custom.textSecondary} children={subtitle} />
    </Animated.View>
  );
};

const AnimatedField: React.FC<{
  index: number;
  children: React.ReactNode;
}> = ({ index, children }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

const PHOTO_ROWS = [
  [0, 1, 2],
  [3, 4, 5],
] as const;

const SelectorField: React.FC<{
  icon: string;
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
}> = ({ icon, label, value, placeholder, onPress }) => {
  const { theme } = useThemeStore();
  const hasValue = Boolean(value);

  return (
    <TouchableOpacity
      style={[
        styles.selectorRow,
        {
          borderColor: theme.custom.border,
          backgroundColor: theme.custom.surfaceVariant,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.selectorLeft}>
        <View
          style={styles.selectorIcon}
        >
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.selectorTextWrap}>
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children={label}
          />
          <BaseText
            variant="body"
            color={hasValue ? theme.custom.text : theme.custom.textTertiary}
            style={!hasValue ? styles.selectorPlaceholder : undefined}
            numberOfLines={1}
            children={hasValue ? value : placeholder}
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

export const OnboardingStep1: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();
  const [ageSheetOpen, setAgeSheetOpen] = useState(false);

  return (
    <View style={styles.container}>
      <StepHeader
        iconName="account-heart-outline"
        title="Let's get started"
        subtitle="What should we call you?"
      />
      <AnimatedField index={0}>
        <View style={styles.inputContainer}>
          <BaseText
            variant="body"
            color={theme.custom.text}
            style={styles.inputLabel}
            children="Full Name"
          />
          <BaseInput
            placeholder="Enter your full name"
            value={data.name || ''}
            onChangeText={name => updateData({ name })}
          />
        </View>
      </AnimatedField>
      <AnimatedField index={1}>
        <View style={styles.inputContainer}>
          <BaseText
            variant="body"
            color={theme.custom.text}
            style={styles.inputLabel}
            children="Age"
          />
          <SelectorField
            icon="cake-variant-outline"
            label="How old are you?"
            value={data.age ? `${data.age} years old` : undefined}
            placeholder="Tap to select age"
            onPress={() => setAgeSheetOpen(true)}
          />
        </View>
      </AnimatedField>

      <AgeSelectorSheet
        visible={ageSheetOpen}
        value={data.age}
        onClose={() => setAgeSheetOpen(false)}
        onConfirm={age => {
          updateData({ age });
          setAgeSheetOpen(false);
        }}
      />
    </View>
  );
};

export const OnboardingStep2: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();
  const [heightSheetOpen, setHeightSheetOpen] = useState(false);

  const heightLabel = data.height
    ? formatHeight(data.height, data.heightUnit || 'cm')
    : undefined;

  return (
    <View style={styles.container}>
      <StepHeader
        iconName="human-male-height-variant"
        title="About you"
        subtitle="Help others know you better"
      />
      <AnimatedField index={0}>
        <View style={styles.inputContainer}>
          <BaseText
            variant="body"
            color={theme.custom.text}
            style={styles.inputLabel}
            children="Height"
          />
          <SelectorField
            icon="human-male-height-variant"
            label="Your height"
            value={heightLabel}
            placeholder="Tap to select height"
            onPress={() => setHeightSheetOpen(true)}
          />
        </View>
      </AnimatedField>
      <AnimatedField index={1}>
        <BaseText
          variant="body"
          color={theme.custom.text}
          style={styles.inputLabel}
          children="I am a..."
        />
        <View style={styles.selectGrid}>
          {GENDER_OPTIONS.map((option, index) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              iconName={option.icon}
              selected={data.gender === option.id}
              onPress={() => updateData({ gender: option.id as any })}
              index={index}
            />
          ))}
        </View>
      </AnimatedField>

      <HeightSelectorSheet
        visible={heightSheetOpen}
        valueCm={data.height}
        onClose={() => setHeightSheetOpen(false)}
        onConfirm={(heightCm, unit) => {
          updateData({
            height: heightCm,
            heightUnit: unit,
          });
          setHeightSheetOpen(false);
        }}
      />
    </View>
  );
};

export const OnboardingStep3: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();
  const bioLength = (data.bio || '').length;

  return (
    <View style={styles.container}>
      <StepHeader
        iconName="text-box-outline"
        title="Your bio"
        subtitle="Make a great first impression"
      />
      <AnimatedField index={0}>
        <BaseInput
          placeholder="Write something fun about yourself..."
          value={data.bio || ''}
          onChangeText={bio => updateData({ bio })}
          multiline
          numberOfLines={5}
          style={styles.bioInput}
        />
        <BaseText
          variant="caption"
          color={
            bioLength >= 100 ? theme.colors.primary : theme.custom.textTertiary
          }
          style={styles.charCount}
          children={`${bioLength}/200`}
        />
      </AnimatedField>
    </View>
  );
};

export const OnboardingStep4: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();
  const selectedInterests = (data.interests || []) as string[];
  const count = selectedInterests.length;
  const isEnough = count >= MIN_INTERESTS;

  const handleToggleInterest = (interest: InterestName) => {
    if (selectedInterests.includes(interest)) {
      updateData({
        interests: selectedInterests.filter(i => i !== interest) as any,
      });
    } else {
      updateData({
        interests: [...selectedInterests, interest] as any,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StepHeader
        iconName="heart-multiple-outline"
        title="Your passions"
        subtitle="Pick at least 3 — show what makes you unique"
      />
      <View
        style={[
          styles.counterBadge,
          isEnough ? styles.counterEnough : { backgroundColor: theme.custom.surfaceVariant },
        ]}
      >
        <BaseText
          variant="caption"
          color={isEnough ? theme.colors.primary : theme.custom.textSecondary}
          style={styles.counterTextBold}
          children={`${count} selected${isEnough ? ' ✓' : ` · ${MIN_INTERESTS - count} more`}`}
        />
      </View>
      <View style={styles.chipsContainer}>
        {INTERESTS.map((interest, index) => (
          <AnimatedInterestChip
            key={interest}
            label={interest}
            iconName={INTEREST_ICONS[interest]}
            selected={selectedInterests.includes(interest)}
            onPress={() => handleToggleInterest(interest)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};

const PhotoSlot: React.FC<{ index: number; onPress: () => void }> = ({
  index,
  onPress,
}) => {
  const { theme } = useThemeStore();
  const anim = useRef(new Animated.Value(0)).current;
  const isMain = index === 0;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: index * 120,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  return (
    <Animated.View
      style={[
        styles.photoSlotWrap,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.photoSlot,
          {
            borderColor: isMain ? theme.colors.primary : theme.custom.border,
            backgroundColor: theme.custom.surfaceVariant,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isMain ? 'camera-plus' : 'plus'}
          size={isMain ? 32 : 24}
          color={theme.colors.primary}
        />
        {isMain && (
          <View
            style={[
              styles.mainBadge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <BaseText variant="caption" color="#FFFFFF" children="Main" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const OnboardingStep5: React.FC = () => {
  return (
    <View style={styles.container}>
      <StepHeader
        iconName="image-multiple-outline"
        title="Add photos"
        subtitle="Profiles with 3+ photos get 3× more matches"
      />
      <View style={styles.photoGrid}>
        {PHOTO_ROWS.map(row => (
          <View key={row.join('-')} style={styles.photoRow}>
            {row.map(index => (
              <PhotoSlot
                key={index}
                index={index}
                onPress={() => console.log('Open photo picker', index)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export const OnboardingStep6: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();
  const [citySheetOpen, setCitySheetOpen] = useState(false);

  const cityValue =
    typeof data.location === 'object' && data.location?.city
      ? data.location.city
      : undefined;

  return (
    <View style={styles.container}>
      <StepHeader
        iconName="map-marker-outline"
        title="Your location"
        subtitle="Find people nearby"
      />
      <AnimatedField index={0}>
        <View style={styles.inputContainer}>
          <BaseText
            variant="body"
            color={theme.custom.text}
            style={styles.inputLabel}
            children="City"
          />
          <SelectorField
            icon="map-marker-outline"
            label="Where do you live?"
            value={cityValue}
            placeholder="Tap to select city"
            onPress={() => setCitySheetOpen(true)}
          />
        </View>
      </AnimatedField>

      <CitySelectorSheet
        visible={citySheetOpen}
        value={cityValue}
        onClose={() => setCitySheetOpen(false)}
        onConfirm={city => {
          updateData({
            location: { latitude: 0, longitude: 0, city },
          });
          setCitySheetOpen(false);
        }}
      />
    </View>
  );
};

const ReviewRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  index: number;
  isEmpty?: boolean;
  showDivider?: boolean;
}> = ({ icon, label, value, index, isEmpty, showDivider = true }) => {
  const { theme } = useThemeStore();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      delay: index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  return (
    <>
      <Animated.View
        style={[
          styles.reviewRowItem,
          {
            opacity: anim,
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.reviewRowIcon}>
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.reviewRowContent}>
          <BaseText
            variant="caption"
            color={theme.custom.textTertiary}
            children={label}
          />
          <BaseText
            variant="body"
            color={isEmpty ? theme.custom.textTertiary : theme.custom.text}
            style={[
              styles.reviewRowValue,
              isEmpty && styles.reviewRowValueMuted,
            ]}
            children={value}
          />
        </View>
        {!isEmpty && (
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color={theme.colors.primary}
          />
        )}
      </Animated.View>
      {showDivider && (
        <View
          style={[styles.reviewDivider, { backgroundColor: theme.custom.border }]}
        />
      )}
    </>
  );
};

const getGenderIcon = (gender?: string): string => {
  const match = GENDER_OPTIONS.find(g => g.id === gender);
  return match?.icon || 'account-outline';
};

const getGenderLabel = (gender?: string): string => {
  const match = GENDER_OPTIONS.find(g => g.id === gender);
  if (match) return match.label;
  if (!gender) return 'Not provided';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

export const OnboardingStep7: React.FC = () => {
  const { theme } = useThemeStore();
  const { data } = useOnboardingStore();
  const interests = (data.interests as string[]) || [];

  const city =
    typeof data.location === 'object' && data.location?.city
      ? data.location.city
      : undefined;
  const initial = data.name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StepHeader
        iconName="check-decagram-outline"
        title="Looking good!"
        subtitle="Review your profile before going live"
      />

      <View
        style={[
          styles.reviewCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.custom.border,
          },
        ]}
      >
        <View style={styles.reviewHero}>
          <View
            style={[
              styles.reviewAvatar,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <BaseText
              variant="h2"
              color="#FFFFFF"
              style={styles.reviewAvatarText}
              children={initial}
            />
          </View>
          <View style={styles.reviewHeroText}>
            <BaseText
              variant="h2"
              color={theme.custom.text}
              style={styles.reviewHeroName}
              children={data.name || 'Your profile'}
            />
            <View style={styles.reviewHeroMeta}>
              {data.age ? (
                <View
                  style={[
                    styles.reviewHeroChip,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="cake-variant-outline"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <BaseText
                    variant="caption"
                    color={theme.custom.textSecondary}
                    children={`${data.age} yrs`}
                  />
                </View>
              ) : null}
              {city ? (
                <View
                  style={[
                    styles.reviewHeroChip,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <BaseText
                    variant="caption"
                    color={theme.custom.textSecondary}
                    numberOfLines={1}
                    children={city}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <MaterialCommunityIcons
            name="check-decagram"
            size={28}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.reviewBody}>
          <ReviewRow
            index={0}
            icon="account-outline"
            label="Full name"
            value={data.name || 'Not provided'}
            isEmpty={!data.name}
          />
          <ReviewRow
            index={1}
            icon="cake-variant-outline"
            label="Age"
            value={data.age ? `${data.age} years old` : 'Not provided'}
            isEmpty={!data.age}
          />
          <ReviewRow
            index={2}
            icon="human-male-height-variant"
            label="Height"
            value={
              data.height
                ? formatHeight(data.height, data.heightUnit || 'cm')
                : 'Not provided'
            }
            isEmpty={!data.height}
          />
          <ReviewRow
            index={3}
            icon={getGenderIcon(data.gender)}
            label="Gender"
            value={getGenderLabel(data.gender)}
            isEmpty={!data.gender}
          />
          <ReviewRow
            index={4}
            icon="map-marker-outline"
            label="Location"
            value={city || 'Not provided'}
            isEmpty={!city}
          />
          <ReviewRow
            index={5}
            icon="text-box-outline"
            label="Bio"
            value={
              data.bio
                ? `${data.bio.length} characters written`
                : 'Not provided'
            }
            isEmpty={!data.bio}
            showDivider={interests.length === 0}
          />

          {data.bio ? (
            <View
              style={[
                styles.reviewBioBox,
                {
                  backgroundColor: theme.custom.surfaceVariant,
                  borderLeftColor: theme.colors.primary,
                },
              ]}
            >
              <BaseText
                variant="body"
                color={theme.custom.textSecondary}
                style={styles.reviewBioText}
                children={`"${data.bio}"`}
              />
            </View>
          ) : null}

          {interests.length > 0 && (
            <>
              <View style={styles.reviewSectionHeader}>
                <View style={styles.reviewSectionIcon}>
                  <MaterialCommunityIcons
                    name="heart-multiple-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <BaseText
                  variant="bodyMedium"
                  color={theme.custom.text}
                  style={styles.reviewSectionTitle}
                  children={`${interests.length} interests`}
                />
              </View>
              <View style={styles.interestPreview}>
                {interests.map(interest => (
                  <View
                    key={interest}
                    style={[
                      styles.interestPill,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        INTEREST_ICONS[interest as InterestName] ||
                        'star-outline'
                      }
                      size={13}
                      color="#FFFFFF"
                    />
                    <BaseText
                      variant="caption"
                      color="#FFFFFF"
                      style={styles.interestPillLabel}
                      children={interest}
                    />
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
