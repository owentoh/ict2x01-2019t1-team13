//import { AppRegistry } from 'react-native';
import App from './App';
//import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

import Firebase from './src/Pages/firestoreReference'

import {FireStoreProvider,WithFirebaseHOC} from './src/Pages/FirebaseContext'

export default Firebase

export {FireStoreProvider,WithFirebaseHOC}