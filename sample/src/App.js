import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { APP_ID } from './env';
import { ClipboardService, FileService, GetTranslucent, MediaService, NotificationService } from './factory';
import useAppearance from './hooks/useAppearance';
import { Routes } from './libs/navigation';
import {
  ErrorInfoScreen,
  HomeScreen,
  OpenChannelListScreen,
  OpenChannelParticipantsScreen,
  OpenChannelScreen,
  OpenChannelSettingsScreen,
  SignInScreen,
  UserProfileEditScreen,
  UserProfileScreen,
} from './screens';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.SignIn}
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.SignIn} component={SignInScreen} />
      <Stack.Screen name={Routes.HomeStack} component={HomeStack} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home}
      screenOptions={{
        animationEnabled: true,
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.Home} component={HomeScreen} />
      <Stack.Screen name={Routes.OpenChannelListCommunity} component={OpenChannelListScreen} />
      <Stack.Screen name={Routes.OpenChannel} component={OpenChannelScreen} />
      <Stack.Screen name={Routes.OpenChannelSettings} component={OpenChannelSettingsScreen} />
      <Stack.Screen name={Routes.OpenChannelParticipants} component={OpenChannelParticipantsScreen} />
      <Stack.Screen options={{ presentation: 'modal' }} name={Routes.UserProfileStack} component={UserProfileStack} />
    </Stack.Navigator>
  );
};

const UserProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={Routes.UserProfileScreen}>
      <Stack.Screen name={Routes.UserProfile} component={UserProfileScreen} />
      <Stack.Screen name={Routes.UserProfileEdit} component={UserProfileEditScreen} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  // const { currentUser } = useSendbirdChat();
  // console.log('currentUser:', currentUser);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <AuthStack key={'AuthStack'} /> */}
        <Stack.Navigator
          screenOptions={{
            animationEnabled: false,
            headerShown: false,
          }}
        >
          <Stack.Screen name={Routes.AuthStack} component={AuthStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'dark';
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
      userProfile={{
        onCreateChannel: (channel) => {
          const params = { channelUrl: channel.url };
        },
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
