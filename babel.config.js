module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // 其他插件...
        'react-native-reanimated/plugin', // 确保添加了这个插件，特别是如果你使用了 reanimated
      ],
    };
  };