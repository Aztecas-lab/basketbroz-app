import React, { useContext, useEffect, useState } from 'react';

import { ActionMenu } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListChannelMenu: React.FC<GroupChannelListProps['ChannelMenu']> = () => {
  const channelMenu = useContext(GroupChannelListContext.ChannelMenu);
  const { LABEL } = useLocalization();
  const { currentUser } = useSendbirdChat();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (channelMenu.selectedChannel) setVisible(true);
  }, [channelMenu.selectedChannel]);

  return (
    <ActionMenu
      visible={visible}
      onHide={() => setVisible(false)}
      onDismiss={channelMenu.selectChannel}
      title={
        channelMenu.selectedChannel &&
        LABEL.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_TITLE(currentUser?.userId ?? '', channelMenu.selectedChannel)
      }
      menuItems={[
        {
          title: LABEL.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_NOTIFICATION(channelMenu.selectedChannel),
          onPress: async () => {
            if (channelMenu.selectedChannel?.myPushTriggerOption === 'off') {
              await channelMenu.selectedChannel?.setMyPushTriggerOption('default');
            } else {
              await channelMenu.selectedChannel?.setMyPushTriggerOption('off');
            }
          },
        },
        {
          title: LABEL.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_LEAVE,
          onPress: async () => {
            await channelMenu.selectedChannel?.leave();
          },
        },
      ]}
    />
  );
};

export default GroupChannelListChannelMenu;