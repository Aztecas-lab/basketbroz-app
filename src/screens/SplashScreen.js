import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, InteractionManager, StatusBar, View } from 'react-native';
import NativeSplashScreen from 'react-native-splash-screen';

import useApi from '../hooks/useApi';
import useAuthUser from '../hooks/useAuthUser';
import { Routes } from '../route';

const SplashScreen = () => {
  const { authToken } = useAuthUser();
  const { getUser } = useApi();
  const navigation = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const loginTimeoutTimer = useRef(null);
  const isDone = useRef(false);

  useEffect(() => {
    NativeSplashScreen.hide();
  }, []);

  useEffect(() => {
    if (loaded) {
      if (authToken == null) {
        setTimeout(() => {
          toSigninScreen();
        }, 2000);
      } else {
        // has stored token, we can skip sign in
        getAuthUser();
      }
    }
  }, [loaded, authToken]);

  const getAuthUser = async () => {
    loginTimeoutTimer.current = setTimeout(() => {
      loginTimeoutTimer.current = null;
      // api done faster
      if (isDone.current) {
        toHomeStack();
      } else {
        // do nothing
      }
    }, 1500);
    const result = await getUser();
    if (result.success) {
      isDone.current = true;
      // api done later
      if (loginTimeoutTimer.current == null) {
        toHomeStack();
      } else {
        // do nothing if api done faster
      }
    }
  };

  const toSigninScreen = () => {
    navigation.replace(Routes.AuthStack);
  };

  const toHomeStack = () => {
    InteractionManager.runAfterInteractions(() => {
      navigation.replace(Routes.HomeStack);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle={'light-content'} />
      <Image
        onLoad={() => {
          setLoaded(true);
        }}
        style={{ width: '80%', height: '80%' }}
        source={require('../assets/animation/boy1.gif')}
      />
    </View>
  );
};
export default SplashScreen;
