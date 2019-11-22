import React from 'react'
import firebase from 'firebase';
import "@firebase/firestore";
import { Alert } from 'react-native';

export default class Loading extends React.Component {

    componentDidMount() {
        //this.props.navigation.navigate(user ? "Mainpage" : "Login")
        console.log(firebase.auth().currentUser.emailVerified)
        firebase.auth().onAuthStateChanged(user => {
            if (!user.emailVerified) {
                this.props.navigation.navigate("Login")
                Alert.alert("Please authenicate your email")
            }
            else {
                this.props.navigation.navigate("SN")
            }
        })
    }
    render() {
        return null;
    }
}

