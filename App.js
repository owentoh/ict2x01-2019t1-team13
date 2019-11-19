import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import '@firebase/firestore'

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator, } from 'react-navigation-tabs';
import { withNavigation } from 'react-navigation'
import { UserProvider } from './src/Pages/UserContext'

import LoginScreen from './src/Pages/LoginScreen';
import Registration from './src/Pages/RegistrationScreen'
import Mainpage from './src/Pages/Mainpage'
import Profile from './src/Pages/Profile'
import Routes from './src/Pages/Route';

export default class App extends Component {
  render() {
    return (
      <UserProvider>
        <AppContainer />
        {/* <Routes /> */}
      </UserProvider>
    );
  }
}

//Bottom tab navigation
const AppTab = createBottomTabNavigator(
  {
    Mainpage: {
      screen: Mainpage,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
      }
    }
  }
)


//Navigation between pages
const SN = createSwitchNavigator(
  {
    Login: { screen: LoginScreen },
    Register: { screen: Registration },
    SN: { screen: AppTab },
  },
  {
    initialRouteName: "Login"
  }
)
const AppContainer = createAppContainer(SN);
