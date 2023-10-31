import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  RefreshControl,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CalendarModalView from '../components/CalendarModalView';
import GameCard from '../components/GameCard';
import SVGIcon from '../components/SVGIcon';
import { ENV } from '../env';
import useApi from '../hooks/useApi';
import useAppState from '../hooks/useAppState';
import useAuthUser from '../hooks/useAuthUser';
import useInterstitalAd from '../hooks/useInterstitalAd';
import { Routes } from '../route';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const mainColor = '#CC301A';

// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
//   serverSideVerificationOptions: { customData: 'wlefjowiejfoiwjef', userId: 'wefjowiejfiowejfoije' },
//   keywords: ['fashion', 'clothing'],
// });

const HomeScreen = () => {
  const { getGamesDetailbyDate } = useApi();
  const appBackToActive = useAppState();
  const interstitialAd = useInterstitalAd();
  const safeAreaInset = useSafeAreaInsets();
  const navigation = useNavigation();
  const { authUser } = useAuthUser();
  // const [allSectionSchedules, setAllSectionSchedules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleSchedules, setVisibleSchedules] = useState([]);
  const [visibleStartDate, setVisibleStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDay, setSelectedDay] = useState(moment());

  // const rawSchedules = useRef(null);
  const scheduleListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const weekDayViewRef = useRef(null);
  const calendarViewRef = useRef(null);
  // const lastViewableSection = useRef(null);
  const autoScrollTimeout = useRef(null);
  const autoScrolling = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const rewardedAd = useRef(null);

  // useEffect(() => {
  //   if (rewardedAd.current != null) {
  //     if (rewardedAd.current.loaded) {
  //       rewardedAd.current.show();
  //     }
  //   }
  // }, [loaded]);

  // useEffect(() => {
  //   const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
  //     setLoaded(true);
  //   });
  //   const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
  //     console.log('User earned reward of ', reward);
  //   });

  //   // Start loading the rewarded ad straight away
  //   rewarded.load();

  //   // Unsubscribe from events on unmount
  //   return () => {
  //     unsubscribeLoaded();
  //     unsubscribeEarned();
  //   };
  // }, []);

  useEffect(() => {
    if (appBackToActive && interstitialAd) {
      if (interstitialAd.loaded) {
        interstitialAd.show();
      } else {
        interstitialAd.load();
      }
    }
  }, [appBackToActive, interstitialAd]);

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    if (selectedDay != null) {
      // console.log(scheduleListRef.current.scrollToLocation);
      if (scheduleListRef?.current?.scrollToLocation) {
        if (autoScrollTimeout.current != null) {
          clearTimeout(autoScrollTimeout.current);
          autoScrollTimeout.current = null;
        }
        autoScrollTimeout.current = setTimeout(() => {
          const idx = visibleSchedules.findIndex((item) => moment(selectedDay).isSame(moment(item.date), 'day'));
          if (idx <= visibleSchedules.length - 1 && idx >= 0) {
            autoScrolling.current = true;
            scheduleListRef.current?.scrollToLocation({ sectionIndex: idx, itemIndex: 0 });
          }
        }, 100);
      }
    }
  }, [selectedDay, visibleSchedules]);

  // when the visible week is changed
  useEffect(() => {
    const fetchUtcStartDate = moment(visibleStartDate).startOf('day').utc().format('YYYY-MM-DD');
    const fetchUtcEndDate = moment(fetchUtcStartDate).add(7, 'days').format('YYYY-MM-DD');
    getGames(fetchUtcStartDate, fetchUtcEndDate);
    // const utcDate = moment(day).startOf('day').utc().format('YYYY-MM-DD');
    // getGames(utcDate, moment(utcDate).add(7, 'days').format('YYYY-MM-DD'));
  }, [visibleStartDate]);

  // useEffect(() => {
  //   // check to update the visible schedule
  //   setVisibleSchedules(getScheduleByStartDay(startDay, allSectionSchedules));
  // }, [startDay, allSectionSchedules]);

  const convertGamesToSectionByDate = (games = []) => {
    // convert to object with date as key
    const groupedDataByDate = games.reduce((result, item) => {
      const utcToLocal = moment.utc(item.game_date_time).local();
      const localTime = utcToLocal.format('YYYY-MM-DD HH:mm:ss');
      const localDateKey = utcToLocal.format('YYYY-MM-DD');
      if (!result[localDateKey]) {
        result[localDateKey] = [];
      }
      result[localDateKey].push({ ...item, game_date_time_local: localTime });
      return result;
    }, {});
    // convert to section data and sort the time of the games
    const sectionData = Object.keys(groupedDataByDate).map((item) => {
      return {
        date: item,
        data: groupedDataByDate[item].sort((a, b) => moment(a.game_date_time_local) - moment(b.game_date_time_local)),
      };
    });
    // sort the date
    sectionData.sort((a, b) => moment(a.date) - moment(b.date));
    sectionData.forEach((s) => console.log(`${s.date} has ${s.data.length} games`));
    return sectionData;
  };

  const getGames = useCallback(
    async (start, end) => {
      console.log('getGames');
      const result = await getGamesDetailbyDate({ start_at: start, end_at: end });
      if (result.success && result?.data) {
        setRefreshing(false);
        const sectionSchedule = convertGamesToSectionByDate(result.data);
        // rawSchedules.current = sectionSchedule;
        // setAllSectionSchedules(sectionSchedule);
        setVisibleSchedules(getLocalvisibleGames(visibleStartDate, sectionSchedule));
      }
    },
    [visibleStartDate],
  );

  const getLocalvisibleGames = (startAt, rawData) => {
    const startDateString = startAt;
    console.log('visible start at:', startDateString);
    const endDateString = moment(startAt).add(6, 'days').format('YYYY-MM-DD');
    console.log('visible end at:', endDateString);
    const start = new Date(startDateString);
    const end = new Date(endDateString);
    const filtered = rawData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    console.log('filtered:');
    filtered.forEach((s) => console.log(`${s.date} has ${s.data.length} games`));
    return filtered;
  };

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
          calendarViewRef.current.show({ top: heightFromTop, selectedDay });
        }
      });
    }
  };

  const onRaffleTicketButtonPress = (scheduleId) => {
    console.log('onRaffleTicketButtonPress:', scheduleId, authUser.uuid);
    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      serverSideVerificationOptions: {
        customData: JSON.stringify({ schedule_id: scheduleId, env: ENV }),
        userId: authUser.uuid,
      },
    });
    if (rewarded != null) {
      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        rewarded.show();
      });
      const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward of ', reward);
        rewarded?.removeAllListeners();
      });
    }
    rewarded.load();
  };

  const onGamePress = () => {
    // console.log('onGamePress', JSON.stringify(authUser));
    // const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    //   requestNonPersonalizedAdsOnly: true,
    //   // uuid,
    //   // serverSideVerificationOptions: { customData: JSON.stringify(schedule_id: id, ) ,userId: authUser.uuid },
    //   keywords: ['fashion', 'clothing'],
    // });
    // rewardedAd.current = rewarded;
    // const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    //   setLoaded(true);
    // });
    // const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
    //   console.log('User earned reward of ', reward);
    // });
    // RewardedAdEventType.rewarded.load();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const fetchUtcStartDate = moment(visibleStartDate).startOf('day').utc().format('YYYY-MM-DD');
    const fetchUtcEndDate = moment(fetchUtcStartDate).add(7, 'days').format('YYYY-MM-DD');
    getGames(fetchUtcStartDate, fetchUtcEndDate);
  }, [visibleStartDate]);

  const renderHeader = () => {
    const avatar = authUser?.avatar;
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
        <Image resizeMode="contain" style={{ width: 178, height: 25 }} source={require('../assets/app_logo.png')} />
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
    const nextDays = getNextDays(visibleStartDate, numDays);
    const unSelectedColor = 'rgba(147, 149, 152, 0.38)';
    const selectedColor = '#939598';

    return (
      <Animated.View
        ref={(ref) => (weekDayViewRef.current = ref)}
        style={{
          position: 'relative',
          backgroundColor: '#000',
          paddingHorizontal: 16,
          paddingVertical: 20,
          width: '100%',
        }}
      >
        <Text style={{ fontSize: 20, color: '#fff', fontWeight: '700' }}>{'Match Schedule'}</Text>
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
            <SVGIcon name={'ic_calendar'} svgProps={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderGame = ({ item, index }) => {
    return (
      <GameCard
        index={index}
        payload={item}
        onGamePress={onGamePress}
        onRaffleTicketButtonPress={onRaffleTicketButtonPress}
      />
    );
  };

  const renderSectionHeader = ({ section }) => {
    const title = moment(section.date).format('ddd, MMM DD');
    return (
      <View style={{ alignSelf: 'center', marginBottom: 20, marginTop: 20, opacity: 0.5 }}>
        <Text style={{ color: '#fff', fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4 }}>{title}</Text>
      </View>
    );
  };

  const renderEmptySchedule = () => {
    return (
      <Text style={{ fontSize: 16, color: '#fff', paddingHorizontal: 40, marginTop: 40, textAlign: 'center' }}>
        No games this week.
      </Text>
    );
  };

  const renderSchedule = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#161616' }}>
        <SectionList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingTop: 0, paddingBottom: safeAreaInset.bottom }}
          scrollEventThrottle={16}
          // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          ref={(ref) => (scheduleListRef.current = ref)}
          showsVerticalScrollIndicator={false}
          sections={visibleSchedules}
          keyExtractor={(item, index) => item + index}
          renderItem={renderGame}
          ItemSeparatorComponent={(item, index) => <View style={{ height: 16, width: '100%' }} />}
          renderSectionHeader={(section) => renderSectionHeader(section)}
          ListEmptyComponent={() => renderEmptySchedule()}
          onScrollToIndexFailed={() => {
            console.log('failed to scroll to index');
          }}
          // onViewableItemsChanged={({ viewableItems }) => {
          //   if (viewableItems.length > 0) {
          //     const currentSection = viewableItems[0].section.date;
          //     // console.log('Current section:', currentSection);
          //     if (currentSection !== lastViewableSection.current && !autoScrolling.current) {
          //       setSelectedDay(currentSection);
          //     }
          //     lastViewableSection.current = currentSection;
          //   }
          // }}
          // onScrollEndDrag={() => {
          //   if (autoScrolling.current) {
          //     autoScrolling.current = false;
          //   }
          //   console.log('scroll animation end');
          // }}
        />
      </View>
    );
  };

  return (
    <>
      <View style={{ ...styles.background, paddingTop: safeAreaInset.top }}>
        <StatusBar barStyle={'light-content'} />
        {renderHeader()}
        {renderWeekDay()}
        {renderSchedule()}
      </View>
      <CalendarModalView
        // data={allSectionSchedules}
        ref={(ref) => (calendarViewRef.current = ref)}
        onDaySelected={(day) => {
          console.log('onDaySelected:', day);
          setVisibleStartDate(day);
          setSelectedDay(day);
          // const utcDate = moment(day).startOf('day').utc().format('YYYY-MM-DD');
          // getGames(utcDate, moment(utcDate).add(7, 'days').format('YYYY-MM-DD'));
        }}
      />
    </>
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#888',
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
});

export default HomeScreen;
