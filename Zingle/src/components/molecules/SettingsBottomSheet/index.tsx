import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore, useProfileStore } from '@stores';
import { useFilterStore, showMeLabel } from '@stores/filterStore';
import type { AppSettings, ProfileGender } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { GENDER_OPTIONS } from '@constants/onboarding';
import { AGE_MAX, AGE_MIN } from '@constants/pickers';
import { BottomSheet } from '../BottomSheet';
import { SettingsGroup } from '../SettingsGroup';
import { SheetNavRow } from '../SheetNavRow';
import { SheetToggleRow } from '../SheetToggleRow';
import { CitySelectorSheet } from '../CitySelectorSheet';
import { FilterRangeSlider } from '../FilterSliders';
import { SelectionCard } from '../SelectionCard';

interface SettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onOpenSafety: () => void;
  onOpenEditProfile: () => void;
  onOpenHelp: () => void;
  onOpenBlocked: () => void;
  onOpenLegal: (document: 'terms' | 'privacy' | 'guidelines') => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontWeight: '700',
    marginBottom: metrics.spacing.sm,
    marginTop: metrics.spacing.md,
  },
  first: {
    marginTop: 0,
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = ({
  visible,
  onClose,
  onOpenSafety,
  onOpenEditProfile,
  onOpenHelp,
  onOpenBlocked,
  onOpenLegal,
  onLogout,
  onDeleteAccount,
}) => {
  const { theme } = useThemeStore();
  const { appSettings, updateAppSettings, currentUser, updateCurrentUser } =
    useProfileStore();
  const { filters, updateFilters } = useFilterStore();
  const [draft, setDraft] = useState<AppSettings>(appSettings);
  const [cityOpen, setCityOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [showMeOpen, setShowMeOpen] = useState(false);

  useEffect(() => {
    if (visible) setDraft(appSettings);
  }, [visible, appSettings]);

  const patch = (updates: Partial<AppSettings>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const closeThen = (action: () => void) => {
    updateAppSettings(draft);
    onClose();
    action();
  };

  const handleSave = () => {
    updateAppSettings(draft);
    onClose();
  };

  const city = currentUser?.location?.city ?? filters.city;
  const ageLabel = `${filters.ageMin ?? 18} – ${filters.ageMax ?? 65}`;
  const showMe = filters.showMe ?? currentUser?.interestedIn ?? [];

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title="Settings"
        heightRatio={0.82}
        scrollable
        footer={<GradientButton label="Save settings" size="lg" onPress={handleSave} />}
      >
        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={[styles.sectionLabel, styles.first]}
          children="Appearance"
        />
        <SettingsGroup>
          <SheetToggleRow
            label="Liquid glass"
            description="Frosted glass style for buttons & icons"
            value={draft.liquidGlass}
            onValueChange={v => patch({ liquidGlass: v })}
          />
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Account"
        />
        <SettingsGroup>
          <SheetNavRow
            icon="account-edit-outline"
            label="Edit profile"
            subtitle="Photos, bio, and details"
            onPress={() => closeThen(onOpenEditProfile)}
          />
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Discovery"
        />
        <SettingsGroup>
          <SheetNavRow
            icon="map-marker-outline"
            label="Location"
            subtitle={city ?? 'Choose city'}
            onPress={() => setCityOpen(true)}
          />
          <SheetNavRow
            icon="account-outline"
            label="Age range"
            subtitle={ageLabel}
            onPress={() => setAgeOpen(true)}
          />
          <SheetNavRow
            icon="gender-male-female"
            label="Show me"
            subtitle={showMeLabel(showMe)}
            onPress={() => setShowMeOpen(true)}
          />
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Notifications"
        />
        <SettingsGroup>
          <SheetToggleRow
            label="Push notifications"
            description="Matches, messages, and likes"
            value={draft.pushNotifications}
            onValueChange={v => patch({ pushNotifications: v })}
          />
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Privacy & safety"
        />
        <SettingsGroup>
          <SheetNavRow
            icon="shield-lock-outline"
            label="Safety & Privacy"
            subtitle="Discovery, messaging, and visibility"
            onPress={() => closeThen(onOpenSafety)}
          />
          <SheetNavRow
            icon="account-cancel-outline"
            label="Blocked accounts"
            subtitle="Manage blocked users"
            onPress={() => closeThen(onOpenBlocked)}
          />
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Support"
        />
        <SettingsGroup>
          <SheetNavRow
            icon="help-circle-outline"
            label="Help & support"
            onPress={() => closeThen(onOpenHelp)}
          />
          <SheetNavRow
            icon="file-document-outline"
            label="Terms of Service"
            onPress={() => closeThen(() => onOpenLegal('terms'))}
          />
          <SheetNavRow
            icon="shield-account-outline"
            label="Privacy Policy"
            onPress={() => closeThen(() => onOpenLegal('privacy'))}
          />
          <SheetNavRow
            icon="account-heart-outline"
            label="Community Guidelines"
            onPress={() => closeThen(() => onOpenLegal('guidelines'))}
          />
          <SheetNavRow
            icon="logout"
            label="Log out"
            danger
            onPress={() => closeThen(onLogout)}
          />
          <SheetNavRow
            icon="trash-can-outline"
            label="Delete account"
            subtitle="Permanently remove your data"
            danger
            onPress={() => closeThen(onDeleteAccount)}
          />
        </SettingsGroup>
      </BottomSheet>

      <CitySelectorSheet
        visible={cityOpen}
        value={city}
        onClose={() => setCityOpen(false)}
        onConfirm={nextCity => {
          updateFilters({ city: nextCity });
          updateCurrentUser({
            location: {
              latitude: currentUser?.location?.latitude ?? 0,
              longitude: currentUser?.location?.longitude ?? 0,
              city: nextCity,
            },
          });
          setCityOpen(false);
        }}
      />

      <BottomSheet
        visible={ageOpen}
        onClose={() => setAgeOpen(false)}
        title="Age range"
        heightRatio={0.42}
        footer={
          <GradientButton label="Done" size="lg" onPress={() => setAgeOpen(false)} />
        }
      >
        <FilterRangeSlider
          label="Show ages"
          minValue={filters.ageMin ?? 18}
          maxValue={filters.ageMax ?? 65}
          min={AGE_MIN}
          max={AGE_MAX}
          formatRange={(minVal, maxVal) => `${minVal} – ${maxVal}`}
          onChange={(ageMin, ageMax) => updateFilters({ ageMin, ageMax })}
        />
      </BottomSheet>

      <BottomSheet
        visible={showMeOpen}
        onClose={() => setShowMeOpen(false)}
        title="Show me"
        heightRatio={0.5}
        footer={
          <GradientButton
            label="Done"
            size="lg"
            onPress={() => setShowMeOpen(false)}
          />
        }
      >
        <View style={styles.genderGrid}>
          {GENDER_OPTIONS.map(option => {
            const selected = showMe.includes(option.id as ProfileGender);
            return (
              <SelectionCard
                key={option.id}
                label={option.label}
                iconName={option.icon}
                selected={selected}
                onPress={() => {
                  const id = option.id as ProfileGender;
                  const next = selected
                    ? showMe.filter(item => item !== id)
                    : [...showMe, id];
                  updateFilters({ showMe: next });
                  updateCurrentUser({ interestedIn: next });
                }}
              />
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
};
