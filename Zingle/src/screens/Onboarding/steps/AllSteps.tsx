import React, { useEffect, useRef } from 'react';
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
} from '@components/molecules';
import {
  INTERESTS,
  INTEREST_ICONS,
  GENDER_OPTIONS,
  MIN_INTERESTS,
  type InterestName,
} from '@constants/onboarding';

const styles = StyleSheet.create({
  container: {
    gap: metrics.spacing.lg,
  },
  stepHeader: {
    gap: metrics.spacing.xs,
    marginBottom: metrics.spacing.sm,
  },
  stepEmoji: {
    fontSize: 36,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.md,
  },
  photoSlot: {
    width: '30%',
    aspectRatio: 0.75,
    borderRadius: metrics.radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
  },
  reviewCard: {
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.lg,
    gap: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
  },
  reviewRow: {
    gap: metrics.spacing.xs,
  },
  interestPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
    marginTop: metrics.spacing.xs,
  },
  interestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
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
  counterTextBold: {
    fontWeight: '700',
  },
});

const StepHeader: React.FC<{ emoji: string; title: string; subtitle: string }> = ({
  emoji,
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
  }, [emoji, title, fade]);

  return (
    <Animated.View style={[styles.stepHeader, { opacity: fade }]}>
      <BaseText variant="h1" style={styles.stepEmoji} children={emoji} />
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

export const OnboardingStep1: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();

  return (
    <View style={styles.container}>
      <StepHeader
        emoji="👋"
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
          <BaseInput
            placeholder="Enter your age"
            value={data.age?.toString() || ''}
            onChangeText={age => updateData({ age: parseInt(age, 10) || 0 })}
            keyboardType="number-pad"
          />
        </View>
      </AnimatedField>
    </View>
  );
};

export const OnboardingStep2: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();

  return (
    <View style={styles.container}>
      <StepHeader
        emoji="📏"
        title="About you"
        subtitle="Help others know you better"
      />
      <AnimatedField index={0}>
        <View style={styles.inputContainer}>
          <BaseText
            variant="body"
            color={theme.custom.text}
            style={styles.inputLabel}
            children="Height (cm)"
          />
          <BaseInput
            placeholder="e.g. 175"
            value={data.height?.toString() || ''}
            onChangeText={height =>
              updateData({ height: parseInt(height, 10) || 0 })
            }
            keyboardType="number-pad"
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
        emoji="✍️"
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
        emoji="🎯"
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
      style={{
        opacity: anim,
        transform: [
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[
          styles.photoSlot,
          {
            borderColor: theme.custom.border,
            backgroundColor: theme.custom.surfaceVariant,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={index === 0 ? 'camera-plus' : 'plus'}
          size={28}
          color={theme.colors.primary}
        />
        {index === 0 && (
          <BaseText
            variant="caption"
            color={theme.custom.textSecondary}
            children="Main"
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const OnboardingStep5: React.FC = () => {
  return (
    <View style={styles.container}>
      <StepHeader
        emoji="📸"
        title="Add photos"
        subtitle="Profiles with 3+ photos get 3× more matches"
      />
      <View style={styles.photoGrid}>
        {[0, 1, 2, 3, 4, 5].map(index => (
          <PhotoSlot
            key={index}
            index={index}
            onPress={() => console.log('Open photo picker', index)}
          />
        ))}
      </View>
    </View>
  );
};

export const OnboardingStep6: React.FC = () => {
  const { theme } = useThemeStore();
  const { data, updateData } = useOnboardingStore();

  return (
    <View style={styles.container}>
      <StepHeader
        emoji="📍"
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
          <BaseInput
            placeholder="Enter your city"
            value={
              typeof data.location === 'object' && data.location?.city
                ? data.location.city
                : ''
            }
            onChangeText={city =>
              updateData({
                location: { latitude: 0, longitude: 0, city } as any,
              })
            }
          />
        </View>
      </AnimatedField>
    </View>
  );
};

const ReviewRow: React.FC<{
  label: string;
  value: string;
  index: number;
}> = ({ label, value, index }) => {
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
    <Animated.View
      style={[
        styles.reviewRow,
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
      <BaseText
        variant="caption"
        color={theme.custom.textTertiary}
        children={label}
      />
      <BaseText variant="body" color={theme.custom.text} children={value} />
    </Animated.View>
  );
};

export const OnboardingStep7: React.FC = () => {
  const { theme } = useThemeStore();
  const { data } = useOnboardingStore();
  const interests = (data.interests as string[]) || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StepHeader
        emoji="🎉"
        title="Looking good!"
        subtitle="Review your profile before going live"
      />

      <View
        style={[
          styles.reviewCard,
          { backgroundColor: theme.custom.surfaceVariant },
        ]}
      >
        <ReviewRow
          index={0}
          label="Name"
          value={data.name || 'Not provided'}
        />
        <ReviewRow
          index={1}
          label="Age"
          value={data.age ? `${data.age} years old` : 'Not provided'}
        />
        <ReviewRow
          index={2}
          label="Height"
          value={data.height ? `${data.height} cm` : 'Not provided'}
        />
        <ReviewRow
          index={3}
          label="Gender"
          value={
            data.gender
              ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1)
              : 'Not provided'
          }
        />
        <ReviewRow
          index={4}
          label="Location"
          value={
            typeof data.location === 'object' && data.location?.city
              ? data.location.city
              : 'Not provided'
          }
        />
        <ReviewRow
          index={5}
          label="Bio"
          value={data.bio || 'Not provided'}
        />

        {interests.length > 0 && (
          <Animated.View style={styles.reviewRow}>
            <BaseText
              variant="caption"
              color={theme.custom.textTertiary}
              children="Interests"
            />
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
                      INTEREST_ICONS[interest as InterestName] || 'star-outline'
                    }
                    size={12}
                    color="#FFFFFF"
                  />
                  <BaseText
                    variant="caption"
                    color="#FFFFFF"
                    children={interest}
                  />
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};
