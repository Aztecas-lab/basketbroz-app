import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SVGIcon from '../components/SVGIcon';
import useApi from '../hooks/useApi';
import useAuthUser from '../hooks/useAuthUser';
import { Routes } from '../route';

// import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfileEditScreen = () => {
  const { authUser } = useAuthUser();
  const { logout } = useApi();
  const safeAreaInset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const avatar = authUser?.avatar;
  const username = authUser?.username;
  const name = authUser?.name;

  const onAvatarPress = () => {};

  const onCameraIconPress = () => {};

  const handleUsernamePress = () => {
    navigation.navigate(Routes.UserProfileEditUsername);
  };

  const handleNicknamePress = () => {
    navigation.navigate(Routes.UserProfileEditNickname);
  };

  const onLogoutPress = async () => {
    setIsLoading(true);
    const result = await logout();
    setIsLoading(false);
    if (result.success) {
      InteractionManager.runAfterInteractions(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: Routes.AuthStack }],
        });
      });
    }
  };

  // const renderNavHeader = () => {
  //   return (
  //     <View style={{ width: '100%', height: 56, backgroundColor: '#000', alignItems: 'center', flexDirection: 'row' }}>
  //       <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.goBack()}>
  //         <SVGIcon svgProps={{ width: 24, height: 24 }} name={'ic_arrow_left'}></SVGIcon>
  //       </TouchableOpacity>
  //       <Text ellipsizeMode="tail" numberOfLines={1} style={styles.username}>
  //         {'Edit Profile'}
  //       </Text>
  //     </View>
  //   );
  // };

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
          style={{
            width: '100%',
            height: 56,
            backgroundColor: '#000',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text ellipsizeMode="tail" numberOfLines={1} style={{ ...styles.username, marginLeft: 16 }}>
            {''}
          </Text>
          <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.goBack()}>
            <SVGIcon svgProps={{ width: 24, height: 24 }} name={'ic_close'}></SVGIcon>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderSectionHeader = ({ title, style = {} }) => {
    return (
      <View style={{ ...style }}>
        <Text style={{ fontSize: 16, color: '#fff' }}>{title}</Text>
      </View>
    );
  };

  const renderSectionItem = ({ title, content, style, onPress }) => {
    return (
      <Pressable style={{ ...style, flex: 1 }} onPress={onPress}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ flex: 1, fontSize: 16, color: '#fff', marginTop: 8, marginBottom: 12 }}>{content}</Text>
          <SVGIcon name={'ic_arrow_right'} svgProps={{ width: 16, height: 16 }} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.background}>
      {renderNavHeader()}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {/* user info */}
          <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 20 }}>
            <View>
              <Pressable onPress={onAvatarPress}>
                <Image
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    backgroundColor: '#888',
                  }}
                  source={{ uri: avatar }}
                />
              </Pressable>
              {/* <TouchableOpacity activeOpacity={0.5} onPress={onCameraIconPress}>
                <SVGIcon
                  style={{ position: 'absolute', bottom: 0, right: 0 }}
                  svgProps={{ width: 24, height: 24 }}
                  name={'ic_camera'}
                />
              </TouchableOpacity> */}
            </View>
            <Text style={{ marginTop: 14, fontSize: 20, color: '#fff', fontWeight: '700' }}>{name}</Text>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255, 0.38)', marginTop: 4 }}>{`@${username}`}</Text>
          </View>

          {renderSectionHeader({ title: 'Personal Information', style: { marginTop: 16 } })}
          {renderSectionItem({
            title: 'Username',
            content: `@${username}`,
            style: { marginTop: 16 },
            onPress: handleUsernamePress,
          })}
          <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          {renderSectionItem({
            title: 'Name',
            content: name,
            style: { marginTop: 16 },
            onPress: handleNicknamePress,
          })}
          <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        </ScrollView>
        {authUser ? (
          <TouchableOpacity
            style={{
              marginTop: 24,
              height: 48,
              backgroundColor: '#CC301A',
              borderRadius: 24,
              marginBottom: safeAreaInset.bottom + 20,
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              setIsLoading(true);
              const result = await logout();
              setIsLoading(false);
              if (result.success) {
                InteractionManager.runAfterInteractions(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: Routes.AuthStack }],
                  });
                });
              }
            }}
            // onPress={async () => {

            //   await signOut();
            //   await disconnect();
            //   await AsyncStorage.removeItem('userId');
            //   navigation.replace('AuthStack');
            // }}
          >
            {!isLoading ? (
              <Text style={{ fontSize: 14, color: '#fff', fontWeight: '700' }}>Logout</Text>
            ) : (
              <ActivityIndicator animating color={'#000'} size={'small'} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#161616',
  },
  username: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    flexShrink: 1,
  },
  edit: {
    marginRight: 24,
    marginLeft: 24,
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  follow_num: {
    color: '#fff',
    fontSize: 18,
  },
  follow_label: {
    color: '#fff',
    fontSize: 11,
  },
});

export default UserProfileEditScreen;
