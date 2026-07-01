import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';
import { BottomSheet } from '../BottomSheet';
import { POPULAR_CITIES } from '@constants/pickers';

interface CitySelectorSheetProps {
  visible: boolean;
  value?: string;
  onClose: () => void;
  onConfirm: (city: string) => void;
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
    marginBottom: metrics.spacing.md,
    gap: metrics.spacing.sm,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: metrics.spacing.xs,
  },
  list: {
    maxHeight: 280,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.sm,
    gap: metrics.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cityRowActive: {
    backgroundColor: 'rgba(255, 68, 88, 0.08)',
  },
  cityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityLabelBold: {
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  empty: {
    paddingVertical: metrics.spacing.xl,
    alignItems: 'center',
  },
});

export const CitySelectorSheet: React.FC<CitySelectorSheetProps> = ({
  visible,
  value,
  onClose,
  onConfirm,
}) => {
  const { theme } = useThemeStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(value || '');

  useEffect(() => {
    if (visible) {
      setQuery('');
      setSelected(value || '');
    }
  }, [visible, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_CITIES;
    return POPULAR_CITIES.filter(c => c.toLowerCase().includes(q));
  }, [query]);

  const handleConfirm = () => {
    const city = selected.trim() || query.trim();
    if (city) onConfirm(city);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Your city"
      subtitle="Find people near you"
      heightRatio={0.62}
      footer={
        <GradientButton
          label="Confirm city"
          size="lg"
          onPress={handleConfirm}
          disabled={!selected && !query.trim()}
        />
      }
    >
      <View
        style={[
          styles.searchWrap,
          {
            backgroundColor: theme.custom.surfaceVariant,
            borderColor: theme.custom.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={theme.custom.textTertiary}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search cities..."
          placeholderTextColor={theme.custom.textTertiary}
          style={[styles.searchInput, { color: theme.custom.text }]}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={theme.custom.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <BaseText
              variant="body"
              color={theme.custom.textSecondary}
              children="No cities found — type your city above"
            />
          </View>
        ) : (
          filtered.map(city => {
            const active = selected === city;
            return (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityRow,
                  { borderBottomColor: theme.custom.border },
                  active && styles.cityRowActive,
                ]}
                onPress={() => setSelected(city)}
              >
                <View
                  style={[
                    styles.cityIcon,
                    {
                      backgroundColor: active
                        ? theme.colors.primary
                        : theme.custom.surfaceVariant,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={18}
                    color={active ? '#FFFFFF' : theme.colors.primary}
                  />
                </View>
                <BaseText
                  variant="body"
                  color={active ? theme.colors.primary : theme.custom.text}
                  style={active ? styles.cityLabelBold : undefined}
                  children={city}
                />
                {active && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color={theme.colors.primary}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </BottomSheet>
  );
};
