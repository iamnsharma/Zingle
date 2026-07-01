import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';

interface AuthBackgroundProps {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export const AuthBackground: React.FC<AuthBackgroundProps> = ({
  children,
  contentStyle,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.custom.gradientAuthTinder}
        locations={theme.custom.gradientAuthTinderLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + metrics.spacing.md,
          },
          contentStyle,
        ]}
      >
        {children}
      </LinearGradient>
    </View>
  );
};
