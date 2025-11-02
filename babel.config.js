module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@models': './src/models',
            '@viewmodels': './src/viewmodels',
            '@views': './src/views',
            '@services': './src/services',
            '@utils': './src/utils'
          }
        }
      ]
    ]
  };
};
