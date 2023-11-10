import {Platform} from 'react-native';
const CURRENT_ENV = 'stage'; // stage or prod
const ENV = __DEV__ ? 'stage' : CURRENT_ENV;

const config = {
  stage: {
    APP_ID: '1F7EDE99-5F73-4C56-8877-FD34B54EE98B',
    HOST: 'https://stage.basketbroz.com',
    BB_APP_TOKEN: '27|rJzibiIoBSivPI5X9oBVzCMvoLcNcHRWazH8WlSI',
    TWITTER_AUTH_PATH: '/auth/redirect/twitter',
    REWARDED_AD_ID: Platform.select({
      ios: 'ca-app-pub-2968296579280717/4499126596',
      android: 'ca-app-pub-2968296579280717/5169619555',
    }),
    INTERSTITIAL_AD_ID: Platform.select({
      ios: 'ca-app-pub-2968296579280717/2000530738',
      android: 'ca-app-pub-2968296579280717/5464260883',
    }),
  },
  prod: {
    APP_ID: '1F7EDE99-5F73-4C56-8877-FD34B54EE98B',
    HOST: 'https://basketbroz.com',
    BB_APP_TOKEN: '1|tpJ2Rb4amKzfG80Snqn6P66JmC9Q4kzDvVIKclkH',
    TWITTER_AUTH_PATH: '/auth/redirect/twitter',
    REWARDED_AD_ID: Platform.select({
      ios: 'ca-app-pub-2968296579280717/4499126596',
      android: 'ca-app-pub-2968296579280717/5169619555',
    }),
    INTERSTITIAL_AD_ID: Platform.select({
      ios: 'ca-app-pub-2968296579280717/8292322946',
      android: 'ca-app-pub-2968296579280717/8391561144',
    }),
  },
};

export default config[ENV];
export {ENV};
