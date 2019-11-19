import React, { Component } from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';
import { Text } from 'react-native';

import Registration from './RegistrationScreen';
import Mainpage from './Mainpage';
import Profile from './Profile'
import LoginScreen from './LoginScreen';



const TabIcon = ({ selected, title }) => {
    return (
      <Text style={{color: selected ? 'red' :'black'}}>{title}</Text>
    );
  }

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Scene key="root" hideNavBar={true}>
                    <Scene intital key="Login" component={LoginScreen} />
                    
                    <Scene key="Register" component={Registration} title='Back' />
                    
                    <Scene key="tabbar" tabs tabBarStyle={{backgroundColor:'#FFFFFF'}}>
                    <Scene key="Mainpage" component={Mainpage} title="Mainpage"icon={TabIcon} hideNavBar={true} />
                    </Scene>
                </Scene>
            </Router>
                );
        }
        
    }
