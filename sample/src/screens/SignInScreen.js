import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  InteractionManager,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useConnection } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { Button, TextInput, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

// import SVGIcon from '../components/SVGIcon';
import SVGIcon from '../components/SVGIcon';
import Versions from '../components/Versions';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppAuth } from '../libs/authentication';
import { Routes } from '../libs/navigation';

const SignInScreen = () => {
  const title = 'Basketbro';
  const { navigation } = useAppNavigation();
  const { colors } = useUIKitTheme();
  const { connect } = useConnection();
  const { currentUser } = useSendbirdChat();

  const [userId, setUserId] = useState('jhlin');
  const [nickname, setNickname] = useState('jhlin');
  const [isLoading, setIsLoading] = useState(false);

  const { signOut } = useAppAuth();
  const { disconnect } = useConnection();

  useEffect(() => {
    if (currentUser != null) {
      InteractionManager.runAfterInteractions(() => {
        navigation.navigate(Routes.HomeStack);
      });
    }
  }, [currentUser]);

  const handleFacebookLogin = () => {
    login();
  };

  const handleAppleLogin = () => {
    login();
  };

  const handleGoogleLogin = () => {
    login();
  };

  const login = async () => {
    setIsLoading(true);
    connect(userId, { nickname: nickname })
      .then((resp) => console.log(resp))
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      <View style={{ flex: 3, flexDirection: 'column', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.logo} source={require('../assets/basketBroz.png')} />
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 40 }}>
        {isLoading ? (
          <ActivityIndicator color={'#fff'} animating />
        ) : (
          <>
            {currentUser != null ? (
              <Text style={{ color: '#fff' }}>{`Hi! ${currentUser.nickname}`}</Text>
            ) : (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={handleGoogleLogin}
                    style={{ ...styles.social_login_button, marginRight: 16 }}
                  >
                    <SVGIcon name={'ic-google'} svgProps={{ width: 30, height: 30 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFacebookLogin}
                    style={{ ...styles.social_login_button, marginRight: 16 }}
                  >
                    <SVGIcon name={'ic-facebook'} svgProps={{ width: 30, height: 30 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAppleLogin} style={styles.social_login_button}>
                    <SVGIcon name={'ic-apple'} svgProps={{ width: 30, height: 30 }} />
                  </TouchableOpacity>
                </View>
                <Text style={{ textAlign: 'center', marginTop: 12, color: '#fff' }}>
                  {`進入即表示已滿 18 歲且同意使用政策及隱私政策`}
                </Text>
              </>
            )}
          </>
        )}

        {currentUser ? (
          <Pressable
            onPress={async () => {
              await signOut();
              await disconnect();
            }}
          >
            <Text style={{ color: '#fff', marginTop: 20 }}>{'Sign out'}</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#222',
  },
  logo: {
    width: 24,
    height: 24,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
  },
  input: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  social_login_button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignInScreen;
