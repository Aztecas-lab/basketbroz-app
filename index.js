import React from 'react';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import AppRoot from './src/App';

const App = AppRoot;
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) return null;
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
