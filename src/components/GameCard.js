import moment from 'moment';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeamLogoSource from '../components/TeamLogoSource';

const GameCard = ({ payload, onGamePress, onRaffleTicketButtonPress, index }) => {
  // console.log('\n\nGameCard:', payload);
  const { channel = null, game_date_time = '', home_team = {}, away_team = {}, id } = payload;
  const closeAtUtc = channel?.close_at;
  const openAtUtc = channel?.open_at;
  const closeAtLocal = moment.utc(closeAtUtc).local().format('HH:mm');
  const openAtLocal = moment.utc(openAtUtc).local().format('HH:mm');

  const gameStatus = channel.status;
  const startTimeLocal = moment.utc(game_date_time).local().format('HH:mm');
  const homeTeam = home_team;
  const homeTeamName = homeTeam?.tricode;
  const homeTeamLogo = TeamLogoSource[homeTeam?.tricode];
  const awayTeam = away_team;
  const awayTeamName = awayTeam?.tricode;
  const awayTeamLogo = TeamLogoSource[awayTeam?.tricode];
  const isLive = gameStatus === 'created';
  const renderGameStatus = () => {
    switch (gameStatus) {
      // not started
      case 'waiting':
        return (
          <>
            <Text style={{ color: 'white', marginTop: 8, fontSize: 22, fontFamily: 'Roboto-Regular' }}>VS</Text>
          </>
        );
      // live
      case 'created':
        return (
          <>
            <View
              style={{
                backgroundColor: '#CC301A',
                flexDirection: 'row',
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
              <Text style={{ color: '#fff', fontSize: 14, marginLeft: 6 }}>{'Live'}</Text>
            </View>
          </>
        );
      // finished
      case 'deleted':
        return (
          <>
            <Text style={{ color: 'white', marginTop: 8, fontSize: 22, fontFamily: 'Roboto-Regular' }}>Final</Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderTeamInfo = ({ teamName, awayHome, teamLogo }) => {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', maxWidth: 72 }}>
        <Image style={styles.team_logo} source={teamLogo}></Image>
        <Text style={styles.team_name}>{teamName}</Text>
        <Text style={styles.away_home}>{awayHome}</Text>
      </View>
    );
  };

  const renderRaffleTicketButton = () => {
    let buttonText = 'Claim a raffle ticket';
    let buttonDesp = `Before ${closeAtLocal}`;
    let disable = true;
    let claimed = false;

    switch (gameStatus) {
      case 'waiting':
        buttonText = 'Claim a raffle ticket';
        buttonDesp = 'Not available yet';
        disable = true;
        break;
      case 'created':
        buttonText = claimed ? 'Ticket claimed' : 'Claim a raffle ticket';
        buttonDesp = claimed ? 'Good luck to you!' : `Before ${closeAtLocal}`;
        disable = claimed ? true : false;
        break;
      case 'deleted':
        buttonText = claimed ? 'Ticket claimed' : 'Claim a raffle ticket';
        buttonDesp = claimed ? 'Good luck to you!' : 'Expired';
        disable = true;
        break;
      default:
    }

    return (
      <>
        <TouchableOpacity
          disabled={disable}
          style={{
            marginTop: 24,
            height: 48,
            backgroundColor: disable ? '#555' : '#CC301A',
            borderRadius: 24,
            marginHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}
          onPress={() => onRaffleTicketButtonPress(id)}
        >
          <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>{buttonText}</Text>
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            color: 'rgba(255,255,255,0.38)',
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {buttonDesp}
        </Text>
      </>
    );
  };

  return (
    <>
      <Pressable onPress={onGamePress} style={[styles.background, isLive ? styles.background_selected : {}]}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...styles.name }}>{`${startTimeLocal}`}</Text>
        </View>
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          {renderTeamInfo({ teamName: homeTeamName, teamLogo: homeTeamLogo, awayHome: 'Home' })}
          <View style={{ alignItems: 'center' }}>{renderGameStatus()}</View>
          {renderTeamInfo({ teamName: awayTeamName, teamLogo: awayTeamLogo, awayHome: 'Away' })}
        </View>
        {renderRaffleTicketButton()}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
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
  background_selected: {
    backgroundColor: '#000',
  },
  team_logo: {
    width: 72,
    height: 72,
  },
  team_name: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
  away_home: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 14,
    marginTop: 4,
  },
  name: {
    fontSize: 22,
    color: '#fff',
    alignSelf: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  num_pts: {
    marginLeft: 4,
    color: '#fff',
    fontSize: 14,
  },
});

export default GameCard;
