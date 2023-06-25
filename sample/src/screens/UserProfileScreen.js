import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Fragment } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { useConnection } from '@sendbird/uikit-react-native';

import SVGIcon from '../components/SVGIcon';
import { useAppAuth } from '../libs/authentication';
import { Routes } from '../libs/navigation';

// import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfile = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { currentUser } = useSendbirdChat();
  const { signOut } = useAppAuth();
  const { disconnect } = useConnection();
  const avatar = currentUser?.metaData?.avatar;
  const userId = `@${currentUser?.userId}`;
  const socialAppSize = (width - 100 - 24) / 2;

  const onEditPress = () => {
    navigation.navigate(Routes.UserProfileEdit);
  };

  const renderNavHeader = () => {
    return (
      <View style={{ width: '100%', height: 56, backgroundColor: '#000', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.goBack()}>
          <SVGIcon svgProps={{ width: 24, height: 24 }} name={'ic_close'}></SVGIcon>
        </TouchableOpacity>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.username}>
          {userId}
        </Text>
        <TouchableOpacity
          hitSlop={{ bottom: 20, top: 20, right: 20, left: 20 }}
          activeOpacity={0.5}
          onPress={onEditPress}
        >
          <Text style={styles.edit}>{'Edit'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSocialApps = (sns, icon, onPress) => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          width: socialAppSize,
          height: socialAppSize,
          borderRadius: 24,
          backgroundColor: '#393939',
          marginTop: 24,
          padding: 18,
          justifyContent: 'space-between',
        }}
      >
        {icon}
        <Text style={{ color: '#fff', fontSize: 11 }}>{userId}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.background}>
      {renderNavHeader()}
      <View style={{ flex: 1 }}>
        <ScrollView>
          {/* user info */}
          <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 14 }}>
            <Pressable onPress={() => {}}>
              <Image
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: '#888',
                }}
                source={{ uri: avatar }}
              />
            </Pressable>
            <Text style={{ marginTop: 14, fontSize: 14, color: '#fff', fontWeight: '700' }}>
              {currentUser?.nickname}
            </Text>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255, 0.38)' }}>{userId}</Text>

            <Text style={{ fontSize: 11, color: '#fff', paddingHorizontal: 40, marginTop: 30, textAlign: 'center' }}>
              {
                'Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.'
              }
            </Text>
            <SVGIcon style={{ marginTop: 16 }} name={'ic_arrow_down'} svgProps={{ width: 16, height: 16 }} />
          </View>

          {/* follow */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.follow_num}>533</Text>
                <Text style={styles.follow_label}>Followers</Text>
              </View>
              <SVGIcon style={{ marginHorizontal: 16 }} name="ic_separator" svgProps={{ width: 18, height: 18 }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.follow_num}>273</Text>
                <Text style={styles.follow_label}>Following</Text>
              </View>
            </View>
            <Pressable
              style={{
                marginTop: 24,
                height: 32,
                width: 200,
                backgroundColor: '#fff',
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#222' }}>Follow</Text>
            </Pressable>
          </View>

          {/* Social Apps */}
          <View
            style={{ paddingHorizontal: 50, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
          >
            {renderSocialApps(
              'sns_ig',
              <Image style={{ width: 36, height: 36 }} source={require('../assets/sns_ig.png')}></Image>,
            )}
            {renderSocialApps(
              'sns_yt',
              <Image style={{ width: 36, height: 36 }} source={require('../assets/sns_yt.png')}></Image>,
            )}
            {renderSocialApps(
              'sus_fb',
              <Image style={{ width: 36, height: 36 }} source={require('../assets/sns_fb.png')}></Image>,
            )}
            {renderSocialApps(
              'sns_twitter',
              <Image style={{ width: 36, height: 36 }} source={require('../assets/sns_twitter.png')}></Image>,
            )}
          </View>

          {currentUser ? (
            <TouchableOpacity
              style={{ alignSelf: 'center', marginBottom: 50, marginTop: 16 }}
              onPress={async () => {
                await signOut();
                await disconnect();
                await AsyncStorage.removeItem('userId');
                navigation.replace('AuthStack');
              }}
            >
              <Text style={{ color: '#f00', marginTop: 20 }}>{'Sign out'}</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
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

export default UserProfile;
