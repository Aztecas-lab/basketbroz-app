import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import moment from "moment-timezone";
import React from "react";
import { getTimeZone } from "react-native-localize";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthUserProvider } from "./contexts/AuthUserContext";
import { Routes } from "./route";
import {
  HomeScreen,
  SignInScreen,
  SplashScreen,
  UserProfileEditScreen,
  UserProfileScreen,
} from "./screens";
import UserProfileEditNickname from "./screens/UserProfileEditNickname";
import UserProfileEditUsername from "./screens/UserProfileEditUsername";

moment.tz.setDefault(getTimeZone());
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.SignInScreen}
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.SignIn}
        options={{ animation: "none" }}
        component={SignInScreen}
      />
      <Stack.Screen
        options={{ animation: "none" }}
        name={Routes.HomeStack}
        component={HomeStack}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home}
      screenOptions={{
        animationEnabled: true,
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.Home} component={HomeScreen} />
      <Stack.Screen
        options={{
          presentation: "containedModal",
          animation: "slide_from_bottom",
        }}
        name={Routes.UserProfileStack}
        component={UserProfileStack}
      />
    </Stack.Navigator>
  );
};

const UserProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "default" }}
      initialRouteName={Routes.UserProfileEditScreen}
    >
      {/* <Stack.Screen name={Routes.UserProfile} component={UserProfileScreen} /> */}
      <Stack.Screen
        name={Routes.UserProfileEdit}
        component={UserProfileEditScreen}
        options={{ animation: "none" }}
      />
      <Stack.Screen
        name={Routes.UserProfileEditUsername}
        component={UserProfileEditUsername}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name={Routes.UserProfileEditNickname}
        component={UserProfileEditNickname}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={"#000"} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animationEnabled: false,
            headerShown: false,
          }}
        >
          <Stack.Screen name={Routes.Splash} component={SplashScreen} />
          <Stack.Screen
            options={{ animation: "none" }}
            name={Routes.AuthStack}
            component={AuthStack}
          />
          <Stack.Screen
            options={{ animation: "none" }}
            name={Routes.HomeStack}
            component={HomeStack}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <AuthUserProvider>
      <Navigation />
    </AuthUserProvider>
  );
};

export default App;
