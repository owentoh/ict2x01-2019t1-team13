import * as React from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text } from 'react-native';
import firebase from '../Pages/firestoreReference';
require("firebase/firestore");

class CreateNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      message: '',
      duration: '',
      headerText: 'Create Note',
      ready: false,
      lat: null, 
      lng: null,
      error: null,
    };
  }

  componentDidMount() {
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    that.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year,
    });
    let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60
    };
    this.setState({ ready: false, error: null });
    navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoFailure, geoOptions);
  }

  geoSuccess = (position) => {
    console.log(position.coords.latitude);

    this.setState({
      ready: true,
      lat: position.coords.latitude, 
      lng: position.coords.longitude,
    })
  }
  geoFailure = (err) => {
    this.setState({ error: err.message });
  }

  createNote() {
    const { title, message, duration, date, lat, lng } = this.state;
    var sChars = /[#%^*()_+\-=\[\]{};':"\\|,.<>\/]/;
    if (sChars.test(title) || title=="" || message == "") { // Regex test
      Alert.alert('Error', 'Ensure all fields are properly filled up.');
    } else {
      const db = firebase.firestore();
      db.collection('Notes').doc(title).set(
        {
          date,
          message,
          duration,
          lat,
          lng,
        });

      Alert.alert(
        'Note Status',
        'Note Successfully Created',
      );
      this.props.updateGmapNote();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text 
          style={styles.headerText}>
          {this.state.headerText}{'\n'}{'\n'}
        </Text> */}

        <TextInput
          value={this.state.title}
          onChangeText={(title) => this.setState({ title })}
          placeholder={'Title'}
          style={styles.input}
        />
        <TextInput
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
          placeholder={'Message (Max 200 Chars)'}
          multiline={true}
          maxLength = {200}
          style={styles.inputM}
        />
        
        <TextInput
          value={this.state.duration}
          onChangeText={(duration) => this.setState({ duration })}
          placeholder={'Duration (1-7 Days)'}
          style={styles.input}
          keyboardType = 'numeric'
        />

        <Button
          title={'Submit'}
          style={styles.input}
          onPress={this.createNote.bind(this)}
        />
      </View>
    );
  }
}



export default CreateNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: '#433a64',
    marginBottom: 5,
    marginTop: 5
  },
  inputM: {
    width: 300,
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#433a64',
    marginBottom: 2,
    marginTop: 2,

  },
  headerText: {
    paddingTop: 50,
    fontSize: 20,
    fontWeight: 'bold',
  },
});