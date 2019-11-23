import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Button,
  Alert
} from 'react-native';
import firebase from 'firebase'
import {UserProvider,withUserContext} from './userContext';
import { Separator } from 'native-base';
import Constants from 'expo-constants';

require("firebase/firestore");


class Inventory extends Component {
  static contextType = UserProvider;

  constructor(props) {
    super(props);
    this.state = {
      equipmentList : [],
      loading: true
    }
  }

  async componentDidMount(){

    const db = firebase.firestore();
    db.collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").get().then(function (query) {
      var returnArray = []
      query.forEach(function (doc) {
        var item = doc.data();
        returnArray.push(item);
        console.log(item)
        });
      this.setState({equipmentList: returnArray, loading: false});        
    }.bind(this));
  }
  
  renderEquipment = (data) => {
    return <View>
      <View style={styles.card}>
      {/* <View style={styles.listItemContainer}> */}
        <Image source={require("../Images/plasticsword.png")} styles={styles.equipmentImage} />
        <View style={styles.cardContent}>
        <Text style={styles.name}>Name: {data.item.name}</Text>
        <Text style={styles.status}>Status: {data.item.itemStatus}</Text>
        <Text style={styles.status}>Damage: {data.item.damage}</Text>
        <Text style={styles.status}>Price: {data.item.cost}</Text>
          <View style={styles.button}>
            <Button style={styles.equip} title="Equip" onPress={() => this.equip(data.item.name)} />
            <Separator />
            <Button style={styles.unequip} title="Unequip" onPress={() => this.unequip(data.item.name)} />
              <Separator />
            <Button style={styles.sell} title="Sell" onPress={() => this.sell(data.item.name, data.item.cost)} />
          </View>
        </View>
      </View>
    </View>
  }

  equip(name) {
    firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").doc(name).update({ itemStatus: "Equipped" });
    Alert.alert("You have successfully equip the item");
  }

  unequip(name) {
    firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").doc(name).update({ itemStatus: "Unequipped" });
    Alert.alert("You have successfully unequip the item");
  }

  sell(name, cost) {
    firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").doc(name).delete();
    Alert.alert("You have successfully sell the item");
    const db = firebase.firestore();
    db.collection('Game').doc(this.props.userProvider.userDetails).update({
    Runes: firebase.firestore.FieldValue.increment(cost)});
  }

  render() {
      if (!this.state.loading){
        return (  
          <View style={styles.container}>
              <FlatList 
          data={this.state.equipmentList}
          renderItem={this.renderEquipment}
          keyExtractor={(item) => item.name} 
          />
          </View>)
      }
      else {
        return (<ActivityIndicator/>)
      }
  }
}
export default withUserContext(Inventory);


//Design of the page
const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
    backgroundColor:"#eeeeee"
},
//   listItemContainer: {
//     fontSize: 15,
//     textAlign: 'center',
//     margin: 10,
//     color: 'white',
//     borderStyle: 'solid',
//     borderColor: '#fff',
//     borderBottomWidth: 2,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20
// },
card:{
  shadowColor: '#00000021',
  shadowOffset: {
    width: 0,
    height: 30,
    flex: 1,
  },
  shadowOpacity: 0.37,
  shadowRadius: 7.49,
  elevation: 12,

  marginVertical: 10,
  marginHorizontal:20,
  backgroundColor:"white",
  flexBasis: '46%',
  padding: 10,
  flexDirection:'row'
},

cardContent: {
  marginLeft:20,
  marginTop:10
},

name:{
  fontSize: 20,
  flex:1,
  //alignSelf:'center',
  color:"#000000",
  //fontWeight:'bold'
},

status:{
  ///fontSize:20,
  flex:1,
  //alignSelf:'center',
  color:"#000000",
  //fontWeight:'bold'
},

itemHeader: {  
    color: '#fff',
    fontSize: 20,
},
equipmentImage: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50,
    borderRadius:45,
},

button:{
  //flex: 1, 
  flexDirection: 'row',
  justifyContent: 'space-between',
},
// equip:{
//   //borderRadius: 30,
//   //backgroundColor: "#f283a0",
//   width: 50,
//   height:50,
//   flex: 1, 

// },
// unequip:{

//   //borderRadius: 30,
//   //backgroundColor: "red",
//   width: 50,
//   height:50,
//   flex: 1, 

// },
// sell:{
//   //borderRadius: 30,
//   //backgroundColor: "#9fd6ff",
//   width: 50,
//   height:50,
//   flex: 1, 

// },
separator: {
  marginVertical: 1,
  borderBottomColor: '#00000021',
  borderBottomWidth: StyleSheet.hairlineWidth,
},

});

