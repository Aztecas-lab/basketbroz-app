import moment from 'moment';
import React, {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOpenChannelList } from '@sendbird/uikit-chat-hooks';
import { useConnection } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { Button, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import HomeListItem from '../components/HomeListItem';
import SVGIcon from '../components/SVGIcon';
import Versions from '../components/Versions';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppAuth } from '../libs/authentication';
import { Routes } from '../libs/navigation';

const mainColor = '#CC301A';
const CustomCalendar = forwardRef((props, ref) => {
  const [selected, setSelected] = useState(props?.selectedDay);
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const transY = useRef(new Animated.Value(0)).current;

  const marked = useMemo(() => {
    console.log('marked change:', selected);
    return {
      [selected]: {
        selected: true,
        selectedTextColor: '#fff',
        customStyles: {
          container: {
            // ...your awesome styles
            backgroundColor: mainColor,
          },
        },
        payload: {
          selected: true,
          game: {
            name: '123',
          },
        },
      },
    };
  }, [selected]);

  // useEffect(() => {
  //   if (props.selectedDay != null) {
  //     // react-native-calendar accepts only 'YYYY-MM-DD'
  //     setSelected(props.selectedDay.format('YYYY-MM-DD'));
  //   }
  // }, [props.selectedDay]);

  const onDayPress = useCallback((day) => {
    console.log(day);
    setSelected(day.dateString);
  }, []);

  const show = (param) => {
    const { top = 0 } = param;
    setTop(top);
    setVisible((prev) => !prev);
    Animated.timing(transY, { toValue: 1, useNativeDriver: true, duration: 300 }).start();
  };

  useImperativeHandle(ref, () => ({
    show: (param) => show(param),
  }));

  const handleHideCalendar = () => {
    Animated.timing(transY, { toValue: 0, useNativeDriver: true }).start(() => {
      setVisible(false);
      transY.setValue(0);
    });
    // setVisible(false);
  };

  const handleCalendarConfirm = () => {
    Animated.timing(transY, { toValue: 0, useNativeDriver: true }).start(() => {
      setVisible(false);
      transY.setValue(0);
    });
    console.log('press OK selected:', selected);
    props?.onDaySelected?.(selected);
    // setVisible(false);
  };

  return (
    <Animated.View
      style={{
        top: 0,
        position: 'absolute',
        width: '100%',
        display: visible ? 'flex' : 'none',
        height: '100%',
        // backgroundColor: '#0005',
        opacity: transY,
        // transform: [{ translateY: transY }],
      }}
    >
      <Pressable onPress={handleHideCalendar} style={{ backgroundColor: '#0005', height: top }} />
      <Calendar
        // markingType="custom"
        hideExtraDays={true}
        renderArrow={(direction) => {
          if (direction === 'left') {
            return <SVGIcon name={'ic-nav-back'} svgProps={{ height: 24, width: 24 }} />;
          } else {
            return <SVGIcon name={'ic-nav-next'} svgProps={{ height: 24, width: 24 }} />;
          }
        }}
        dayComponent={({ date, state, onPress, marking }) => {
          const payload = marking?.['payload'];
          const isToday = state === 'today';
          const selected = payload?.selected;

          // console.log(date, state, selected);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onPress(date);
              }}
              style={{
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                borderRadius: 20,
                borderColor: isToday ? mainColor : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                backgroundColor: selected ? mainColor : 'transparent',
                // ...marking?.['customStyles']?.container,
              }}
            >
              <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff' }}>{date.day}</Text>
              <View style={{ backgroundColor: selected ? '#fff' : mainColor, height: 4, width: 4, borderRadius: 2 }} />
            </TouchableOpacity>
          );
        }}
        theme={{
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 40,
            },
          },
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: mainColor,
          calendarBackground: '#000',
          textSectionTitleColor: 'white',
          monthTextColor: 'white',
          arrowColor: 'white',
          textMonthFontWeight: 'bold',
        }}
        onDayPress={onDayPress}
        markedDates={marked}
      />
      <View
        style={{
          backgroundColor: '#000',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          paddingHorizontal: 24,
          paddingBottom: 24,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <TouchableOpacity hitSlop={{ bottom: 10, left: 10, top: 10 }} onPress={handleHideCalendar}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ bottom: 10, right: 20, top: 10 }} onPress={handleCalendarConfirm}>
          <Text style={{ color: '#fff', fontSize: 14, marginLeft: 24, fontWeight: '500' }}>OK</Text>
        </TouchableOpacity>
      </View>
      <Pressable onPress={handleHideCalendar} style={{ height: '100%', backgroundColor: '#0005' }}></Pressable>
    </Animated.View>
  );
});

const HomeScreen = () => {
  const Data = [
    {
      date: moment(),
      data: [{ name: 'Game 01' }, { name: 'Game 02' }],
    },
    {
      date: moment().add(1, 'days'),
      data: [{ name: 'Game 03' }, { name: 'Game 04' }],
    },
    {
      date: moment().add(2, 'days'),
      data: [{ name: 'Game 05' }, { name: 'Game 06' }],
    },
  ];

  const safeAreaInset = useSafeAreaInsets();
  const { navigation } = useAppNavigation();
  const { sdk, currentUser } = useSendbirdChat();
  const { signOut } = useAppAuth();
  const { disconnect } = useConnection();
  const { select, colors } = useUIKitTheme();
  const [scheduleByDay, setScheduleByDay] = useState(Data);
  const [startDay, setStartDay] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(moment());
  const scheduleListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const weekDayViewRef = useRef(null);
  const calendarViewRef = useRef(null);
  const { openChannels, next, refresh, refreshing, loading, error } = useOpenChannelList(sdk, currentUser?.userId);
  // const headerTranslate = Animated.diffClamp(scrollY, 0, 60).interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [1, 0],
  // });
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -200],
    extrapolate: 'clamp',
  });

  const topSpace = safeAreaInset.top + 44;
  console.log('topSpace:', topSpace);

  useEffect(() => {
    if (openChannels != null) {
      console.log(openChannels);
    }
  }, [openChannels]);

  useEffect(() => {
    if (selectedDay != null && scheduleListRef.current != null) {
      // console.log(scheduleListRef.current.scrollToLocation);
      if (scheduleListRef.current.scrollToLocation) {
        const idx = scheduleByDay.findIndex((item) => moment(selectedDay).isSame(moment(item.date), 'day'));
        if (idx <= scheduleByDay.length - 1 && idx >= 0) {
          scheduleListRef.current?.scrollToLocation({ sectionIndex: idx, itemIndex: 0 });
        }
      }
    }
  }, [selectedDay, scheduleByDay]);

  useEffect(() => {
    const newData = Data.filter((item) => item.date.isSameOrAfter(moment(startDay)));
    setScheduleByDay(newData);
  }, [startDay]);

  const getNextDays = (currentDay, numDays) => {
    let days = [];
    for (let i = 0; i <= numDays; i++) {
      let nextDay = moment(currentDay).add(i, 'days');
      days.push({ fullDay: nextDay, weekDay: nextDay.format('ddd'), day: nextDay.format('DD') });
    }
    return days;
  };

  const handleCalendarIconPress = () => {
    if (weekDayViewRef.current) {
      weekDayViewRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Use the measurements here
        console.log('View measurements:', { x, y, width, height, pageX, pageY });
        const heightFromTop = pageY + height;
        if (calendarViewRef.current) {
          calendarViewRef.current.show({ top: heightFromTop });
        }
      });
    }
  };

  const onGamePress = () => {
    if (openChannels != null && openChannels.length > 0) {
      navigation.navigate(Routes.OpenChannel, { channelUrl: openChannels[0].url });
    }
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
          backgroundColor: '#000',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.logo} source={require('../assets/basketBroz.png')} />
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => navigation.navigate(Routes.UserProfileStack)}
        >
          <Image style={styles.avatar} source={{ uri: avatar }} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekDay = () => {
    const numDays = 6;
    // const currentDay = new Date();
    const nextDays = getNextDays(startDay, numDays);
    const unSelectedColor = 'rgba(147, 149, 152, 0.38)';
    const selectedColor = '#939598';

    return (
      <Animated.View
        ref={(ref) => (weekDayViewRef.current = ref)}
        style={{
          position: 'relative',
          // top: topSpace,
          backgroundColor: '#000',
          paddingHorizontal: 16,
          paddingVertical: 20,
          // position: 'absolute',
          width: '100%',
          // zIndex: 1,
          // height: headerHeight,
          // transform: [{ translateY: headerHeight }],
          // transform: [{ scaleY: headerHeight }],
        }}
      >
        <Text style={{ fontSize: 20, color: '#fff' }}>{'Match Schedule'}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          {nextDays.map((item, index) => {
            const isCurrentDay = moment().isSame(item.fullDay, 'day');
            const isSeletedDay = moment(selectedDay).isSame(item.fullDay, 'day');
            const textColor = isCurrentDay ? '#fff' : isSeletedDay ? selectedColor : unSelectedColor;
            const borderColor = isCurrentDay ? mainColor : isSeletedDay ? selectedColor : unSelectedColor;
            const bgColor = isCurrentDay ? mainColor : 'transparent';

            return (
              <Pressable
                onPress={() => setSelectedDay(item.fullDay)}
                key={index.toString()}
                style={{
                  ...styles.capsule,
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 14, color: textColor, fontWeight: '700' }}>{item.weekDay}</Text>
                <Text style={{ fontSize: 16, marginTop: 4, fontWeight: '700', color: textColor }}>{item.day}</Text>
              </Pressable>
            );
          })}
          <TouchableOpacity onPress={handleCalendarIconPress} style={styles.capsule}>
            <SVGIcon name={'ic-calendar'} svgProps={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      </Animated.View>
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
      <Pressable onPress={onGamePress} style={styles.event.background}>
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
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section }) => {
    const title = section.date.format('ddd, MMM DD');
    return (
      <View style={{ alignSelf: 'center', marginBottom: 20, marginTop: 20, opacity: 0.5 }}>
        <View style={{ backgroundColor: '#5555', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 }}>
          <Text style={styles.event.date}>{title}</Text>
        </View>
      </View>
    );
  };

  const renderSchedule = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#161616' }}>
        <Animated.SectionList
          contentContainerStyle={{ paddingTop: 0, paddingBottom: safeAreaInset.bottom }}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          ref={(ref) => (scheduleListRef.current = ref)}
          showsVerticalScrollIndicator={false}
          sections={scheduleByDay}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => renderGame()}
          ItemSeparatorComponent={(item, index) => <View style={{ height: 16, width: '100%' }} />}
          renderSectionHeader={(section) => renderSectionHeader(section)}
        />
      </View>
    );
  };

  return (
    <View style={{ ...styles.background, paddingTop: safeAreaInset.top }}>
      <StatusBar barStyle={'light-content'} />
      {renderHeader()}
      {renderWeekDay()}
      {renderSchedule()}
      <CustomCalendar
        ref={(ref) => (calendarViewRef.current = ref)}
        // selectedDay={selectedDay}
        onDaySelected={(day) => {
          setStartDay(day);
          setSelectedDay(day);
          // setScheduleByDay((prev) => prev.filter((item) => item.date.isSameOrAfter(moment(day))));
          // console.log(day);
        }}
      />
      <View style={{ position: 'absolute', bottom: safeAreaInset.bottom }}>
        <BannerAd
          unitId={'ca-app-pub-2968296579280717/6715783010'}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
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
    borderWidth: 1,
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
      color: '#fff',
    },
    background: {
      backgroundColor: '#2c2c2c',
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
