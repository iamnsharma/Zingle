import React from 'react';
import { Alert } from 'react-native';
import { BottomSheet } from '../BottomSheet';
import { SettingsGroup } from '../SettingsGroup';
import { SheetNavRow } from '../SheetNavRow';

interface UserActionsSheetProps {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onReport: () => void;
  onBlock: () => void;
}

export const UserActionsSheet: React.FC<UserActionsSheetProps> = ({
  visible,
  userName,
  onClose,
  onReport,
  onBlock,
}) => {
  const confirmBlock = () => {
    Alert.alert(
      `Block ${userName}?`,
      'They won’t appear in discovery or chat. You can unblock them later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            onClose();
            onBlock();
          },
        },
      ],
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={userName}
      subtitle="Safety tools"
      heightRatio={0.38}
    >
      <SettingsGroup>
        <SheetNavRow
          icon="flag-outline"
          label="Report"
          subtitle="Fake profile, harassment, spam, or other"
          onPress={() => {
            onClose();
            onReport();
          }}
        />
        <SheetNavRow
          icon="account-cancel-outline"
          label="Block"
          subtitle="Hide this profile and prevent chat"
          danger
          onPress={confirmBlock}
        />
      </SettingsGroup>
    </BottomSheet>
  );
};
