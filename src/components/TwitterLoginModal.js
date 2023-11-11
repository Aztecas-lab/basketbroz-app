import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import Url from 'url-parse';

import SVGIcon from '../components/SVGIcon';
import env from '../env';
import useApi from '../hooks/useApi';

const TwitterLoginModal = forwardRef((props, ref) => {
  const {login} = useApi();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('loading...');
  const webViewRef = useRef(null);
  const isLoggingIn = useRef(false);

  useImperativeHandle(ref, () => ({
    open: openModal,
    close: () => closeModal(),
  }));

  function openModal() {
    setVisible(true);
  }

  function closeModal(result = null) {
    props.onResult && props.onResult(result);
    setVisible(false);
  }

  function onMessage(message) {
    setTitle(message.nativeEvent.data);
  }

  const handleNavigationStageChange = async webNavState => {
    const {url} = webNavState;
    const redirectUrl = new Url(url, true);
    console.log('===== path:', redirectUrl.pathname);
    if (url && redirectUrl.pathname.startsWith('/auth/result/twitter')) {
      const path = redirectUrl.pathname;
      const pathArr = path.split(`/`).filter(v => v != '');
      const snsType = pathArr[2];
      const status = pathArr[3];
      const snsToken = pathArr[4];
      console.log('status =', status);
      console.log('snsToken =', snsToken);
      if (status === 'success' && snsToken != null && !isLoggingIn.current) {
        isLoggingIn.current = true;
        webViewRef.current?.stopLoading();
        // call login api
        const result = await login({snsType, snsToken});
        closeModal(result);
      }
    }
  };

  /**
   *  renders
   */
  const renderTitle = () => {
    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize: 14}}>
        {title || ''}
      </Text>
    );
  };

  const renderCloseButton = () => {
    return (
      <TouchableOpacity
        style={{position: 'absolute', left: 16}}
        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
        onPress={() => closeModal()}>
        <SVGIcon
          svgProps={{width: 20, height: 20}}
          name={'ic_close_dark'}></SVGIcon>
      </TouchableOpacity>
    );
  };

  const renderWebViewHeader = () => {
    return (
      <View
        style={{
          height: 48,
          backgroundColor: '#fff',
          borderTopLeftRadius: Platform.OS === 'android' ? 12 : 12,
          borderTopRightRadius: Platform.OS === 'android' ? 12 : 12,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#d8dadd',
        }}>
        {renderCloseButton()}
        {renderTitle()}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      onRequestClose={() => closeModal()}
      transparent={true}>
      <SafeAreaView style={{flex: 1}}>
        {renderWebViewHeader()}
        <WebView
          style={{flex: 1, minHeight: 200, opacity: 0.99}}
          cacheEnabled={false}
          incognito={true}
          ref={ref => (webViewRef.current = ref)}
          onNavigationStateChange={handleNavigationStageChange}
          injectedJavaScript={`setTimeout(function(){window.ReactNativeWebView.postMessage(document.title);}, 0); true;`}
          onMessage={onMessage}
          javaScriptEnabled
          startInLoadingState
          source={{uri: `${env.HOST}${env.TWITTER_AUTH_PATH}`}}
        />
      </SafeAreaView>
    </Modal>
  );
});

export default TwitterLoginModal;
