import * as React from 'react';
import { Container, Tab, TabHeading, Tabs, StyleProvider, Icon } from 'native-base';
import { Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Dimensions, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import firebase from 'firebase'
require("firebase/firestore");

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAk1kpPBPwJTGbdzIB9LUpJpXMy69fOUoI",
//   authDomain: "walk-df0f7.firebaseapp.com",
//   databaseURL: "https://walk-df0f7.firebaseio.com",
//   projectId: "walk-df0f7",
//   storageBucket: "walk-df0f7.appspot.com",
//   messagingSenderId: "939704801477",
//   appId: "1:939704801477:web:9cf1576ffed467c6a838ac",
//   measurementId: "G-7PVC81VGB7"
// };

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const GamePost = ({gameDetails}) => {
  return (
      <View style={styles.textContainer}>
        <Text style={styles.idDetail}>{gameDetails.Username}</Text>
        <Text style={styles.stepDetail}>{gameDetails.CurrentSteps}</Text>
      </View>
  );
};

export default class LeaderboardSteps extends React.Component {

  constructor() {
    super();
    this.ref = (firebase.firestore().collection("Game")).orderBy("CurrentSteps","desc").limit(5);
    this.unsubscribe = null;
    this.state = {
      gamePosts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const gamePosts = [];
    querySnapshot.forEach((doc) => {
      const { CurrentSteps, Username } = doc.data();
      gamePosts.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        CurrentSteps,
        Username
      });
    });
    this.setState({
      gamePosts,
      loading: false,
   });
  }

    render() {
      if (this.state.loading) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>;
      }
      return (
      <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.textHeader}>Top 5 Players Highest Number of Steps</Text>
            <View style={styles.leaderboardDetails}>
            <View style={styles.tableHeaderContainer}>
            <View style={styles.tableHeaderContainer1}><Text style={styles.textTableHeader1}>Username</Text></View>
            <View style={styles.tableHeaderContainer3}><Text style={styles.textTableHeader3}>Total Steps</Text></View>
            </View>
            <FlatList
              data={this.state.gamePosts}
              renderItem={({ item }) => <GamePost gameDetails={item}/>}
            />
            </View> 
          </ScrollView>
      </SafeAreaView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    loader: {
      paddingTop: 300,
    },
  
    leaderboardDetails: {
      height: 500,
      alignItems: 'stretch',
      marginTop: 10,
      marginLeft: 15,
      marginRight: 15,
    },
  
    textContainer: {
      flexDirection: 'row',
      padding: 10,
      height: 40,
      backgroundColor: '#f6f8fa',
    },
  
    idDetail: {
      flex: 2,
      textAlign: 'center',
    },
  
    stepDetail: {
      flex: 1,
      textAlign: 'center',
    },
  
    textHeader: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
    },
  
    tableHeaderContainer: {
      flexDirection: 'row',
      padding: 10,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#426585',
    },
  
    textTableHeader1: {
      textAlign: 'center',
      color: '#fefefe',
    },
  
    textTableHeader3: {
      textAlign: 'center',
      color: '#fefefe',
    },
  
    tableHeaderContainer1: {
      flex: 2,
    },
  
    tableHeaderContainer3: {
      flex: 1,
    },
   
  });