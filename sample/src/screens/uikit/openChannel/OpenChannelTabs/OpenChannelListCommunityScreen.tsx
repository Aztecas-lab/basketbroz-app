import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { Pressable } from 'react-native';

import { createOpenChannelListFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import { OpenChannelCustomType } from '../../../../libs/openChannel';

const UseReactNavigationHeader: GroupChannelModule['Header'] = ({ onPressHeaderRight, onPressHeaderLeft }) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Open Channel List',
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Icon icon={'arrow-left'} />
        </Pressable>
      ),
      headerRight: () => <></>,
    });
  }, []);

  return null;
};

const OpenChannelListFragment = createOpenChannelListFragment({
  Header: UseReactNavigationHeader,
  // Header: ({ onPressHeaderRight }) => {
  //   const { HeaderComponent } = useHeaderStyle();
  //   return (
  //     <HeaderComponent
  //       title={'Community'}
  //       right={<Icon icon={'create'} />}
  //       left={<Icon icon={'arrow-left'} />}
  //       onPressRight={onPressHeaderRight}
  //     />
  //   );
  // },
});
const OpenChannelListCommunityScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation } = useAppNavigation<Routes.OpenChannelListCommunity>();

  return (
    <OpenChannelListFragment
      onPressCreateChannel={() => {
        // Navigating to open channel create
        navigation.navigate(Routes.OpenChannelCreate);
      }}
      onPressChannel={(channel) => {
        // Navigating to open channel
        navigation.navigate(Routes.OpenChannel, { channelUrl: channel.url });
      }}
      queryCreator={() => {
        return sdk.openChannel.createOpenChannelListQuery({
          customTypes: [OpenChannelCustomType.COMMUNITY],
        });
      }}
    />
  );
};

export default OpenChannelListCommunityScreen;
