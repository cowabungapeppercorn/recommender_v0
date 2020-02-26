import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

const switchNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    authFlow: createStackNavigator({
      Login: LoginScreen,
      Register: RegisterScreen
    }),
    mainFlow: createStackNavigator({
      Home: HomeScreen,
    })
  },
  {
    initialRouteName: 'Loading',
  }
);

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <App />
  );
};