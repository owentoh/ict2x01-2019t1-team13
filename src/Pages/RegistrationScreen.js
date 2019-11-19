import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert
} from 'react-native';
import {TextValidator}from 'react-native-validator-form'
import { Actions } from 'react-native-router-flux';
import { TextInputMask } from 'react-native-masked-text';
import firebase from './firestoreReference';
require("firebase/firestore");

export default class Registration extends Component {

  constructor() {
    super();
    //initate the blank state
    this.state = {

      //User Profile 
      Username: '',
      Name: '',
      DOB: '',
      Address: '',
      Email: '',
      Password: '',
      //Game profile stats
      Damage: 0,
      CurrentSteps: 0,
      Equipment:'',
      Inventory: [ ],
      Runes:0,
      LifeTimeSteps:0,
    };
  }

  //Register the user function
  createAccount = () => {
    const { Username, Password, Name, DOB, Email, Address,Damage,CurrentSteps,Equipment,Inventory,Runes,LifeTimeSteps } = this.state;

    if(Password.length<6)
    {
      Alert.alert('Please enter a password with at least 6 characters');
    }

    const expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (expression.test(Email.toLowerCase())==false)
    {
      Alert.alert('Please enter a valid email address')
    }

    //connect to firestore
    // const db = firebase.firestore();
    // const UserRef = db.collection('User').where('Username','==', Username)
    // if(UserRef)
    // {
    //   Alert.alert('Username has been taken. Please choose another username')
    // }

    firebase.auth().createUserWithEmailAndPassword(Email.trim(), Password)
      .then(() => {
        const db = firebase.firestore();
        db.collection('Users').doc(Email).set(
          {
            Username,
            Password,
            Name,
            DOB,
            Email,
            Address,
          });
        db.collection('Game').doc(Email).set(
          {
            Damage,
            Equipment,
            CurrentSteps,
            Inventory,
            Runes,
            LifeTimeSteps,
          }
        )
        this.sendEmail();
        this.props.navigation.navigate("Login");
        Alert.alert('Success!!!', 'Please authenticate your account through your email')
      })
      .catch((error) => {
        alert(error);
      });
  }
  
  //Send verification Email
  sendEmail() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification();
  }

  //save current input state
  Usernamelocalstate = (Username) => {
    this.setState({ Username });
  }

  handlePasswordlocalstate = (Password) => {
    this.setState({ Password })
  };

  handleDOBlocalstate = (DOB) => {
    this.setState({ DOB })
  };

  handleAddresslocalstate = (Address) => {
    this.setState({ Address })
  };

  handleEmaillocalstate = (Email) => {
    this.setState({ Email })
  };

  handleNamelocalstate = (Name) => {
    this.setState({ Name })
  };

  //for navigating back to login page
  Login() {
    Actions.Login()
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} //avoid being blocked 
        behavior="padding">
        <View style={styles.container}>

          <Text style={styles.welcome}>Register an account</Text>

          <TextInput style={styles.inputbox} //username
            placeholder='Username'
            onChangeText={this.Usernamelocalstate}
            value={this.state.Username}
          />

          <TextInput style={styles.inputbox} //password
            placeholder='Password'
            
            keyboardType='default'
            secureTextEntry={true}
            onChangeText={this.handlePasswordlocalstate}
            value={this.state.Password}
          />

          <TextInput style={styles.inputbox} //Name
            placeholder='Name'
            onChangeText={Name => this.setState({ Name })}
            onChangeText={this.handleNamelocalstate}
            value={this.state.Name}
          />

          <TextInput style={styles.inputbox} //Email
            placeholder='Email'
            keyboardType='email-address'
            onChangeText={this.handleEmaillocalstate}
            value={this.state.Email}
          />

          <TextInputMask
            style={styles.inputbox} //DOB
            placeholder='Date of Birth'
            type={'datetime'}
            keyboardType='number-pad'
            options={{ format: 'DD/MM/YYYY' }}
            onChangeText={this.handleDOBlocalstate}
            value={this.state.DOB}
          />

          <TextInput style={styles.inputbox} //Address
            placeholder='Home Address'
            onChangeText={this.handleAddresslocalstate}
            value={this.state.Address}
          />

          <TouchableOpacity style={styles.button} //Log in
            onPress={this.createAccount}>
            <Text>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} //Log in
            onPress={()=>this.props.navigation.navigate("Login")}>
            <Text>Back</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    )
  }
}

//Design of the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#433a64'
  },
  inputbox:
  {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },

  button:
  {
    width: 200,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text:
  {
    color: '#ffffff'
  }


});

// UT_correctAccountdetails(){
//   AssertionError.equal(this.createAccount("owentoh","owentoh","Jin Wen","23/03/2000","owentoh@gmail.com","172A Ang Mo Kio Ave 8"),
//   "Success!!! Please authenticate your account through your email")
// }

// UT_invalidEmail()
// {
//   AssertionError.equal(this.createAccount("owentoh96","owentoh96","JW","23/03/2000","owentoh","172 Ang Mo Kio Ave 8"),
//   "Please enter a valid email address")
// }

// UT_takenUsername()
// {
//   AssertionError.equal(this.createAccount("owentoh","jw1996","Jin Wen","23/03/2000","owentoh@outlook.com","172A Ang Mo Kio Ave 8"),
//   "This username has been taken")
// }

// UT_invalidPassword()
// {
//   AssertionError.equal(this.createAccount("owentoh","owen","Jin Wen","23/03/2000","owentoh@gmail.com","172A Ang Mo Kio Ave 8"),
//   "Please enter a password length of 6 character")
// }