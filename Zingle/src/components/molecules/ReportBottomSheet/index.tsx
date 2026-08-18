import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { REPORT_REASONS, type ReportReason } from '@constants/safety';
import { BottomSheet } from '../BottomSheet';

interface ReportBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason) => void;
}

const styles = StyleSheet.create({
  list: {
    gap: metrics.spacing.sm,
    paddingBottom: metrics.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    gap: metrics.spacing.md,
  },
  label: {
    flex: 1,
    fontWeight: '600',
  },
});

export const ReportBottomSheet: React.FC<ReportBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const { theme } = useThemeStore();
  const [selected, setSelected] = useState<ReportReason | null>(null);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="Report"
      subtitle="Why are you reporting this profile?"
      heightRatio={0.62}
      footer={
        <GradientButton
          label="Submit report"
          size="lg"
          disabled={!selected}
          onPress={() => {
            if (!selected) return;
            onSubmit(selected);
            setSelected(null);
          }}
        />
      }
    >
      <View style={styles.list}>
        {REPORT_REASONS.map(reason => {
          const active = selected === reason.id;
          return (
            <TouchableOpacity
              key={reason.id}
              activeOpacity={0.8}
              onPress={() => setSelected(reason.id)}
              style={[
                styles.row,
                {
                  borderColor: active ? theme.colors.primary : theme.custom.border,
                  backgroundColor: active
                    ? theme.colors.primary + '14'
                    : theme.custom.surfaceVariant,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={reason.icon}
                size={22}
                color={active ? theme.colors.primary : theme.custom.textSecondary}
              />
              <BaseText
                variant="body"
                color={theme.custom.text}
                style={styles.label}
                children={reason.label}
              />
              {active ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={22}
                  color={theme.colors.primary}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
};
