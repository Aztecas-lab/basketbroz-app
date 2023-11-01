import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import TeamLogoSource from "../components/TeamLogoSource";
import AsyncStorage from "@react-native-async-storage/async-storage";

const wording = {
  CLAIM_TICKET: "Claim a Ballionaire ticket",
  TICKET_CLAIMED: "Ticket claimed",
  DES_EXPIRED: "Expired",
  DES_CLAIM_BEFORE: "Before ",
  DES_CLAIMED: "Good luck to you!",
  DES_CLAIM_NOT_AVAILABLE: "Not available yet",
};

const GameCard = forwardRef((props, ref) => {
  // console.log('\n\nGameCard:', payload);
  const { payload, onGamePress, onClaimButtonPress, index } = props;
  const [claimed, setClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const {
    channel = null,
    game_date_time = "",
    home_team = {},
    away_team = {},
    id,
  } = payload;
  const closeAtUtc = channel?.close_at;
  const openAtUtc = channel?.open_at;
  const closeAtLocal = moment.utc(closeAtUtc).local().format("HH:mm");
  const openAtLocal = moment.utc(openAtUtc).local().format("HH:mm");

  // const gameStatus = channel.status;
  const gameStatus = "created";
  const startTimeLocal = moment.utc(game_date_time).local().format("HH:mm");
  const homeTeam = home_team;
  const homeTeamName = homeTeam?.tricode;
  const homeTeamLogo = TeamLogoSource[homeTeam?.tricode];
  const awayTeam = away_team;
  const awayTeamName = awayTeam?.tricode;
  const awayTeamLogo = TeamLogoSource[awayTeam?.tricode];
  const isLive = gameStatus === "created";

  useImperativeHandle(ref, () => ({
    onRewardedCallback: (payload) => {
      console.log("onRewardedCallback:", payload);
      setClaimed(true);
      setIsClaiming(false);
    },
  }));

  useEffect(() => {}, []);

  const onClaimPress = () => {
    onClaimButtonPress?.(id);
    setIsClaiming(true);
  };

  const renderGameStatus = () => {
    switch (gameStatus) {
      // not started
      case "waiting":
        return (
          <>
            <Text
              style={{
                color: "white",
                marginTop: 8,
                fontSize: 22,
                fontFamily: "Roboto-Regular",
              }}
            >
              VS
            </Text>
          </>
        );
      // live
      case "created":
        return (
          <>
            <View
              style={{
                backgroundColor: "#CC301A",
                flexDirection: "row",
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                }}
              />
              <Text style={{ color: "#fff", fontSize: 14, marginLeft: 6 }}>
                {"Live"}
              </Text>
            </View>
          </>
        );
      // finished
      case "deleted":
        return (
          <>
            <Text
              style={{
                color: "white",
                marginTop: 8,
                fontSize: 22,
                fontFamily: "Roboto-Regular",
              }}
            >
              Final
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderTeamInfo = ({ teamName, awayHome, teamLogo }) => {
    return (
      <View
        style={{ flexDirection: "column", alignItems: "center", maxWidth: 72 }}
      >
        <Image style={styles.team_logo} source={teamLogo}></Image>
        <Text style={styles.team_name}>{teamName}</Text>
        <Text style={styles.away_home}>{awayHome}</Text>
      </View>
    );
  };

  const renderRaffleTicketButton = useCallback(() => {
    let buttonText = "";
    let buttonDesp = "";
    let disable = true;
    switch (gameStatus) {
      case "waiting":
        buttonText = wording.CLAIM_TICKET;
        buttonDesp = wording.DES_CLAIM_NOT_AVAILABLE;
        disable = true;
        break;
      case "created":
        buttonText = claimed ? wording.TICKET_CLAIMED : wording.CLAIM_TICKET;
        buttonDesp = claimed
          ? wording.DES_CLAIMED
          : `${wording.DES_CLAIM_BEFORE} ${closeAtLocal}`;
        disable = claimed || isClaiming ? true : false;
        break;
      case "deleted":
        buttonText = claimed ? wording.TICKET_CLAIMED : wording.CLAIM_TICKET;
        buttonDesp = claimed ? wording.DES_CLAIMED : wording.DES_EXPIRED;
        disable = true;
        break;
      default:
    }

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={disable}
          style={{
            marginTop: 24,
            height: 48,
            backgroundColor: disable ? "#555" : "#CC301A",
            borderRadius: 24,
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
          }}
          onPress={onClaimPress}
        >
          {isClaiming ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "700" }}>
              {buttonText}
            </Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: "center",
            color: "rgba(255,255,255,0.38)",
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {buttonDesp}
        </Text>
      </>
    );
  }, [claimed, isClaiming]);

  return (
    <>
      <Pressable
        onPress={onGamePress}
        style={[styles.background, isLive ? styles.background_selected : {}]}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ ...styles.name }}>{`${startTimeLocal}`}</Text>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {renderTeamInfo({
            teamName: homeTeamName,
            teamLogo: homeTeamLogo,
            awayHome: "Home",
          })}
          <View style={{ alignItems: "center" }}>{renderGameStatus()}</View>
          {renderTeamInfo({
            teamName: awayTeamName,
            teamLogo: awayTeamLogo,
            awayHome: "Away",
          })}
        </View>
        {renderRaffleTicketButton()}
      </Pressable>
    </>
  );
});

const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  background: {
    backgroundColor: "#2c2c2c",
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
  },
  background_selected: {
    backgroundColor: "#000",
  },
  team_logo: {
    width: 72,
    height: 72,
  },
  team_name: {
    color: "#fff",
    marginTop: 8,
    fontSize: 16,
  },
  away_home: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 14,
    marginTop: 4,
  },
  name: {
    fontSize: 22,
    color: "#fff",
    alignSelf: "center",
  },
  score: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  num_pts: {
    marginLeft: 4,
    color: "#fff",
    fontSize: 14,
  },
});

export default GameCard;
