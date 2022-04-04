import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useConnection } from '@sendbird/uikit-react-native-core';
import { Button, Text, TextInput, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useAppAuth } from '../libs/authentication';

const SignInScreen: React.FC = () => {
  const [userId, setUserId] = useState('');

  const { connect } = useConnection({ autoPushTokenRegistration: true });
  const { signIn } = useAppAuth((user) => connect(user.userId));
  const { colors } = useUIKitTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image style={styles.logo} source={require('../assets/logoSendbird.png')} />
      <Text style={styles.title}>{'Sendbird RN-UIKit sample'}</Text>
      <TextInput
        placeholder={'User ID'}
        value={userId}
        onChangeText={setUserId}
        style={[styles.input, { backgroundColor: colors.onBackground04 }]}
      />
      <Button
        style={styles.btn}
        variant={'contained'}
        onPress={async () => {
          if (userId) {
            await signIn({ userId });
            await connect(userId);
          }
        }}
      >
        {'Sign in'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 24,
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

export default SignInScreen;
