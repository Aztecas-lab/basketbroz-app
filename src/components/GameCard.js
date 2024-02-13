import moment from 'moment';
import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import TeamLogoSource from '../components/TeamLogoSource';

const wording = {
  CLAIM_TICKET: 'Claim a Ballionaire ticket',
  TICKET_CLAIMED: 'Ticket claimed',
  DES_EXPIRED: 'Expired',
  DES_CLAIM_BEFORE: 'Before ',
  DES_CLAIMED: 'Good luck to you!',
  DES_CLAIM_NOT_AVAILABLE: 'Not available yet',
};

const GAME_STATUS = {
  waiting: 'waiting',
  created: 'created',
  deleted: 'deleted',
};

// ad_reward": {"can_click_ad": false, "click_count": 0, "click_latest_date_time": null}
const GameCard = forwardRef((props, ref) => {
  const {payload, onGamePress, onClaimButtonPress, index} = props;
  // console.log('\n\nGameCard:', payload);
  const [claimed, setClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const {
    channel = null,
    game_date_time = '',
    home_team = {},
    away_team = {},
    id,
    ad_reward = null,
  } = payload;
  const closeAtUtc = channel?.close_at;
  const openAtUtc = channel?.open_at;
  const closeAtLocal = moment.utc(closeAtUtc).local().format('HH:mm');
  const openAtLocal = moment.utc(openAtUtc).local().format('HH:mm');
  const canClaim = ad_reward?.can_click_ad;
  const hasLastClick = ad_reward?.click_latest_date_time;

  const gameStatus = channel.status;
  const startTimeLocal = moment.utc(game_date_time).local().format('HH:mm');
  const homeTeam = home_team;
  const homeTeamName = homeTeam?.tricode;
  const homeTeamLogo = TeamLogoSource[homeTeam?.tricode];
  const awayTeam = away_team;
  const awayTeamName = awayTeam?.tricode;
  const awayTeamLogo = TeamLogoSource[awayTeam?.tricode];
  const isLive = gameStatus === GAME_STATUS.created;

  useImperativeHandle(ref, () => ({
    onRewardedCallback: payload => {
      console.log('onRewardedCallback:', payload);
      setClaimed(true);
      setIsClaiming(false);
    },
  }));

  const onClaimPress = () => {
    onClaimButtonPress?.(id);
    setIsClaiming(true);
  };

  const renderGameStatus = () => {
    switch (gameStatus) {
      // not started
      case GAME_STATUS.waiting:
        return (
          <>
            <Text
              style={{
                color: 'white',
                marginTop: 8,
                fontSize: 22,
                fontFamily: 'Roboto-Regular',
              }}>
              VS
            </Text>
          </>
        );
      // live
      case GAME_STATUS.created:
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
              }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#fff',
                }}
              />
              <Text style={{color: '#fff', fontSize: 14, marginLeft: 6}}>
                {'Live'}
              </Text>
            </View>
          </>
        );
      // finished
      case GAME_STATUS.deleted:
        return (
          <>
            <Text
              style={{
                color: 'white',
                marginTop: 8,
                fontSize: 22,
                fontFamily: 'Roboto-Regular',
              }}>
              Final
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderTeamInfo = ({teamName, awayHome, teamLogo}) => {
    return (
      <View
        style={{flexDirection: 'column', alignItems: 'center', maxWidth: 72}}>
        {teamLogo == null ? (
          <View
            style={{
              ...styles.team_logo,
              backgroundColor: '#222',
              borderRadius: 36,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center', color: '#fff'}}>
              Not Available
            </Text>
          </View>
        ) : (
          <Image style={styles.team_logo} source={teamLogo} />
        )}
        <Text style={styles.team_name}>{teamName ?? 'TBD'}</Text>
        <Text style={styles.away_home}>{awayHome ?? 'TBD'}</Text>
      </View>
    );
  };

  const renderRaffleTicketButton = () => {
    let buttonText = '';
    let buttonDesp = '';
    let disable = true;
    switch (gameStatus) {
      case GAME_STATUS.waiting:
        buttonText = wording.CLAIM_TICKET;
        buttonDesp = wording.DES_CLAIM_NOT_AVAILABLE;
        disable = true;
        break;
      case GAME_STATUS.created:
        // local claimed or server can't click
        if (claimed || !canClaim) {
          // no info for ad_reward from the server
          if (canClaim == null) {
            buttonText = wording.CLAIM_TICKET;
            buttonDesp = wording.DES_CLAIM_NOT_AVAILABLE;
            disable = true;
          } else {
            buttonText = wording.TICKET_CLAIMED;
            buttonDesp = wording.DES_CLAIMED;
            disable = true;
          }
        } else {
          buttonText = wording.CLAIM_TICKET;
          buttonDesp = `${wording.DES_CLAIM_BEFORE} ${closeAtLocal}`;
          disable = false;
        }
        break;
      case GAME_STATUS.deleted:
        if (hasLastClick) {
          buttonText = wording.TICKET_CLAIMED;
          buttonDesp = wording.DES_CLAIMED;
        } else {
          buttonText = wording.CLAIM_TICKET;
          buttonDesp = wording.DES_EXPIRED;
        }
        disable = true;
        break;
      default:
    }

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={disable || isClaiming}
          style={{
            marginTop: 24,
            height: 48,
            backgroundColor: disable || isClaiming ? '#555' : '#CC301A',
            borderRadius: 24,
            marginHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}
          onPress={onClaimPress}>
          {isClaiming ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{fontSize: 16, color: '#fff', fontWeight: '700'}}>
              {buttonText}
            </Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            color: 'rgba(255,255,255,0.38)',
            fontSize: 14,
            marginTop: 4,
          }}>
          {buttonDesp}
        </Text>
      </>
    );
  };

  return (
    <Pressable
      onPress={onGamePress}
      style={[styles.background, isLive ? styles.background_selected : {}]}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={{...styles.name}}>{`${startTimeLocal}`}</Text>
      </View>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        {renderTeamInfo({
          teamName: homeTeamName,
          teamLogo: homeTeamLogo,
          awayHome: 'Home',
        })}
        <View style={{alignItems: 'center'}}>{renderGameStatus()}</View>
        {renderTeamInfo({
          teamName: awayTeamName,
          teamLogo: awayTeamLogo,
          awayHome: 'Away',
        })}
      </View>
      {renderRaffleTicketButton()}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  background: {
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
    height: 300,
    marginBottom: 16,
    // maxHeight: 300,
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
