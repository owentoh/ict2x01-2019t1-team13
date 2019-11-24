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

  async componentWillMount(){
    const db = firebase.firestore();
    await db.collection("Notes").get().then(function (query) {
      var returnArray = []
      query.forEach(function (doc) {
        var note = doc.data();
        note.id = doc._document.key.path.segments[doc._document.key.path.segments.length-1]
        returnArray.push(note);
        // console.log(doc._document.key.path.segments[doc._document.key.path.segments.length-1]);
      });
      this.setState({noteList: returnArray, loading: false});
      
    }.bind(this));
  }
  
  renderNotes = (data) => {
    return <View>
      <View style={styles.noteContainer}>
        {/* <Text>{data.note.doc}</Text> */}
        <Text>{data.item.id}:</Text>
        <Text>{data.item.message}</Text>
        <Button title="Delete" onPress={() => this.delete(data.item.id)} />
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
                keyExtractor={(note,index) => "listkey"+index} 
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

