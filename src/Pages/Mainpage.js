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

import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import "@firebase/firestore";
import { UserConsumer,UserProvider, withUserContext } from './UserContext'

class Mainpage extends Component {

    //static contextType = UserProvider;


    constructor(props) {
        super(props);
        this.state = {
            UserData: props.UserProvider.UserData
        };
        
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <View style={styles.container}>
                            <Text style={styles.welcome}>Welcome to W.A.L.K {this.props.UserProvider.UserData.DOB} Mainpage</Text>
                            <TouchableOpacity style={styles.button} //Log in
                                onPress={() => this.props.navigation.navigate("Login")}>
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    
            </KeyboardAvoidingView>
        )
    }
}
export default withUserContext(Mainpage)



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
