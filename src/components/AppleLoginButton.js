import appleAuth from '@invertase/react-native-apple-authentication';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import SVGIcon from '../components/SVGIcon';

const AppleLoginButton = ({ onStart, onResult }) => {
  const onLoginPress = async () => {
    if (!appleAuth.isSupported) {
      console.log('Unsupported device');
      onResult?.({ success: false, error: 'Unsupported device' });
      return;
    }
    onStart?.();
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse:', appleAuthRequestResponse);

      const { user, email } = appleAuthRequestResponse;
      // get credentialState
      if (user == null) {
        console.warn('user is null');
        onResult?.({ success: false, error: 'No user return in the response' });
        return;
      }
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      console.log('getCredentialStateForUser', credentialState);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('User authorized');
        onResult?.({ success: true, ...appleAuthRequestResponse });
      } else {
        onResult?.({
          success: false,
          error: 'Credential not authorized:' + JSON.stringify(credentialState),
        });
      }
    } catch (e) {
      console.error('Catched exception:', e);
      onResult?.({ success: false, error: e });
    }
  };

  return (
    <TouchableOpacity
      onPress={onLoginPress}
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SVGIcon name={'ic_apple'} svgProps={{ width: 30, height: 30 }} />
    </TouchableOpacity>
  );
};

export default AppleLoginButton;
