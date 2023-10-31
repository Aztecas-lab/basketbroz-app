import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  InteractionManager,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppleLoginButton from "../components/AppleLoginButton";
import TwitterLoginModal from "../components/TwitterLoginModal";
import useApi from "../hooks/useApi";
import { Routes } from "../route";

const SignInScreen = () => {
  const { registerApple, login } = useApi();
  const twitterModalRef = useRef(null);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handler
   */
  const handleTwitterLogin = () => {
    if (twitterModalRef.current != null) {
      twitterModalRef.current.open();
      setIsLoading(true);
    }
  };

  const onTwitterLoginResult = (result) => {
    setIsLoading(false);
    console.log("Twitter log in result:", result);
    if (result?.success) {
      InteractionManager.runAfterInteractions(() => {
        navigation.replace(Routes.HomeStack);
      });
    }
  };

  const onAppleLoginStart = () => {
    setIsLoading(true);
  };

  const handleAppleLoginResult = async (result) => {
    const idToken = result?.identityToken;
    if (result.identityToken != null) {
      const r = await registerApple({ token: idToken });
      if (r.success && r.sns_token) {
        login({ snsType: "apple", snsToken: r.sns_token }).then((resp) => {
          setIsLoading(false);
          if (resp.success) {
            InteractionManager.runAfterInteractions(() => {
              navigation.replace(Routes.HomeStack);
            });
          }
        });
      } else {
        setIsLoading(false);
      }
    }
  };

  /**
   * render
   */
  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"light-content"} />

        <Image
          resizeMode="contain"
          style={{ width: width * 0.69, height: width * 0.69 * 0.14 }}
          source={require("../assets/app_logo.png")}
        />
        <Image
          style={{
            width: width * 0.6,
            height: (width * 0.6) / 0.68,
            marginTop: 20,
          }}
          source={require("../assets/boy_login.png")}
        />

        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <ActivityIndicator animating size={"small"} color={"white"} />
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleTwitterLogin}
                  style={{ ...styles.social_login_button, marginRight: 16 }}
                >
                  <Image
                    source={require("../assets/twitter_login.png")}
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
                <AppleLoginButton
                  onStart={onAppleLoginStart}
                  onResult={handleAppleLoginResult}
                />
              </>
            )}
          </View>
        </View>
        <Text style={{ textAlign: "center", marginTop: 26, color: "#fff" }}>
          {`By signing, you confirm that you are 18 years of age or older and agree to our Terms of Use and Privacy Policy.`}
        </Text>
      </SafeAreaView>
      <TwitterLoginModal
        ref={(ref) => (twitterModalRef.current = ref)}
        onResult={onTwitterLoginResult}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  social_login_button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignInScreen;
