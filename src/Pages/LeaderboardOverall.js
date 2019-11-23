import * as React from 'react';
import { Container, Tab, TabHeading, Tabs, StyleProvider, Icon } from 'native-base';
import { Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Dimensions, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Tab2 from './LeaderboardDamage';
import Tab3 from './LeaderboardSteps';

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
// //firebase.initializeApp(firebaseConfig);

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const { width, height } = Dimensions.get('window');

const GamePost = ({gameDetails}) => {
  return (
      <View style={styles.textContainer}>
        <Text style={styles.usernameDetail}>{gameDetails.Username}</Text>
        <Text style={styles.damageDetail}>{gameDetails.Damage}</Text>
        <Text style={styles.stepDetail}>{gameDetails.CurrentSteps}</Text>
      </View>
  );
};

export default class Leaderboard extends React.Component {
  static navigationOptions = {
    title: 'Leaderboard',
    headerStyle: {
      backgroundColor: '#9b1ef4',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }; 

  constructor() {
    super();
    this.ref = firebase.firestore().collection("Game");
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
      const { CurrentSteps, Damage, Username, } = doc.data();
      gamePosts.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        CurrentSteps,
        Damage,
        Username,
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
      <Tabs>
        <Tab heading={<TabHeading><Icon name='trophy'/></TabHeading>}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.textHeader}>Overall</Text>
          <View style={styles.leaderboardDetails}>
          <View style={styles.tableHeaderContainer}>
          <View style={styles.tableHeaderContainer1}><Text style={styles.textTableHeader1}>Username</Text></View>
          <View style={styles.tableHeaderContainer2}><Text style={styles.textTableHeader2}>Total Damage</Text></View>
          <View style={styles.tableHeaderContainer3}><Text style={styles.textTableHeader3}>Total Steps</Text></View>
          </View>
          <FlatList
            data={this.state.gamePosts}
            renderItem={({ item }) => <GamePost gameDetails={item}/>}
          />
          </View> 
        </ScrollView>
        </Tab>
        <Tab heading={<TabHeading><Icon name='pulse'/></TabHeading>}>
          <Tab2 />
        </Tab>
        <Tab heading={<TabHeading><Icon name='walk'/></TabHeading>}>
          <Tab3 />
        </Tab>
      </Tabs>  
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

  usernameDetail: {
    flex: 2,
    textAlign: 'center',
  },

  damageDetail: {
    flex: 1,
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

  textTableHeader2: {
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

  tableHeaderContainer2: {
    flex: 1,
  },

  tableHeaderContainer3: {
    flex: 1,
  },
 
});