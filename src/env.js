const ENV = 'stage';

const config = {
  stage: {
    APP_ID: '1F7EDE99-5F73-4C56-8877-FD34B54EE98B',
    HOST: 'https://stage.basketbroz.com',
    BB_APP_TOKEN: '27|rJzibiIoBSivPI5X9oBVzCMvoLcNcHRWazH8WlSI',
    TWITTER_AUTH_PATH: '/auth/redirect/twitter',
  },
  prod: {
    APP_ID: '1F7EDE99-5F73-4C56-8877-FD34B54EE98B',
    HOST: 'https://basketbroz.com',
    BB_APP_TOKEN: '1|tpJ2Rb4amKzfG80Snqn6P66JmC9Q4kzDvVIKclkH',
    TWITTER_AUTH_PATH: '/auth/redirect/twitter',
  },
};

export default config[ENV];
export { ENV };
