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

import { Actions } from 'react-native-router-flux';
import { TextInputMask } from 'react-native-masked-text';

import { withNavigation } from 'react-navigation';
import { UserProvider, withUserContext } from "./userContext";

import firebase from './firestoreReference';
import "@firebase/firestore";
require("firebase/firestore");

import FormInput from '../component/FormInput'
import { Formik } from 'formik'
import * as Yup from 'yup'
import ErrorMessage from '../component/Errormessage'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have more than 6 characters '),
  Name: Yup.string()
    .label('Name')
    .required("Please enter your name"),
  Username: Yup.string()
    .label('Username')
    .required("Please enter a Username"),
  Address: Yup.string()
    .label('Address')
    .required("Please enter your address"),
  DOB: Yup.date()
    .label('DOB')
    .required("Please enter your date of birth")
})


class Registration extends Component {

  static contextType = UserProvider;

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

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
      Equipment: '',
      Inventory: [],
      Runes: 0,
      LifeTimeSteps: 0,
    };
  }

  handleUsernamelocalstate = (Username) => {
    this.setState({ Username });
  }

  handlePasswordlocalstate = (Password) => {
    this.setState({ Password })
  };

  handleEmaillocalstate = (Email) => {
    this.setState({ Email })
  };

  handleDOBlocalstate = (DOB) => {
    this.setState({ DOB });
  }

  handleNamelocalstate = (Name) => {
    this.setState({ Name })
  };

  handleAddresslocalstate = (Address) => {
    this.setState({ Address })
  };

  //Send verification Email
  sendEmail() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification();
  }

  //Register the user function
  handleSubmit = values => {
    const {
      Username,
      Password,
      Name,
      DOB,
      Email,
      Address,

      Damage,
      CurrentSteps,
      Equipment,
      Inventory,
      Runes,
      LifeTimeSteps
    } = this.state;

    this.handleUsernamelocalstate(values.Username);
    this.handlePasswordlocalstate(values.password);
    this.handleDOBlocalstate(values.DOB);
    this.handleEmaillocalstate(values.email);
    this.handleNamelocalstate(values.Name);
    this.handleAddresslocalstate(values.Address);

    firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        const db = firebase.firestore();
        console.log(values.email);
        console.log(values.Username);
        console.log(this.state.Username)
        console.log(Username);
        db.collection('Users').doc(values.email).set(
          {
            Username: this.state.Username,
            Password: this.state.Password,
            Name: this.state.Name,
            DOB: this.state.DOB,
            Email: this.state.Email,
            Address: this.state.Address,
          });
        db.collection('Game').doc(values.email).set(
          {
            Damage,
            Equipment,
            CurrentSteps,
            Inventory,
            Runes,
            LifeTimeSteps,
          });
        this.props.navigation.navigate("Loading");
        this.sendEmail();
        Alert.alert('Success!!!', 'Please authenticate your account through your email')
      })
      .catch((error) => {
        alert(error);
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Formik
          initialValues={{ email: '', password: '', DOB: '', Name: '', Address: '', Username: '' }}
          onSubmit={values => {
            this.handleSubmit(values)
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting,
          }) => (
              <View style={styles.container}>
                <Text style={styles.welcome}>Register an account</Text>
                <FormInput
                  name='Username'
                  value={values.Username}
                  onChangeText={handleChange('Username')}
                  placeholder='Username'
                  iconName='ios-person'
                  iconColor='#2C384A'
                  onBlur={handleBlur('Username')}
                />
                <ErrorMessage errorValue={touched.Username && errors.Username} />

                <FormInput style={styles.text}
                  name='password'
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder='Password'
                  secureTextEntry
                  iconName='ios-lock'
                  iconColor='#2C384A'
                  onBlur={handleBlur('password')}
                />
                <ErrorMessage errorValue={touched.password && errors.password} />

                <FormInput style={styles.text}
                  name='Name'
                  value={values.Name}
                  onChangeText={handleChange('Name')}
                  placeholder='Name'
                  iconName='ios-person'
                  iconColor='#2C384A'
                  onBlur={handleBlur('Name')}
                />
                <ErrorMessage errorValue={touched.Name && errors.Name} />

                <FormInput style={styles.welcome}
                  name='email'
                  value={values.email}
                  onChangeText={handleChange('email')}
                  placeholder='Enter email'
                  autoCapitalize='none'
                  iconName='ios-mail'
                  iconColor='white'
                  onBlur={handleBlur('email')}
                />
                <ErrorMessage errorValue={touched.email && errors.email} />

                {/* <TextInputMask
                  style={styles.inputbox} //DOB
                  placeholder='Date of Birth'
                  type={'datetime'}
                  keyboardType='number-pad'
                  options={{ format: 'DD/MM/YYYY' }}
                  onChangeText={this.handleDOBlocalstate}
                  value={this.state.DOB}
                /> */}

                <FormInput
                  name='DOB'
                  value={values.DOB}
                  onChangeText={handleChange('DOB')}
                  placeholder='Date of birth'
                  iconName='ios-calendar'
                  iconColor='#2C384A'
                  onBlur={handleBlur('DOB')}
                />
                <ErrorMessage errorValue={touched.DOB && errors.DOB} />

                <FormInput style={styles.text}
                  name='Address'
                  value={values.Address}
                  onChangeText={handleChange('Address')}
                  placeholder='Address'
                  iconName='ios-home'
                  iconColor='#2C384A'
                  onBlur={handleBlur('Address')}
                />
                <ErrorMessage errorValue={touched.Address && errors.Address} />

                <TouchableOpacity style={styles.button} //Log in
                  onPress={handleSubmit}>
                  <Text>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} //Log in
                  onPress={() => this.props.navigation.navigate("Login")}>
                  <Text>Back</Text>
                </TouchableOpacity>

              </View>
            )}
        </Formik>
      </KeyboardAvoidingView>
    )
  }
}
export default withNavigation(withUserContext(Registration))

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