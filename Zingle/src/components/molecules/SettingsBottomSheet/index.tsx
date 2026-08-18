import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useThemeStore, useProfileStore } from '@stores';
import type { AppSettings } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { DISCOVERY_SETTINGS } from '@constants/membership';
import { BottomSheet } from '../BottomSheet';
import { SettingsGroup } from '../SettingsGroup';
import { SheetNavRow } from '../SheetNavRow';
import { SheetToggleRow } from '../SheetToggleRow';

interface SettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onOpenSafety: () => void;
  onOpenEditProfile: () => void;
  onOpenHelp: () => void;
  onOpenBlocked: () => void;
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
});

export const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = ({
  visible,
  onClose,
  onOpenSafety,
  onOpenEditProfile,
  onOpenHelp,
  onOpenBlocked,
  onLogout,
  onDeleteAccount,
}) => {
  const { theme } = useThemeStore();
  const { appSettings, updateAppSettings } = useProfileStore();
  const [draft, setDraft] = useState<AppSettings>(appSettings);

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

  return (
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
        {DISCOVERY_SETTINGS.map(item => (
          <SheetNavRow
            key={item.id}
            icon={item.icon}
            label={item.label}
            subtitle={item.value}
          />
        ))}
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
  );
};
