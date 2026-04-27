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
            '@context': './src/context'
          }
        }
      ]
    ],
  };
};
