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
      <View style={styles.listItemContainer}>
        <Image source={require("../Images/plasticsword.png")} styles={styles.equipmentImage} />
        <Text>{data.item.name}</Text>
        <Text>{data.item.itemStatus}</Text>
        <Button title="Equip" onPress={() => this.equip(data.item.name)} />
        <Button title="Unequip" onPress={() => this.unequip(data.item.name)} />
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
export default withUserContext(Inventory);


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

