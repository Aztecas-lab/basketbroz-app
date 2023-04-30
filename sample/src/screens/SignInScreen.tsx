import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { useConnection } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { Button, Text, TextInput, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import Versions from '../components/Versions';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppAuth } from '../libs/authentication';
import { Routes } from '../libs/navigation';

const SignInScreen = () => {
  const { navigation } = useAppNavigation();
  const { colors } = useUIKitTheme();
  const { connect } = useConnection();
  const { currentUser } = useSendbirdChat();

  const [userId, setUserId] = useState('jhlin');
  const [nickname, setNickname] = useState('jhlin');
  const [isLoading, setIsLoading] = useState(false);

  const { signOut } = useAppAuth();
  const { disconnect } = useConnection();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image style={styles.logo} source={require('../assets/basketBroz.png')} />
      <Text style={styles.title}>{'BasketBroz'}</Text>

      {currentUser ? (
        <>
          <Button
            variant={'contained'}
            style={{
              width: '100%',
              paddingVertical: 16,
            }}
            onPress={() => {
              navigation.navigate(Routes.OpenChannelListCommunity);
            }}
          >
            {'Check Opening Games'}
          </Button>
          <Button
            variant={'contained'}
            style={{
              width: '100%',
              paddingVertical: 16,
              marginTop: 12,
            }}
            onPress={async () => {
              await signOut();
              await disconnect();
            }}
          >
            {'Sign out'}
          </Button>
        </>
      ) : (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder={'User ID'}
            value={userId}
            onChangeText={setUserId}
            style={[styles.input, { backgroundColor: colors.onBackground04, marginBottom: 12 }]}
          />
          <TextInput
            autoCapitalize="none"
            placeholder={'Nickname'}
            value={nickname}
            onChangeText={setNickname}
            style={[styles.input, { backgroundColor: colors.onBackground04 }]}
          />
          <Button
            style={styles.btn}
            variant={'contained'}
            onPress={async () => {
              setIsLoading(true);
              connect(userId, { nickname: nickname })
                .then((resp) => console.log(resp))
                .catch((error) => console.log(error))
                .finally(() => {
                  setIsLoading(false);
                });
            }}
          >
            {isLoading ? <ActivityIndicator animating color={'#fff'} /> : 'Sign in'}
          </Button>
        </>
      )}
      <Versions style={{ marginTop: 12 }} />
    </View>
  );
};

export default SignInScreen;

// import React, { useState } from 'react';
// import { Image, StyleSheet, View } from 'react-native';

// import { SessionHandler } from '@sendbird/chat';
// import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native';
// import { Button, Text, TextInput, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

// import Versions from '../components/Versions';
// import { SendbirdAPI } from '../factory';
// import { useAppAuth } from '../libs/authentication';

// const SignInScreen = () => {
//   const [userId, setUserId] = useState('');
//   const [nickname, setNickname] = useState('');

//   const { sdk } = useSendbirdChat();
//   const { connect } = useConnection();

//   const connectWith = async (userId: string, nickname?: string, useSessionToken = false) => {
//     if (useSessionToken) {
//       const sessionHandler = new SessionHandler();
//       sessionHandler.onSessionTokenRequired = (onSuccess, onFail) => {
//         SendbirdAPI.getSessionToken(userId)
//           .then(({ token }) => onSuccess(token))
//           .catch(onFail);
//       };
//       sdk.setSessionHandler(sessionHandler);

//       const data = await SendbirdAPI.getSessionToken(userId);
//       await connect(userId, { nickname, accessToken: data.token });
//     } else {
//       await connect(userId, { nickname });
//     }
//   };

//   const { loading, signIn } = useAppAuth((user) => connectWith(user.userId, user.nickname));
//   const { colors } = useUIKitTheme();

//   if (loading) return null;

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <Image style={styles.logo} source={require('../assets/basketBroz.png')} />
//       <Text style={styles.title}>{'BasketBroz'}</Text>
//       <TextInput
//         autoCapitalize="none"
//         placeholder={'User ID'}
//         value={userId}
//         onChangeText={setUserId}
//         style={[styles.input, { backgroundColor: colors.onBackground04, marginBottom: 12 }]}
//       />
//       <TextInput
//         autoCapitalize="none"
//         placeholder={'Nickname'}
//         value={nickname}
//         onChangeText={setNickname}
//         style={[styles.input, { backgroundColor: colors.onBackground04 }]}
//       />
//       <Button
//         style={styles.btn}
//         variant={'contained'}
//         onPress={async () => {
//           if (userId) {
//             await signIn({ userId, nickname });
//             await connectWith(userId, nickname);
//           }
//         }}
//       >
//         {'Sign in'}
//       </Button>

//       <Versions style={{ marginTop: 12 }} />
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 34,
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
});

// export default SignInScreen;
