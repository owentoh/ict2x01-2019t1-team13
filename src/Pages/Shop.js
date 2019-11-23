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
  Alert
} from 'react-native';
import firebase from 'firebase'
import {UserProvider,withUserContext} from './userContext';
import { Container, Tab, TabHeading, Tabs, StyleProvider, Icon, Title, Header, Left, Body, Right, Button, Text} from 'native-base';

require("firebase/firestore");

class Shop extends Component {
  static contextType = UserProvider;

  constructor(props) {
    super(props);
    this.state = {
      runes: 1,
      price: 1,
      equipmentList : [],
      loading: true,
      damage: 0,
      totalDamage: 0,
      url: " "
    }
  }

  async componentDidMount(){

    const db = firebase.firestore();
    db.collection("Equipment").get().then(function (query) {
      var returnArray = []
      query.forEach(function (doc) {
        var item = doc.data();
        returnArray.push(item);
        });
      this.setState({equipmentList: returnArray, loading: false});        
    }.bind(this));

    const docUserProfile = db.collection("Game").doc(this.props.userProvider.userDetails);
    docUserProfile.get().then(doc => this.setState({ runes: doc.data().Runes }));
    console.log(this.props.userProvider.userDetails)

    
  }
  
  renderEquipment = (data) => {
    return <TouchableOpacity style={{ backgroundColor: '#fefefe' }} onPress={() => this.purchaseEquipment(this.props.userProvider.userDetails, data.item.name, data.item.cost, data.item.damage)}>
      <View style={styles.listItemContainer}>

        <Image source={require("../Images/plasticsword.png")} styles={styles.equipmentImage} />
          <View style={styles.cardContent}>
            <Text style={styles.itemHeader}>Name: {data.item.name}</Text>
            <Text>Cost: {data.item.cost} Runes</Text>
            <Text>Damage: {data.item.damage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  }

  purchaseEquipment = (email, equipment, cost, damage) => {
      //this.checkRunes();
      const db = firebase.firestore();
      const docUserProfile = db.collection("Game").doc(email);

      //this.getEquipmentPrice();
      const docEquipment = db.collection("Equipment").doc(equipment);

      if (this.state.runes >= this.state.price) {
        //this.minusRunes();
        docUserProfile.update({ Runes: firebase.firestore.FieldValue.increment(-(cost)) });

        //this.addEquipmentToInventory();
        docUserProfile.collection("inventory").doc(equipment).set({name: equipment, itemStatus: "Unequipped", damage: damage, cost: cost });

        //this.showPurchaseSuccess();
        Alert.alert("You have successfully purchased the item");
      }
      else {
        //this.showPurchaseFail();
        Alert.alert("You do not have sufficient Runes");
      }
    }



  listOfEquipment = () => {

    const db = firebase.firestore();
    db.collection("Equipment").get().then(function (query) {
      var returnArray = []
      query.forEach(function (doc) {
        var item = doc.data();
        returnArray.push(item);
        console.log(doc.id, " => ", doc.data().name);
        });
        this.setState({equipmentList: returnArray, loading: false});
    })
  
  }



  showPurchaseSuccess = (text) => {
    Alert.alert(text);
  }

  showPurchaseFail = (text) => {
    Alert.alert(text);
  }


  render() {
      if (!this.state.loading){
        return (  
          <Container>
          <Header>
          <Left>
            <Button onPress={() => this.props.navigation.navigate('Mainpage')} transparent>
              <Icon name='arrow-back' />
              <Text>Back</Text>
            </Button>
          </Left>
          <Body>
            <Title>Shop</Title>
          </Body>
          <Right>
            <Button onPress={() => this.props.navigation.navigate('Mainpage')} transparent>
              <Text>Cancel</Text>
            </Button>
          </Right>
        </Header>
          <FlatList 
          data={this.state.equipmentList}
          renderItem={this.renderEquipment}
          keyExtractor={(item) => item.name} 
          /></Container>)
      }
      else {
        return (<ActivityIndicator/>)
      }
  }
}
export default withUserContext(Shop);


//Design of the page
const styles = StyleSheet.create({
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
itemHeader: {  
    color: 'black',
    fontSize: 20,
},
equipmentImage: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50
}


});

