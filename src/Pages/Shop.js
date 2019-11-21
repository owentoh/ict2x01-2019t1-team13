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
  Alert
} from 'react-native';
import firebase from 'firebase'
import {UserProvider,withUserContext} from './userContext';

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
      totalDamage: 0
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
  }
  
  renderEquipment = (data) => {
    return <TouchableOpacity style={{ backgroundColor: '#433a64' }} onPress={() => this.purchaseEquipment("Toh_jin_wen@hotmail.com", data.item.name)}>
      <View style={styles.listItemContainer}>
        <Image source={require("../Images/plasticsword.png")} styles={styles.equipmentImage} />
        <Text style={styles.itemHeader}>{data.item.name}</Text>
        <Text>Cost: {data.item.cost} Runes</Text>
        <Text>Damage: {data.item.damage}</Text>
      </View>
    </TouchableOpacity>
  }

  purchaseEquipment = (email, equipment) => {
      //this.checkRunes();
      const db = firebase.firestore();
      const docUserProfile = db.collection("Game").doc(email);
      docUserProfile.get().then(doc => this.setState({ runes: doc.data().Runes }));

      //this.getEquipmentPrice();
      const docEquipment = db.collection("Equipment").doc(equipment);
      docEquipment.get().then(doc => this.setState({ price: doc.data().cost }));
      docEquipment.get().then(doc => this.setState({ damage: doc.data().damage }));
      

      if (this.state.runes >= this.state.price) {
        //this.minusRunes();
        docUserProfile.update({ Runes: firebase.firestore.FieldValue.increment(-(this.state.price)) });

        //this.addEquipmentToInventory();
        //docUserProfile.update({ Inventory: firebase.firestore.FieldValue.arrayUnion(equipment) });
        docUserProfile.collection("inventory").doc(equipment).set({name: equipment, itemStatus: false, damage: this.state.damage, cost: this.state.price });

        //this.showPurchaseSuccess();
        Alert.alert("You have successfully purchased the item");
      }
      else {
        //this.showPurchaseFail();
        Alert.alert("You do not have sufficient Runes");
      }
    }



  listOfEquipment = () => {
    //Object.entries(peopleFromFirebase).map(item => ({...item[1], key: item[0]}));

    const db = firebase.firestore();
    //return db.collection("Equipment").get();
    db.collection("Equipment").get().then(function (query) {
      var returnArray = []
      query.forEach(function (doc) {
        //console.log("pushing");
        var item = doc.data();
        //console.log(doc.data());
        //item.key = doc.key;
        returnArray.push(item);
        //this.state.equipmentList.push([doc.id, doc.data().name, doc.data().cost, doc.data().damage]);
        console.log(doc.id, " => ", doc.data().name);
        });
        this.setState({equipmentList: returnArray, loading: false});
        //return returnArray;
    })
  //return <Text>{doc.id}</Text>;
  
  }

  addEquipmentToInventory = (username, equipment) => {
    const db = firebase.firestore();
    const useref = db.collection('Profile').doc(username);
    useref.update({
      Inventory: firebase.firestore.FieldValue.arrayUnion(equipment)
    });

  }


  getEquipmentPrice = async (equipment) => {
    const db = await firebase.firestore();
    const docRef = await db.collection("Equipment").doc(equipment);
    await docRef.get().then(doc => this.setState({ price: doc.data().cost }))
    console.log(this.state.price);
  }


  checkRunes = async (username) => {
    const db = firebase.firestore();
    const docRef = db.collection("Profile").doc(username);
    await docRef.get().then(doc => this.setState({ runes: doc.data().Runes }))
  };


  minusRunes = (username, price) => {
    const db = firebase.firestore();
    const useref = db.collection('Profile').doc(username).update({
      Runes: firebase.firestore.FieldValue.increment(price)
    });
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
              <FlatList 
          data={this.state.equipmentList}
          renderItem={this.renderEquipment}
          keyExtractor={(item) => item.name} 
          />)
      }
      else {
        return (<ActivityIndicator/>)
      }
  }
}
export default withUserContext(Shop);


//Design of the page
const styles = StyleSheet.create({
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
itemHeader: {  
    color: '#fff',
    fontSize: 20,
},
equipmentImage: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50
}


});


  

  /*
  testOne(){
    var assert = require('assert');
    var beforePurchaseRunes = checkRunes(poorGuy);
    var beforePurchaseInv = getEquipment(poorGuy).count;
    purchaseEquipment(poorGuy, expensiveSword); // player who have 10 Runes buying 10,000 Runes sword
    assert.equal(checkRunes(poorGuy), 10);
    assert.equal(this.state.price, 10000);
    assert.equal(checkRunes(poorGuy), beforePurchaseRunes);
    assert.equal(getEquipment(poorGuy, expensiveSword), null);
    assert.equal(getEquipment(poorGuy).count, beforePurchaseInv);
    assert.equal(getLog(), "You do not have sufficient Runes");
  }

  testTwo(){
    var assert = require('assert');
    var beforePurchaseRunes = checkRunes(richGuy);
    var beforePurchaseInv = getEquipment(richGuy).count;
    purchaseEquipment(richGuy, cheapSword); // player who have 1 million Runes buying 100 Runes sword
    assert.equal(checkRunes(richGuy), 999,900);
    assert.equal(this.state.price, 100);
    assert.equal((checkRunes(richGuy) + this.state.price), beforePurchaseRunes);
    assert.notEqual(getEquipment(richGuy, cheapSword), null);
    assert.equal((getEquipment(richGuy).count - 1), beforePurchaseInv);
    assert.equal(getLog(), "You have successfully purchased the item");
  }
  
  
  testThree(){
    var assert = require('assert');
    assert.equal(listOfEquipment().count, 10);
  }

    testFour(){
      var assert = require('assert');
      assert.equal(addEquipmentToInventory("walkerKing93", "Gold sword"), );
    }

  
  testFive(){
    var assert = require('assert');
    assert.equal(getEquipmentPrice("Metal sword"), 5000);
  }

    testSix(){
      var assert = require('assert');
      assert.equal(checkRunes("walkerKing93"), 1000000);
    }
  

  
    testSeven(){ 
      var assert = require('assert');
      minusRunes("walkerKing93", 500000);
      assert.equal(checkRunes("walkerKing93"), 500000);
    }

    testEight(){
      var assert = require('assert');
      assert.equal(showPurchaseSuccess("You have successfully purchased the item"), "You have successfully purchased the item");
    }

    testEight(){
      var assert = require('assert');
      assert.equal(showPurchaseSuccess("You have successfully purchased the item"), "You have successfully purchased the item");
    }

  testNine(){
    var assert = require('assert');
    assert.equal(showPurchaseSuccess("You do not have sufficient Runes"), "You do not have sufficient Runes");
  }
  
*/