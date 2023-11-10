import moment, { months } from "moment-timezone";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

import SVGIcon from "../components/SVGIcon";
import useApi from "../hooks/useApi";

const mainColor = "#CC301A";

const CalendarModalView = forwardRef((props, ref) => {
  const { getGameSchedules } = useApi();
  const [selected, setSelected] = useState(
    props?.selectedDay ?? moment().format("YYYY-MM-DD")
  );
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [disableLeftArrow, setDisableLeftArrow] = useState(true);
  const transY = useRef(new Animated.Value(0)).current;
  const scheduleMapRef = useRef({});
  const lastMonthChange = useRef(null); // {"month": 1, "year: 2024 "}

  const schedulesMap = useMemo(() => {
    schedules.forEach((item) => {
      scheduleMapRef.current[item.game_date] = item;
    });
    return scheduleMapRef.current;
  }, [schedules]);

  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        selectedTextColor: "#fff",
        customStyles: {
          container: {
            // ...your awesome styles
            backgroundColor: mainColor,
          },
        },
        payload: {
          selected: true,
          game: {
            name: "123",
          },
        },
      },
    };
  }, [selected]);

  useEffect(() => {
    if (props.selectedDay != null) {
      setSelected(props.selectedDay.format("YYYY-MM-DD"));
    }
  }, [props.selectedDay]);

  const onDayPress = (day) => {
    setSelected(day.dateString);
    handleCalendarConfirm(day.dateString);
  };

  const show = (param) => {
    const { top = 0, selectedDay } = param;
    setSelected(moment(selectedDay).format("YYYY-MM-DD"));
    setTop(top);
    setVisible((prev) => !prev);
    Animated.timing(transY, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300,
    }).start();
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

  const handleCalendarConfirm = (selectedDay) => {
    Animated.timing(transY, { toValue: 0, useNativeDriver: true }).start(() => {
      setVisible(false);
      transY.setValue(0);
    });
    console.log("press OK selected:", selectedDay);
    props?.onDaySelected?.(selectedDay);
    // setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={{
        top: 0,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#0009",
        opacity: transY,
        transform: [{ translateY: transY }],
      }}
    >
      <Pressable onPress={handleHideCalendar} style={{ height: top }} />
      <Calendar
        disableArrowLeft={disableLeftArrow}
        onVisibleMonthsChange={(months) => {
          // const selectedMonth = months[0].month;
          const selectedMonth = months[0].year * 100 + months[0].month;
          // const currentMonth = moment().month() + 1;
          const currentMonth = moment().year() * 100 + moment().month() + 1;
          setDisableLeftArrow(selectedMonth <= currentMonth);
        }}
        allowSelectionOutOfRange={false}
        disableAllTouchEventsForDisabledDays={true}
        onMonthChange={async (payload) => {
          const dateString = payload.dateString;
          const startAt = moment(dateString)
            .startOf("month")
            .format("YYYY-MM-DD");
          const endAt = moment(dateString).endOf("month").format("YYYY-MM-DD");
          // console.log('onMonthChange', payload);
          // console.log('onMonthChange', startAt, endAt);
          const shouldFetchData =
            lastMonthChange.current == null ||
            lastMonthChange.current.month !== payload.month ||
            lastMonthChange.current.year !== payload.year;
          if (shouldFetchData) {
            getGameSchedules({ start_at: startAt, end_at: endAt }).then(
              (resp) => {
                if (resp.success && resp.data) {
                  setSchedules(resp.data);
                }
              }
            );
          }
          lastMonthChange.current = {
            month: payload.month,
            year: payload.year,
          };
        }}
        initialDate={selected}
        // markingType="custom"
        hideExtraDays={true}
        // onPressArrowLeft={() => {
        //   console.log('arrow left press');
        // }}
        renderArrow={(direction) => {
          if (direction === "left") {
            return (
              <View style={{ opacity: disableLeftArrow ? 0 : 1 }}>
                <SVGIcon
                  name={"ic_nav_back"}
                  svgProps={{ height: 24, width: 24 }}
                />
              </View>
            );
          } else {
            return (
              <SVGIcon
                name={"ic_nav_next"}
                svgProps={{ height: 24, width: 24 }}
              />
            );
          }
        }}
        enableSwipeMonths={true}
        minDate={moment().format("YYYY-MM-DD")}
        dayComponent={({ date, state, onPress, marking }) => {
          const payload = marking?.["payload"];
          const isToday = state === "today";
          const isDisable = state === "disabled";
          const selected = payload?.selected;
          const hasGames = schedulesMap[date.dateString] != null;
          return (
            <TouchableOpacity
              disabled={isDisable}
              activeOpacity={0.6}
              onPress={() => {
                onPress(date);
              }}
              style={{
                borderTopEndRadius: 20,
                padding: 0,
                margin: 0,
                width: 40,
                height: 40,
                borderRadius: 20,
                borderColor: isToday ? mainColor : "transparent",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                backgroundColor: selected ? mainColor : "transparent",
                // ...marking?.['customStyles']?.container,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  color: isDisable ? "#888" : "#fff",
                }}
              >
                {date.day}
              </Text>
              {hasGames && !isDisable ? (
                <View
                  style={{
                    position: "absolute",
                    bottom: 6,
                    backgroundColor: selected ? "#fff" : mainColor,
                    height: 4,
                    width: 4,
                    borderRadius: 2,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          );
        }}
        theme={{
          "stylesheet.calendar.header": {
            header: {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 40,
            },
          },
          selectedDayBackgroundColor: "#00adf5",
          todayTextColor: mainColor,
          calendarBackground: "#000",
          textSectionTitleColor: "white",
          monthTextColor: "white",
          arrowColor: "white",
          textMonthFontWeight: "bold",
        }}
        onDayPress={onDayPress}
        markedDates={marked}
      />
      {/* <View
        style={{
          backgroundColor: "#000",
          justifyContent: "flex-end",
          flexDirection: "row",
          paddingHorizontal: 24,
          paddingBottom: 24,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <TouchableOpacity
          hitSlop={{ bottom: 10, left: 10, top: 10 }}
          onPress={handleHideCalendar}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ bottom: 10, right: 20, top: 10 }}
          onPress={handleCalendarConfirm}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              marginLeft: 24,
              fontWeight: "500",
            }}
          >
            OK
          </Text>
        </TouchableOpacity>
      </View> */}
      <Pressable
        onPress={handleHideCalendar}
        style={{ height: "100%", backgroundColor: "#0005" }}
      ></Pressable>
    </Animated.View>
  );
});

export default CalendarModalView;
