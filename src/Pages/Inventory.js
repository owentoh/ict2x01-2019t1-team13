import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  //Button,
  Alert
} from 'react-native';
import firebase from 'firebase'
import {UserProvider,withUserContext} from './userContext';
import { Separator, Container, Tab, TabHeading, Tabs, StyleProvider, Icon, Title, Header, Left, Body, Right, Text, Button} from 'native-base';
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
    console.log("STARTTTTTTTTTTTTTTTTTTTTTTTTTTT")
  }

  
  renderEquipment = (data) => {
    return <View>
      <View style={styles.card}>
        <Image source={require("../Images/plasticsword.png")} styles={styles.equipmentImage} />
        <View style={styles.cardContent}>
        <Text style={styles.name}>Name: {data.item.name}</Text>
        <Text style={styles.status}>Status: {data.item.itemStatus}</Text>
        <Text style={styles.status}>Damage: {data.item.damage}</Text>
        <Text style={styles.status}>Price: {data.item.cost}</Text>
          {/* <View style={styles.button}>
            <Button style={styles.equip} title="Equip" onPress={() => this.equip(data.item.name, data.item.damage)} />
            <Separator />
            <Button style={styles.unequip} title="Unequip" onPress={() => this.unequip(data.item.name, data.item.damage)} />
              <Separator />
            <Button style={styles.sell} title="Sell" onPress={() => this.sell(data.item.name, data.item.cost)} />
          </View> */}
          <View style={styles.cardButton}>
                        <TouchableOpacity style={styles.sellButton} onPress={() => this.sell(data.item.name, data.item.cost)}>
                            <Text style={styles.sellButtonText}>Sell</Text>                  
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.equipButton} onPress={() => this.equip(data.item.name, data.item.damage)}>
                            <Text style={styles.equipButtonText}>Equip</Text>                  
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.unequipButton} onPress={() => this.unequip(data.item.name, data.item.damage)}>
                            <Text style={styles.unequipButtonText}>Unequip</Text>                  
                        </TouchableOpacity> 
                   </View>






        </View>
      </View>
    </View>
  }

  equip(name, dmg) {
    const status = firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection('inventory').doc(name)
    firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").doc(name).update({ itemStatus: "Equipped" });
    this.props.userProvider.setTotalDamage((this.props.userProvider.totalDamage + dmg))
    Alert.alert("You have successfully equip the item");
    this.props.navigation.navigate("Inventory")

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

  unequip(name, dmg) {
    firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").doc(name).update({ itemStatus: "Unequipped" });
    this.props.userProvider.setTotalDamage((this.props.userProvider.totalDamage - dmg))
    Alert.alert("You have successfully unequip the item");
    this.props.navigation.navigate("Inventory")

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

  sell(name, cost) {
    firebase.firestore().collection("Game").doc(this.props.userProvider.userDetails).collection("inventory").doc(name).delete();
    Alert.alert("You have successfully sell the item");
    const db = firebase.firestore();
    db.collection('Game').doc(this.props.userProvider.userDetails).update({
    Runes: firebase.firestore.FieldValue.increment(cost)});
    this.props.navigation.navigate("Inventory")

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

  render() {
      if (!this.state.loading){
        return (  
// <<<<<<< haikalBranch
          <Container>
          <Header>
          <Left>
          <Button onPress={() => this.props.navigation.navigate('Mainpage')} transparent>
                            <Icon name='arrow-back' />
                            <Text>Back</Text>
                          </Button>
          </Left>
          <Body>
            <Title>Inventory</Title>
          </Body>
          <Right>
          <Button onPress={() => this.props.navigation.navigate('Mainpage')} transparent>
                            <Text>Cancel</Text>
                          </Button>
          </Right>
        </Header>
{/* // =======
//           <View style={styles.container}>
// >>>>>>> dev */}
              <FlatList 
          data={this.state.equipmentList}
          renderItem={this.renderEquipment}
          keyExtractor={(item) => item.name} 
// <<<<<<< haikalBranch
          /></Container>)
// =======
//           />
//           </View>)
// >>>>>>> dev
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
  listItemContainer: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: 'white',
    borderStyle: 'solid',
    borderColor: '#fff',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
},
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
equip:{
  //borderRadius: 30,
  //backgroundColor: "#f283a0",
  width: 50,
  height:50,
  flex: 1, 

},
unequip:{

  //borderRadius: 30,
  //backgroundColor: "red",
  width: 50,
  height:50,
  flex: 1, 

},
sell:{
  //borderRadius: 30,
  //backgroundColor: "#9fd6ff",
  width: 50,
  height:50,
  flex: 1, 

},
separator: {
  marginVertical: 1,
  borderBottomColor: '#00000021',
  borderBottomWidth: StyleSheet.hairlineWidth,
},
sellButton: {
  marginTop: 55,
  height: 35,
  width: 70,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 30,
  backgroundColor: "#433a64",
},
sellButtonText: {
  color: "#FFFFFF",
  fontSize: 20,
},
equipButton: {
  marginTop: 55,
  height: 35,
  width: 80,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 30,
  backgroundColor: "#433a64",
},
equipButtonText: {
  color: "#FFFFFF",
  fontSize: 20,
},
unequipButton: {
  marginTop: 55,
  height: 35,
  width: 95,
  //flexDirection: 'row-reverse',
  alignSelf: 'flex-end',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 30,
  backgroundColor: "#433a64",
},
unequipButtonText: {
  color: "#FFFFFF",
  fontSize: 20,
},
cardButton: {
  // marginLeft:0,
  // marginTop: 10,
  flexDirection: 'row',
  textAlign: 'center',
  //justifyContent: 'space-between',
  //flexWrap: 'wrap',
},

});

