import React, { useEffect, useRef, useState } from "react";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import env from "../env";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : env.INTERSTITIAL_AD_ID;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

const useInterstitalAd = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      interstitial.load();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.CLICKED,
      () => {
        console.log("interstitial ad: clicked");
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("interstitial ad: closed");
        setLoaded(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log("interstitial ad loaded");
        setLoaded(true);
      }
    );
    return unsubscribe;
  }, []);

  return interstitial;
};

export default useInterstitalAd;
