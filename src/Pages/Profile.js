import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Container, Tab, TabHeading, Tabs, StyleProvider, Icon, Title, Header, Left, Body, Right, Button, Text} from 'native-base';


import { withNavigation } from 'react-navigation';
import { UserProvider, withUserContext } from "./userContext";

import firebase from 'firebase';
import "@firebase/firestore";

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

class Profile extends Component {

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

    componentDidMount() {
        user = firebase.auth().currentUser.email;
        const db = firebase.firestore();
        db.collection("Users").doc(user).get()
            .then(doc => {
                //Saving database data into local state
                this.handleUsernamelocalstate(doc.data().Username);
                this.handleEmaillocalstate(doc.data().Email);
                this.handleDOBlocalstate(doc.data().DOB);
                this.handleNamelocalstate(doc.data().Name);
                this.handleAddresslocalstate(doc.data().Address);
                this.handlePasswordlocalstate(doc.data().Password);
                console.log(doc.data().Username)
                console.log(this.state.Username)
            })
    }

    logout = () =>{
        firebase.auth().signOut();
        this.props.navigation.navigate("PreLoading")
    }

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
          LifeTimeSteps,
          Exp
        } = this.state;
    
        this.handleUsernamelocalstate(values.Username);
        this.handlePasswordlocalstate(values.password);
        this.handleDOBlocalstate(values.DOB);
        this.handleEmaillocalstate(values.email);
        this.handleNamelocalstate(values.Name);
        this.handleAddresslocalstate(values.Address);

        //Update user account
        firebase.auth().currentUser.updatePassword(values.password)
          .then(() => {
            const db = firebase.firestore();
            db.collection('Users').doc(user).set(
              {
                Username: this.state.Username,
                Password: this.state.Password,
                Name: this.state.Name,
                DOB: this.state.DOB,
                Address: this.state.Address,
                Email: this.state.Email
              });
            this.props.navigation.navigate("Mainpage");
            Alert.alert('Success!!!', 'You have updated your account details')
          })
          .catch((error) => {
            alert(error);
          });
      }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        email: this.state.Email, password: this.state.Password, DOB: this.state.DOB, Name: this.state.Name,
                        Address: this.state.Address, Username: this.state.Username 
                    }}
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
                        <Container>
                        <Header>
                        <Left>
                          <Button onPress={() => this.props.navigation.navigate('Mainpage')} transparent>
                            <Icon name='arrow-back' />
                            <Text>Back</Text>
                          </Button>
                        </Left>
                        <Body>
                          <Title>Profile</Title>
                        </Body>
                        <Right>
                          <Button onPress={() => this.props.navigation.navigate('Mainpage')} transparent>
                            <Text>Cancel</Text>
                          </Button>
                        </Right>
                      </Header>
                            <View style={styles.container}>
                                <Text style={styles.welcome}>Update account</Text>
                                <FormInput
                                    name='Username'
                                    value={values.Username}
                                    onChangeText={handleChange('Username')}
                                    iconName='ios-person'
                                    iconColor='#2C384A'
                                    onBlur={handleBlur('Username')}
                                />
                                <ErrorMessage errorValue={touched.Username && errors.Username} />

                                <FormInput style={styles.text}
                                    name='password'
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    iconName='ios-lock'
                                    iconColor='#2C384A'
                                    onBlur={handleBlur('password')}
                                />
                                <ErrorMessage errorValue={touched.password && errors.password} />

                                <FormInput style={styles.text}
                                    name='Name'
                                    value={values.Name}
                                    onChangeText={handleChange('Name')}
                                    iconName='ios-person'
                                    iconColor='#2C384A'
                                    onBlur={handleBlur('Name')}
                                />
                                <ErrorMessage errorValue={touched.Name && errors.Name} />

                                <FormInput style={styles.welcome}
                                    name='email'
                                    value={values.email}
                                    editable = {false}
                                    onChangeText={handleChange('email')}
                                    autoCapitalize='none'
                                    iconName='ios-mail'
                                    iconColor='white'
                                    onBlur={handleBlur('email')}
                                />
                                <ErrorMessage errorValue={touched.email && errors.email} />

                                <FormInput
                                    name='DOB'
                                    value={values.DOB}
                                    onChangeText={handleChange('DOB')}
                                    iconName='ios-calendar'
                                    iconColor='#2C384A'
                                    onBlur={handleBlur('DOB')}
                                />
                                <ErrorMessage errorValue={touched.DOB && errors.DOB} />

                                <FormInput style={styles.text}
                                    name='Address'
                                    value={values.Address}
                                    onChangeText={handleChange('Address')}
                                    iconName='ios-home'
                                    iconColor='#2C384A'
                                    onBlur={handleBlur('Address')}
                                />
                                <ErrorMessage errorValue={touched.Address && errors.Address} />

                                <TouchableOpacity style={styles.button} //Log in
                                    onPress={handleSubmit}>
                                    <Text>Update account</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} //Log in
                                    onPress={this.logout}>
                                    <Text>Logout</Text>
                                </TouchableOpacity>

                            </View>
                        </Container>
                        )}
                </Formik>
            </KeyboardAvoidingView>
        )
    }
}
export default withNavigation(withUserContext(Profile))



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3D72A4',
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


});
