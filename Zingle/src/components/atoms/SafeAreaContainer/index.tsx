import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores';

interface SafeAreaContainerProps extends ViewProps {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style: customStyle,
  ...props
}) => {
  const { theme } = useThemeStore();

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        customStyle,
      ]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};
