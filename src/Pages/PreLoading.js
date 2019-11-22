import React from 'react'
import firebase from 'firebase';
import "@firebase/firestore";
import { Alert } from 'react-native';

export default class PreLoading extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "Mainpage" : "Login")
        })
    }
    render() {
        return null;
    }

} 