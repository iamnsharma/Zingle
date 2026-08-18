import React from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useProfileStore } from '@stores';
import type { UserProfile } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, GradientButton } from '@components/atoms';

interface ItsAMatchModalProps {
  visible: boolean;
  profile?: UserProfile;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    paddingHorizontal: metrics.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: metrics.spacing.xl,
  },
  photos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing['2xl'],
  },
  photo: {
    width: 128,
    height: 168,
    borderRadius: metrics.radius.xl,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  photoLeft: {
    transform: [{ rotate: '-8deg' }, { translateX: 12 }],
  },
  photoRight: {
    transform: [{ rotate: '8deg' }, { translateX: -12 }],
  },
  actions: {
    width: '100%',
    gap: metrics.spacing.md,
  },
  keep: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.md,
  },
});

export const ItsAMatchModal: React.FC<ItsAMatchModalProps> = ({
  visible,
  profile,
  onSendMessage,
  onKeepSwiping,
}) => {
  const { theme } = useThemeStore();
  const me = useProfileStore(state => state.currentUser);
  const insets = useSafeAreaInsets();

  if (!profile) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={theme.custom.gradientAuthTinder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        />
        <View
          style={[
            styles.sheet,
            {
              paddingTop: insets.top + metrics.spacing['2xl'],
              paddingBottom: insets.bottom + metrics.spacing.xl,
            },
          ]}
        >
          <BaseText
            variant="display"
            color="#FFFFFF"
            style={styles.title}
            children="It's a Match!"
          />
          <BaseText
            variant="body"
            color="rgba(255,255,255,0.85)"
            style={styles.subtitle}
            children={`You and ${profile.name} liked each other`}
          />
          <View style={styles.photos}>
            <Image
              source={{ uri: me?.photos?.[0] ?? profile.photos[0] }}
              style={[styles.photo, styles.photoLeft]}
            />
            <Image
              source={{ uri: profile.photos[0] }}
              style={[styles.photo, styles.photoRight]}
            />
          </View>
          <View style={styles.actions}>
            <GradientButton
              label="Send message"
              size="lg"
              onPress={onSendMessage}
            />
            <TouchableOpacity style={styles.keep} onPress={onKeepSwiping}>
              <BaseText variant="body" color="#FFFFFF" children="Keep swiping" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
