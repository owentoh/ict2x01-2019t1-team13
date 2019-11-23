import * as React from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import firebase from './firestoreReference';
require("firebase/firestore");


class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>
        Home Screen{'\n'}{'\n'}
        </Text>
        <Button 
          style={styles.headerText}
          title="Create Notes"
          onPress={() => this.props.navigation.navigate('Create')}
        />
        <Button 
          style={styles.headerText}
          title="View Notes"
          onPress={() => this.props.navigation.navigate('View')}
        />
      </View>
    );
  }
}

class CreateNotes extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      title: '',
      message: '',
      duration: '',
      headerText:'Create Note',
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
  }
  
  createNote() {
    const { title, message, duration, date } = this.state;
    var sChars = /[#%^*()_+\-=\[\]{};':"\\|,.<>\/]/;
	
    if(sChars.test(title)){ // Regex test
      Alert.alert('Error', 'Your title contains an invalid character, please enter another title.');
    }else{
    const db = firebase.firestore();
    db.collection('Notes').doc(title).set(
      {
        date,
        message,
        duration,
		lang,
		lat
      });
    
      Alert.alert(
        'Note Status',
        'Note Successfully Created',
      );
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text 
          style={styles.headerText}>
          {this.state.headerText}{'\n'}{'\n'}
        </Text>

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

class ViewNotes extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Create Notes"
          onPress={() => this.props.navigation.navigate('Create')}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Create: CreateNotes,
    View: ViewNotes,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class noteMgmt extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  inputM: {
    width: 300,
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  headerText: {
    paddingTop: 50,
    fontSize: 20,
    fontWeight: 'bold',
  },
});