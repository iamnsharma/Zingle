/**
 * Zingle - Dating App
 * Main application entry point
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '@stores';
import { queryClient } from '@services/api';
import { RootNavigator } from '@navigation';

// Initialize i18n
import '@lang';

function App() {
  const { theme } = useThemeStore();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
            animated
          />
          <RootNavigator />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
