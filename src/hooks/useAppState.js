import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [backToForeground, setBackToForeground] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        setBackToForeground(true);
      } else {
        setBackToForeground(false);
      }
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return backToForeground;
};

export default useAppState;
