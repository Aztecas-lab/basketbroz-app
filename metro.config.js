const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// const { getDefaultConfig } = require("metro-config");

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig();
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve("react-native-svg-transformer"),
//       experimentalImportSupport: false,
//       inlineRequires: true,
//     },
//     server: {
//       rewriteRequestUrl: (url) => {
//         if (!url.endsWith(".bundle")) {
//           return url;
//         }
//         // https://github.com/facebook/react-native/issues/36794
//         // JavaScriptCore strips query strings, so try to re-add them with a best guess.
//         return (
//           url +
//           "?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true"
//         );
//       }, // ...
//     },
//     resolver: {
//       assetExts: assetExts.filter((ext) => ext !== "svg"),
//       sourceExts: [...sourceExts, "svg"],
//     },
//   };
// })();
