import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@styling/globalStyles/typography';

const FONT_SIZE = 56;
const CLIP_HEIGHT = 34;

const styles = StyleSheet.create({
  clip: {
    height: CLIP_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.brand,
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE,
    letterSpacing: -1.6,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});

/** Cropped Tickerbit wordmark — same cut on landing and auth headers. */
export const BrandWordmark: React.FC = () => (
  <View style={styles.clip}>
    <Text numberOfLines={1} style={styles.text}>
      Zingle
    </Text>
  </View>
);
