import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import '@firebase/firestore'

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator, } from 'react-navigation-tabs';
import { withNavigation } from 'react-navigation'
import { UserProvider, withUserContext } from './src/Pages/userContext'

import LoginScreen from './src/Pages/LoginScreen';
import Leaderboard from './src/Pages/LeaderboardOverall'
import Registration from './src/Pages/RegistrationScreen'
import MapScreen from './src/Pages/MapScreen';
import Inventory from './src/Pages/Inventory.js'
import Mainpage from './src/Pages/Mainpage'
import Profile from './src/Pages/Profile'
import Shop from './src/Pages/Shop'
import Loading from './src/Pages/Loading'
import PreLoading from './src/Pages/PreLoading';

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
    Leaderboard: {
      screen: Leaderboard,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
      }
    },
    MapScreen: {
      screen:  MapScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
      }
    },
    Inventory: {
      screen: Inventory,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />
      }
    }, 
    Mainpage: {
      screen: Mainpage,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />
      }
    }, 
    Shop: {
      screen: Shop,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
      } 
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
      }
    },
  }
)


//Navigation between pages
const SN = createSwitchNavigator(
  {
    Login: { screen: LoginScreen },
    Register: { screen: Registration },
    MapScreen: { screen: MapScreen },
    SN: { screen: AppTab },
    Inventory: { screen: Inventory },
    Leaderboard: { screen: Leaderboard },
    Mainpage : { screen: Mainpage },
    Shop : { screen: Shop },
    Profile : { screen: Profile},
    Loading: { screen: Loading },
    PreLoading: { screen: PreLoading }
  },
  {
    initialRouteName: "PreLoading"
  }
)
const AppContainer = createAppContainer(SN);
