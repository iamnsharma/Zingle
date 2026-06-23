module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@services': './src/services',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@styling': './src/styling',
          '@assets': './src/assets',
          '@lang': './src/lang',
          '@types': './src/types',
          '@stores': './src/stores',
          '@config': './src/config',
          '@constants': './src/constants',
        },
      },
    ],
  ],
};
