import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSendbirdChat } from '@sendbird/uikit-react-native';

import SVGIcon from '../components/SVGIcon';

// import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfile = () => {
  const navigation = useNavigation();
  const { currentUser } = useSendbirdChat();
  const avatar = currentUser?.metaData?.avatar;

  const renderNavHeader = () => {
    return (
      <View style={{ width: '100%', height: 56, backgroundColor: '#000', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.goBack()}>
          <SVGIcon svgProps={{ width: 24, height: 24 }} name={'ic-close'}></SVGIcon>
        </TouchableOpacity>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.username}>
          {'@jh.lin'}
        </Text>
        <Text style={styles.edit}>{'Edit'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.background}>
      {renderNavHeader()}
      <View style={{ flex: 1, backgroundColor: '#222' }}>
        <ScrollView>
          {/* user info */}
          <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 14 }}>
            <Pressable onPress={() => {}}>
              <Image
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                }}
                source={{ uri: avatar }}
              />
            </Pressable>
            <Text style={{ marginTop: 14, fontSize: 14, color: '#fff', fontWeight: '700' }}>jh lin</Text>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255, 0.38)' }}>@jhlin</Text>

            <Text style={{ fontSize: 11, color: '#fff', paddingHorizontal: 40, marginTop: 30, textAlign: 'center' }}>
              {
                'Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.Hi, I’m Jane Doe.'
              }
            </Text>
            <SVGIcon style={{ marginTop: 16 }} name={'ic-arrow-down'} svgProps={{ width: 16, height: 16 }} />
          </View>

          {/* follow */}
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.follow_num}>533</Text>
              <Text style={styles.follow_label}>Followers</Text>
            </View>
            <SVGIcon style={{ marginHorizontal: 16 }} name="ic-separator" svgProps={{ width: 18, height: 18 }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.follow_num}>273</Text>
              <Text style={styles.follow_label}>Following</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
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
