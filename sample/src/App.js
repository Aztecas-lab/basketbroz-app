import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { APP_ID } from './env';
import { ClipboardService, FileService, GetTranslucent, MediaService, NotificationService, RootStack } from './factory';
import useAppearance from './hooks/useAppearance';
import { Routes } from './libs/navigation';
import {
  ErrorInfoScreen,
  OpenChannelListScreen,
  OpenChannelParticipantsScreen,
  OpenChannelScreen,
  OpenChannelSettingsScreen,
  SignInScreen,
} from './screens';

const Navigation = () => {
  // const { currentUser } = useSendbirdChat();
  // console.log('currentUser:', currentUser);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={Routes.SignIn} component={SignInScreen} />
        <RootStack.Group>
          <RootStack.Screen name={Routes.OpenChannelListCommunity} component={OpenChannelListScreen} />
          <RootStack.Screen name={Routes.OpenChannel} component={OpenChannelScreen} />
          <RootStack.Screen name={Routes.OpenChannelSettings} component={OpenChannelSettingsScreen} />
          <RootStack.Screen name={Routes.OpenChannelParticipants} component={OpenChannelParticipantsScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';
  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      chatOptions={{ localCacheStorage: AsyncStorage }}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
      styles={{
        defaultHeaderTitleAlign: 'left', //'center',
        theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
        statusBarTranslucent: GetTranslucent(),
      }}
      errorBoundary={{ ErrorInfoComponent: ErrorInfoScreen }}
    >
      <Navigation />
    </SendbirdUIKitContainer>
  );
};

export default App;
