import { Text, TextInput } from 'react-native';
import { Fonts } from './globalStyles/typography';

const withDefaultFont = (Component: typeof Text | typeof TextInput) => {
  const current = (Component as unknown as { defaultProps?: { style?: object } })
    .defaultProps;
  (
    Component as unknown as { defaultProps: { style?: object } }
  ).defaultProps = {
    ...current,
    style: [{ fontFamily: Fonts.regular }, current?.style],
  };
};

withDefaultFont(Text);
withDefaultFont(TextInput);
