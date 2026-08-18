import React from 'react';
import { StyleSheet, View, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '@stores';
import type { MainAppNavigationProp } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, SafeAreaContainer } from '@components/atoms';
import {
  ScreenHeader,
  SettingsGroup,
  SheetNavRow,
} from '@components/molecules';
import { HELP_FAQS } from '@constants/safety';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.lg,
    paddingBottom: metrics.spacing['3xl'],
    gap: metrics.spacing.lg,
  },
  sectionLabel: {
    fontWeight: '700',
    marginBottom: metrics.spacing.sm,
  },
  faqCard: {
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.md,
  },
  answer: {
    lineHeight: 20,
  },
});

export const HelpSupportScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<MainAppNavigationProp>();

  return (
    <SafeAreaContainer>
      <ScreenHeader title="Help & support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Common questions"
        />
        <SettingsGroup>
          {HELP_FAQS.map(item => (
            <View key={item.question} style={styles.faqCard}>
              <BaseText variant="bodyMedium" color={theme.custom.text} children={item.question} />
              <BaseText
                variant="body"
                color={theme.custom.textSecondary}
                style={styles.answer}
                children={item.answer}
              />
            </View>
          ))}
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Legal"
        />
        <SettingsGroup>
          <SheetNavRow
            icon="file-document-outline"
            label="Terms of Service"
            onPress={() => navigation.navigate('Legal', { document: 'terms' })}
          />
          <SheetNavRow
            icon="shield-lock-outline"
            label="Privacy Policy"
            onPress={() => navigation.navigate('Legal', { document: 'privacy' })}
          />
          <SheetNavRow
            icon="account-heart-outline"
            label="Community Guidelines"
            onPress={() => navigation.navigate('Legal', { document: 'guidelines' })}
          />
        </SettingsGroup>

        <BaseText
          variant="bodyMedium"
          color={theme.custom.textSecondary}
          style={styles.sectionLabel}
          children="Contact"
        />
        <SettingsGroup>
          <SheetNavRow
            icon="email-outline"
            label="Email support"
            subtitle="hello@zingle.app"
            onPress={() => Linking.openURL('mailto:hello@zingle.app')}
          />
        </SettingsGroup>
      </ScrollView>
    </SafeAreaContainer>
  );
};
