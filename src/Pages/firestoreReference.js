import * as firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyAk1kpPBPwJTGbdzIB9LUpJpXMy69fOUoI",
  authDomain: "walk-df0f7.firebaseapp.com",
  databaseURL: "https://walk-df0f7.firebaseio.com",
  projectId: "walk-df0f7",
  storageBucket: "walk-df0f7.appspot.com",
  messagingSenderId: "939704801477",
  appId: "1:939704801477:web:9cf1576ffed467c6a838ac",
  measurementId: "G-7PVC81VGB7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//Firebase Functions
const Firebase = {

  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },

  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },

  signOutUser : ()=>{
    return firebase.auth().signOut()
  },

  checkUserState: user =>{
    return firebase.auth().onAuthStateChanged(user)
  },

  createNewUser: userData =>
  {
    return firebase
      .firestore()
      .collection('Users')
      .doc('${userData.uid}')
      .set(userData)
  }
}

export default firebase;