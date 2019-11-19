import React, { createContext, useState } from "react";
import '@firebase/firestore'
import firebase from 'firebase';

// const initialState = {
//     UserData: { },
// };

//export const UserContext = createContext();
const UserContext = createContext();
//export const UserConsumer = UserContext.Consumer;

export class UserProvider extends React.Component {

    static contextType = UserProvider;

    constructor(props) {
        super(props);
        this.state = {
            UserData: {}
        };
    }

    getValues = () => {
        return {
            UserData: this.state.UserData
        }
    }

    setUserData = (UserData) => {
        this.setState({ UserData: UserData })
    };

    watchUserData = () => {
        const db = firebase.firestore();
        var user = firebase.auth().currentUser
        this.setUserData(db.collection("Users").doc(user).get())
    }

    render() {
        return (
            <UserContext.Provider value={this.getValues()}>
                {/*             
            watchUserData: this.watchUserData,
            UserData: this.state.UserData,
            favouriteAnimal: this.state.favouriteAnimal, */}

                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export function withUserContext(Component) {
    class ComponentWithContext extends React.Component {
        render() {
            return (
                <UserContext.Consumer>
                    {(value) => <Component {...this.props} UserProvider={value} />}
                </UserContext.Consumer>
            );
        };
    }

    return ComponentWithContext;
}

// import React, { createContext } from 'react'

// const FireStoreContext = createContext();

// export const FirestoreProvider = FireStoreContext.Provider;
// export const FirestoreConsumer = FireStoreContext.Consumer;

// export const withFireStoreHOC = Component => props => (
//     <FireStoreConsumer>
//       {state => <Component {...props} firebase={state} />}
//     </FireStoreConsumer>
//   )