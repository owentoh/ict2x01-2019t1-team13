import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';

import firebase from 'firebase';
import "@firebase/firestore";

export default class Profile extends Component {

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

    componentDidMount()
    {
        user = firebase.auth().currentUser.email;
        console.log(user)
        const db = firebase.firestore();
        db.collection("Users").doc(user).get()
            .then(doc => {
                //Saving database data into local state
                this.handleUsernamelocalstate(doc.data().Username);
                this.handleEmaillocalstate(doc.data().Email);
                this.handleDOBlocalstate(doc.data().DOB);
                this.handleNamelocalstate(doc.data().Name);
                this.handleAddresslocalstate(doc.data().Address);
            })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.container}>

                    <Text style={styles.welcome}>Username: {this.state.Username}</Text>
                    <Text style={styles.welcome}>Email Address: {this.state.Email}</Text>
                    <Text style={styles.welcome}>{this.state.DOB}</Text>
                    <Text style={styles.welcome}>{this.state.Name}</Text>
                    <Text style={styles.welcome}>Address:{this.state.Address}</Text>

                    <TouchableOpacity style={styles.button} //Log in
                        onPress={this.viewprofile}>
                        <Text>Return to login page</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}



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


});
