import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SVGIcon from '../components/SVGIcon';
import useApi from '../hooks/useApi';
import useAuthUser from '../hooks/useAuthUser';

const UserProfileEditNickname = () => {
  const { authUser } = useAuthUser();
  const { updateUser } = useApi();
  const [input, setInput] = useState(authUser?.name);
  const [isLoading, setIsLoading] = useState(false);

  const safeAreaInset = useSafeAreaInsets();
  const navigation = useNavigation();

  const onSavePress = useCallback(async () => {
    setIsLoading(true);
    const result = await updateUser({ name: input });
    setIsLoading(false);
    if (result.success) {
      InteractionManager.runAfterInteractions(() => {
        navigation.goBack();
      });
    }
  }, [input]);

  const renderNavHeader = () => {
    return (
      <>
        <View
          style={{
            width: '100%',
            height: safeAreaInset.top,
            backgroundColor: '#000',
          }}
        />
        <View
          style={{ width: '100%', height: 56, backgroundColor: '#2c2c2c', alignItems: 'center', flexDirection: 'row' }}
        >
          <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.goBack()}>
            <SVGIcon svgProps={{ width: 24, height: 24 }} name={'ic_arrow_left'}></SVGIcon>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.background}>
      {renderNavHeader()}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ paddingHorizontal: 20, flex: 1 }}
      >
        <TouchableWithoutFeedback style={{ backgroundColor: '#f00' }} onPress={Keyboard.dismiss}>
          <View style={{ marginTop: 22, flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Name</Text>
            <View
              style={{
                color: '#fff',
                marginTop: 8,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: '#fff',
                flexDirection: 'row',
              }}
            >
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                cursorColor={'white'}
                multiline={false}
                editable={!isLoading}
                style={{
                  flex: 1,
                  margin: 0,
                  padding: 0,
                  color: '#fff',
                  fontSize: 20,
                }}
                value={input}
                onChangeText={(text) => setInput(text)}
              />
            </View>
            <TouchableOpacity
              disabled={isLoading}
              style={{
                marginTop: 32,
                height: 32,
                backgroundColor: '#fff',
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 50,
              }}
              onPress={onSavePress}
            >
              {!isLoading ? (
                <Text style={{ fontSize: 16, color: '#222', fontWeight: '700' }}>Save</Text>
              ) : (
                <ActivityIndicator animating color={'#000'} size={'small'} />
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#161616',
  },
});

export default UserProfileEditNickname;
