import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

const TAG = 'AuthUserContext';
const STORAGE_KEY_AUTH_TOKEN = 'auth_token';

export const AuthUserContext = createContext({
  authUser: null,
  authToken: null,
  setAuthUser: () => {},
  setAuthToken: () => {},
});

export const AuthUserProvider = ({ children }) => {
  // console.log(TAG, 'AuthUserProvider');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    getTokenFromStorage();
  }, []);

  const setAuthUser = (data) => {
    setUser(data);
  };

  const setAuthToken = (data) => {
    console.log('setAuthToken:', data);
    setToken(data);
    try {
      if (data == null) {
        AsyncStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      } else {
        AsyncStorage.setItem(STORAGE_KEY_AUTH_TOKEN, data);
      }
    } catch (e) {
      console.w('Failed to store auth token');
    }
  };

  const getTokenFromStorage = async () => {
    try {
      const result = await AsyncStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
      if (result != null) {
        setToken(result);
      }
    } catch (e) {
      console.w('Failed to get auth token from the storage');
    }
  };

  return (
    <AuthUserContext.Provider value={{ authUser: user, authToken: token, setAuthUser, setAuthToken }}>
      {children}
    </AuthUserContext.Provider>
  );
};
