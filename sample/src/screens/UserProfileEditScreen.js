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

import SVGIcon from '../components/SVGIcon';

// import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfileEditScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useSendbirdChat();
  const avatar = currentUser?.metaData?.avatar;

  const onAvatarPress = () => {};

  const onCameraIconPress = () => {};

  const renderNavHeader = () => {
    return (
      <View style={{ width: '100%', height: 56, backgroundColor: '#000', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.goBack()}>
          <SVGIcon svgProps={{ width: 24, height: 24 }} name={'ic-arrow-left'}></SVGIcon>
        </TouchableOpacity>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.username}>
          {'Edit Profile'}
        </Text>
      </View>
    );
  };

  const renderSectionHeader = ({ title, style = {} }) => {
    return (
      <View style={{ ...style }}>
        <Text style={{ fontSize: 14, color: '#fff' }}>{title}</Text>
      </View>
    );
  };

  const renderSectionItem = ({ title, content, style }) => {
    return (
      <View style={{ ...style, flex: 1 }}>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ flex: 1, fontSize: 14, color: '#fff', marginTop: 8, marginBottom: 12 }}>{content}</Text>
          <SVGIcon name={'ic-arrow-right'} svgProps={{ width: 16, height: 16 }} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.background}>
      {renderNavHeader()}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
          {/* user info */}
          <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 14 }}>
            <View>
              <Pressable onPress={onAvatarPress}>
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                  }}
                  source={{ uri: avatar }}
                />
              </Pressable>
              <TouchableOpacity activeOpacity={0.5} onPress={onCameraIconPress}>
                <SVGIcon
                  style={{ position: 'absolute', bottom: 0, right: 0 }}
                  svgProps={{ width: 24, height: 24 }}
                  name={'ic-camera'}
                />
              </TouchableOpacity>
            </View>
            <Text style={{ marginTop: 14, fontSize: 14, color: '#fff', fontWeight: '700' }}>jh lin</Text>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255, 0.38)' }}>@jhlin</Text>
          </View>

          <View style={{ marginTop: 14, flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          {renderSectionHeader({ title: '個人資訊', style: { marginTop: 16 } })}
          {renderSectionItem({ title: '用戶名稱', content: '@JaneDoe', style: { marginTop: 16 } })}
          {renderSectionItem({ title: '用戶名稱', content: '@JaneDoe', style: { marginTop: 16 } })}
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

export default UserProfileEditScreen;
