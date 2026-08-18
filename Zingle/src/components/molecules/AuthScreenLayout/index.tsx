import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';
import { AuthBackground } from '../AuthBackground';

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
    paddingVertical: metrics.spacing.md,
    minHeight: 44,
  },
  backButton: {
    padding: metrics.spacing.xs,
    marginLeft: -metrics.spacing.xs,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    marginRight: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  formSection: {
    paddingTop: metrics.spacing['2xl'],
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
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={styles.logoWrap}>
          <BaseText variant="h1" color="#FFFFFF" style={styles.logo} children="Zingle" />
        </View>
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
