import React, { Component, useContext, } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert
} from 'react-native';


import firebase from 'firebase';
import "@firebase/firestore";
import { withNavigation} from 'react-navigation';
import { UserProvider, withUserContext } from "./userContext";
import { Ionicons } from '@expo/vector-icons'
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
    .min(6, 'Password must have more than 6 characters ')
})

class LoginScreen extends Component {

  static contextType = UserProvider;

  static navigationOptions = {
    header: null
  };


  constructor(props) {
    super(props);
    //initate the blank state
    this.state = {
      Username: '',
      Email: '',
      Password: '',
      Address: '',
      DOB: '',
      Name: '',
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

  setName = (name) => {
    this.props.userProvider.setContextData(name);
  }

  handleSubmit = values => {
    const {
      Password,
      Email,
      Username,
      Address,
      DOB,
      Name,
    } = this.state;

    console.log(values.email)

    //Extract data from database using email address
    firebase.auth().signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        const db = firebase.firestore();
        const user = firebase.auth().currentUser.email;
        db.collection("Users").doc(user).get()
          .then(doc => {
            const email = doc.data().Email;
            this.state.Address = doc.data().Address;
            console.log(email)
            Alert.alert('Welcome ' + this.state.Email);
          })
        this.props.navigation.navigate("SN");
        //Actions.Mainpage();
      }).catch((error) => {
        alert(error);
      });
  }


  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Formik
          initialValues={{ email: '', password: '' }}
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
            isSubmitting
          }) => (
              <View style={styles.container}>

                <Image style={{ width: 100, height: 100 }}
                  source={require('../Images/tap.png')} />

                <Text style={styles.welcome}>Welcome to W.A.L.K</Text>

                <FormInput
                  name='email'
                  value={values.email}
                  onChangeText={handleChange('email')}
                  placeholder='Enter email'
                  autoCapitalize='none'
                  iconName='ios-mail'
                  iconColor='#2C384A'
                  onBlur={handleBlur('email')}
                  autoFocus
                />
                <ErrorMessage errorValue={touched.email && errors.email} />


                <FormInput
                  name='password'
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder='Enter password'
                  secureTextEntry
                  iconName='ios-lock'
                  iconColor='#2C384A'
                  onBlur={handleBlur('password')}
                />
                <ErrorMessage errorValue={touched.password && errors.password} />


                <TouchableOpacity style={styles.button} //Log in
                  onPress={handleSubmit}>
                  <Text>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} //Log in
                  onPress={() => this.props.navigation.navigate("Register")}>
                  <Text>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} //tester 
                  onPress={() => this.setName("admin")}>
                  <Text>{this.props.userProvider.contextData}</Text>
                </TouchableOpacity>



              </View>
            )}
        </Formik>
      </KeyboardAvoidingView>
    )
  }
}
export default withNavigation(withUserContext(LoginScreen))


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#433a64',
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
    fontSize: 15,
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
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text:
  {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: 'white'
  }


})