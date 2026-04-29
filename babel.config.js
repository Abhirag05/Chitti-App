module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@src': './src',
            '@components': './src/components',
            '@services': './src/services',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@screens': './src/screens',
            '@types': './src/types',
            '@constants': './src/constants'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
