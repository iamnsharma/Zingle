import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { SheetBlurBackdrop, SheetDismissLayer } from '../SheetBlurBackdrop';

export type AttachmentType =
  | 'gallery'
  | 'camera'
  | 'document'
  | 'location'
  | 'contact'
  | 'audio';

interface AttachmentOption {
  id: AttachmentType;
  label: string;
  icon: string;
  color: string;
}

const OPTIONS: AttachmentOption[] = [
  { id: 'gallery', label: 'Gallery', icon: 'image-multiple', color: '#A64CED' },
  { id: 'camera', label: 'Camera', icon: 'camera', color: '#FF4458' },
  { id: 'document', label: 'Document', icon: 'file-document', color: '#5B6CF0' },
  { id: 'location', label: 'Location', icon: 'map-marker', color: '#22B573' },
  { id: 'contact', label: 'Contact', icon: 'account', color: '#0099FF' },
  { id: 'audio', label: 'Audio', icon: 'headphones', color: '#FF8A3D' },
];

interface AttachmentSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (type: AttachmentType) => void;
}

export const AttachmentSheet: React.FC<AttachmentSheetProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(screenHeight);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, screenHeight, translateY, backdropOpacity]);

  const close = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      cb?.();
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <>
      <SheetBlurBackdrop opacity={backdropOpacity} placement="underlay" />
      <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
        <View style={styles.root} pointerEvents="box-none">
          <SheetDismissLayer onPress={() => close()} />

          <Animated.View
            style={[
              styles.sheet,
              {
                paddingBottom: insets.bottom + metrics.spacing.lg,
                backgroundColor: theme.colors.surface,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: theme.custom.border }]} />

            <View style={styles.grid}>
              {OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.option}
                  activeOpacity={0.8}
                  onPress={() => close(() => onSelect?.(opt.id))}
                >
                  <View style={[styles.iconCircle, { backgroundColor: opt.color }]}>
                    <MaterialCommunityIcons name={opt.icon} size={26} color="#FFFFFF" />
                  </View>
                  <BaseText
                    color={theme.custom.textSecondary}
                    style={styles.optionLabel}
                    children={opt.label}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const COLUMN = '33.33%';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: metrics.radius['2xl'],
    borderTopRightRadius: metrics.radius['2xl'],
    paddingTop: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    ...metrics.shadows.lg,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: metrics.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    width: COLUMN,
    alignItems: 'center',
    marginBottom: metrics.spacing.lg,
    gap: metrics.spacing.sm,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
