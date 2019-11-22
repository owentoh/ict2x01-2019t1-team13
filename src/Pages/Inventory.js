import * as React from 'react';
import { Container, Tab, TabHeading, Tabs, StyleProvider, Icon } from 'native-base';
import { Modal, Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Dimensions, Button, SafeAreaView, ScrollView, TouchableHighlight } from 'react-native';
//import Tab2 from './LeaderboardDamage';
//import Tab3 from './LeaderboardSteps';

import firebase from 'firebase'
require("firebase/firestore");

// import More from './More.js'

//import { YellowBox } from 'react-native';
//import _ from 'lodash';

// YellowBox.ignoreWarnings(['Setting a timer']);
// const _console = _.clone(console);
// console.warn = message => {
//   if (message.indexOf('Setting a timer') <= -1) {
//     _console.warn(message);
//   }
// };

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

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const { width, height } = Dimensions.get('window');

// const GamePost = ({gameDetails}) => {
//   return (
//       <View style={styles.textContainer}>
//         <Text style={styles.inventoryDetail}>{gameDetails.Inventory}</Text>
//         {/* <Text style={styles.usernameDetail}>{gameDetails.Username}</Text>
//         <Text style={styles.damageDetail}>{gameDetails.Damage}</Text>
//         <Text style={styles.stepDetail}>{gameDetails.CurrentSteps}</Text> */}
//       </View>
//   );
// };

const GamePost = ({gameDetails}) => {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} resizeMode="cover" source={ require("../Images/plasticsword.png") } />
       <View style={styles.cardContent}>
        <Text style={styles.inventoryDetail}>{gameDetails.name}</Text>
        <Text style={styles.inventoryDetail}>{gameDetails.itemStatus}</Text>
            <Button title="Equip" onPress={() => this.equip()} />
            <Button title="Unequip" onPress={() => this.unequip()} />
        </View>
      </View>
    );
};

export default class Inventory extends React.Component {
  static navigationOptions = {
    title: 'Inventory',
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
    //this.ref = firebase.firestore().collection("Game");
    this.ref = firebase.firestore().collection("Game").doc("Toh_jin_wen@hotmail.com").collection("inventory");
    this.unsubscribe = null;
    this.state = {
      gamePosts: [],
      loading: true,
      userSelected:[]
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
      const { uri, itemStatus, name, } = doc.data();
      gamePosts.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        // CurrentSteps,
        // Damage,
        // Username,
        //Inventory,
        uri,
        itemStatus,
        name,
      });
    });
    this.setState({
      gamePosts,
      loading: false,
   });
  }

  equip  () {
    this.add({
      itemStatus: 'true'},
      { create: true}
            
    );
  }
  unequip  () {
    this.set({
      itemStatus: 'false'},
      { create: true}    
    );
  }

  render() {
    if (this.state.loading) {
      return <View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }
    return (
    <SafeAreaView style={styles.container}>
        {/* <ScrollView style={styles.scrollView}> */}
          <Text style={styles.textHeader}>Inventory</Text>
          <View style={styles.inventoryDetails}>
          <FlatList
            style={styles.userList}
            data={this.state.gamePosts}
            keyExtractor= {(item) => {
              return item.id;
            }}
            renderItem={({ item }) => <GamePost gameDetails={item}/>}>
            
            </FlatList>
           
          
          </View> 
        {/* </ScrollView> */}
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    backgroundColor: '#fff',
  },

  loader: {
    paddingTop: 300,
  },

  inventoryDetails: {
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
    flex: 3,
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
    flex: 3,
  },

  tableHeaderContainer2: {
    flex: 2,
  },

  tableHeaderContainer3: {
    flex: 2,
  },
  viewButton: {
    marginTop:10,
    height:35,
    width:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  viewButtonText:{
    color: "red",
    fontSize:20,
  },
  // card:{
  //   shadowColor: '#00000021',
  //   shadowOffset: {
  //     width: 0,
  //     hcardeight: 6,
  //   },
  //   shadowOpacity: 0.37,
  //   shadowRadius: 7.49,
  //   elevation: 12,

  //   marginVertical: 10,
  //   marginHorizontal:20,
  //   backgroundColor:"white",
  //   flexBasis: '46%',
  //   padding: 10,
  //   flexDirection:'row'
  // },
  cardContent:{
    marginLeft:20,
    marginTop:10
  },

 
});