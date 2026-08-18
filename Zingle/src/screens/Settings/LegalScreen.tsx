import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useThemeStore } from '@stores';
import type { MainAppNavigationProp, MainAppStackParamList } from '@types';
import { metrics } from '@styling/metrics';
import { BaseText, SafeAreaContainer } from '@components/atoms';
import { ScreenHeader } from '@components/molecules';
import { LEGAL_DOCUMENTS } from '@constants/safety';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: metrics.spacing.lg,
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing['3xl'],
  },
  body: {
    lineHeight: 24,
  },
});

export const LegalScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation<MainAppNavigationProp>();
  const route = useRoute<RouteProp<MainAppStackParamList, 'Legal'>>();
  const doc = LEGAL_DOCUMENTS[route.params.document];

  return (
    <SafeAreaContainer>
      <ScreenHeader title={doc.title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <BaseText
          variant="body"
          color={theme.custom.textSecondary}
          style={styles.body}
          children={doc.body}
        />
      </ScrollView>
    </SafeAreaContainer>
  );
};
