/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const { getMetroTools, getMetroAndroidAssetsResolutionFix } = require('react-native-monorepo-tools');
const monorepoMetroTools = getMetroTools();
const androidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix();

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      publicPath: androidAssetsResolutionFix.publicPath,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    server: {
      enhanceMiddleware: (middleware) => {
        return androidAssetsResolutionFix.applyMiddleware(middleware);
      },
    },
    watchFolders: [...monorepoMetroTools.watchFolders, path.resolve(__dirname, '../node_modules')],
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      blockList: exclusionList(monorepoMetroTools.blockList),
      extraNodeModules: monorepoMetroTools.extraNodeModules,
      resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
    },
  };
})();
