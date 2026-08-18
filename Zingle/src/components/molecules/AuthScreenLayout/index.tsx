import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { AuthBackground } from '../AuthBackground';
import { BrandWordmark } from '../BrandWordmark';

interface AuthScreenLayoutProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  overlay: {
    paddingHorizontal: metrics.spacing.lg,
  },
  scrollGrow: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: metrics.spacing.sm,
    minHeight: 44,
  },
  backButton: {
    padding: metrics.spacing.xs,
    marginLeft: -metrics.spacing.xs,
    zIndex: 1,
  },
  wordmark: {
    alignItems: 'center',
    marginTop: metrics.spacing.md,
    marginBottom: metrics.spacing.xl,
  },
  formSection: {
    paddingTop: metrics.spacing.sm,
  },
  title: {
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    marginBottom: metrics.spacing['2xl'],
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
    minHeight: metrics.spacing['2xl'],
  },
});

export const AuthScreenLayout: React.FC<AuthScreenLayoutProps> = ({
  title,
  subtitle,
  onBack,
  footer,
  children,
}) => (
  <AuthBackground contentStyle={styles.overlay}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollGrow}
    >
      <View style={styles.topBar}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="chevron-left" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.wordmark}>
        <BrandWordmark />
      </View>

      <View style={styles.formSection}>
        <BaseText variant="h2" color="#FFFFFF" style={styles.title} children={title} />
        <BaseText
          variant="body"
          color="rgba(255, 255, 255, 0.75)"
          style={styles.subtitle}
          children={subtitle}
        />
        {children}
      </View>

      <View style={styles.spacer} />
      {footer}
    </ScrollView>
  </AuthBackground>
);
