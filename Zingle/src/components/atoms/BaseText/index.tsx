import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeStore } from '@stores';
import { textVariants } from '@styling/globalStyles/typography';

interface BaseTextProps extends TextProps {
  variant?: keyof typeof textVariants;
  color?: string;
  children: React.ReactNode;
}

export const BaseText = React.forwardRef<Text, BaseTextProps>(
  ({ variant = 'body', color, style, ...props }, ref) => {
    const { theme } = useThemeStore();
    const variantStyle = textVariants[variant];
    const textColor = color || theme.colors.onSurface;

    return (
      <Text
        ref={ref}
        {...props}
        style={[
          // variantStyle,
          { color: textColor },
          style,
        ]}
      />
    );
  }
);

BaseText.displayName = 'BaseText';
