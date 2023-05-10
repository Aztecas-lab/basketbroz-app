import moment from 'moment';
import React from 'react';
import { FlatList, Image, Pressable, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useConnection } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { Button, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import HomeListItem from '../components/HomeListItem';
import SVGIcon from '../components/SVGIcon';
import Versions from '../components/Versions';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppAuth } from '../libs/authentication';
import { Routes } from '../libs/navigation';

const HomeScreen = () => {
  const { navigation } = useAppNavigation();
  const { currentUser } = useSendbirdChat();
  const { signOut } = useAppAuth();
  const { disconnect } = useConnection();
  const { select, colors } = useUIKitTheme();

  const getNextDays = (currentDay, numDays) => {
    let days = [];
    for (let i = 0; i <= numDays; i++) {
      let nextDay = moment(currentDay).add(i, 'days');
      days.push({ fullDay: nextDay, weekDay: nextDay.format('ddd'), day: nextDay.format('DD') });
    }
    return days;
  };

  const renderHeader = () => {
    const title = 'Basketbro';
    const avatar = currentUser?.metaData?.avatar;
    return (
      <View
        style={{
          height: 44,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 13,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.logo} source={require('../assets/basketBroz.png')} />
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate(Routes.UserProfileStack)}>
          <Image style={styles.avatar} source={{ uri: avatar }} />
        </Pressable>
      </View>
    );
  };

  const renderWeekDay = () => {
    const numDays = 6;
    const currentDay = new Date();
    const nextDays = getNextDays(currentDay, numDays);
    return (
      <View style={{ backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 20 }}>
        <Text style={{ fontSize: 20, color: '#fff' }}>{'Match Schedule'}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          {nextDays.map((item, index) => {
            const isCurrentDay = moment().isSame(item.fullDay, 'day');
            const textColor = isCurrentDay ? '#fff' : '#939598';
            const borderColor = isCurrentDay ? '#f00' : '#939598';
            const bgColor = isCurrentDay ? '#f00' : 'transparent';

            return (
              <View
                key={index.toString()}
                style={{
                  ...styles.capsule,
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 14, color: textColor }}>{item.weekDay}</Text>
                <Text style={{ fontSize: 16, marginTop: 4, fontWeight: '700', color: textColor }}>{item.day}</Text>
              </View>
            );
          })}
          <View style={styles.capsule}>
            <SVGIcon name={'ic-calendar'} svgProps={{ width: 24, height: 24 }} />
          </View>
        </View>
      </View>
    );
  };

  const renderTeamInfo = ({ teamName, awayHome, teamLogo }) => {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Image style={styles.event.team_logo} source={teamLogo}></Image>
        <Text style={styles.event.team_name}>{teamName}</Text>
        <Text style={styles.event.away_home}>{awayHome}</Text>
      </View>
    );
  };

  const renderGame = () => {
    const teamLogo1 = require('../assets/sample_team_1.png');
    const teamLogo2 = require('../assets/sample_team_2.png');
    return (
      <View style={styles.event.background}>
        <Text style={styles.event.name}>{'GAME NAME'}</Text>
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          {renderTeamInfo({ teamName: 'Team 1', teamLogo: teamLogo1, awayHome: 'Home' })}
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.event.score}>{'112 - 99'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <SVGIcon name={'ic-pts'} svgProps={{ width: 12, height: 12 }} />
              <Text style={styles.event.num_pts}>100</Text>
            </View>
          </View>
          {renderTeamInfo({ teamName: 'Team 2', teamLogo: teamLogo2, awayHome: 'Away' })}
        </View>
      </View>
    );
  };

  const renderSectionHeader = (title) => {
    return (
      <View style={{ alignSelf: 'center', marginBottom: 20 }}>
        <Text style={styles.event.date}>{title}</Text>
      </View>
    );
  };

  const renderSchedule = () => {
    const Data = [
      {
        title: moment().format('ddd, MMM DD'),
        data: [{ name: 'Game 01' }, { name: 'Game 02' }],
      },
      {
        title: moment().add(1, 'days').format('ddd, MMM DD'),
        data: [{ name: 'Game 01' }, { name: 'Game 02' }],
      },
    ];
    return (
      <View style={{ flex: 1, backgroundColor: '#222' }}>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={Data}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => renderGame()}
          ItemSeparatorComponent={(item, index) => <View style={{ height: 16, width: '100%' }} />}
          renderSectionHeader={({ section: { title } }) => renderSectionHeader(title)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={'light-content'} />
      {renderHeader()}
      {renderWeekDay()}
      {renderSchedule()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  capsule: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    flexGrow: 1,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#939598',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  section_title: {
    fontSize: 24,
  },
  event: {
    date: {
      fontSize: 12,
      fontWeight: '700',
      color: '#fffb',
      marginTop: 20,
    },
    background: {
      backgroundColor: '#000',
      borderRadius: 12,
      marginHorizontal: 20,
      padding: 16,
    },
    team_logo: {
      width: 72,
      height: 72,
    },
    team_name: {
      color: '#fff',
      marginTop: 8,
      fontSize: 14,
    },
    away_home: {
      color: '#fff',
      fontSize: 11,
      marginTop: 4,
    },
    name: {
      fontSize: 22,
      color: '#fff',
      alignSelf: 'center',
    },
    score: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
    },
    num_pts: {
      marginLeft: 4,
      color: '#fff',
      fontSize: 11,
    },
  },
});

export default HomeScreen;
