import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Button, Alert } from 'react-native';
import firebase from 'firebase'
import {UserProvider,withUserContext} from './userContext';

require("firebase/firestore");

class AdminNotes extends Component {
  static contextType = UserProvider;

  constructor(props) {
    super(props);
    this.state = {
      noteList : [],
      loading: true
    }
  }

  componentDidMount(){
    const db = firebase.firestore();
    db.collection("Notes").get().then(function (query) {
      var returnArray = []
      query.forEach(function (doc) {
        var note = doc.data();
        returnArray.push(note);
        });
      this.setState({noteList: returnArray, loading: false});        
    }.bind(this));
  }
  
  renderNotes = (data) => {
    return <View>
      <View style={styles.noteContainer}>
        <Text>{data.note.doc}</Text>
        <Text>{data.note.message}</Text>
        <Button title="Delete" onPress={() => this.delete(data.note.doc)} />
      </View>
    </View>
  }

  delete(name) {
    firebase.firestore().collection("Notes").doc(name).delete();
    Alert.alert("You have successfully deleted this note");
  }

  render() {
      if (!this.state.loading){
        return (  
              <FlatList 
                data={this.state.noteList}
                renderItem={this.renderNotes}
                keyExtractor={(note) => note.name} 
          />)
      }
      else {
        return (<ActivityIndicator/>)
      }
  }
}
export default withUserContext(AdminNotes);

//Design of the page
const styles = StyleSheet.create({
  noteContainer: {
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
});

