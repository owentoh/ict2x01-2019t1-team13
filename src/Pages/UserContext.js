import React from 'react'
import { Pedometer } from "expo-sensors";

import firebase from 'firebase'
require("firebase/firestore");
const UserContext = React.createContext();



export class UserProvider extends React.Component {
    static contextType = UserProvider;

    state = {
        contextData: "tester2", //Default Value
        stepCount: "hello",
        journeyStarted: false,
        userDetails: {},
        totalDamage: 1,
        currentStepCount: 0,
        hp: 1000,
        increaseStep: 0,
        userLoggedin: true
    };


    componentDidMount() {
        this._subscribe();
        interval = setInterval(() => {
            if (this.state.userLoggedin){
                //Retrieve equipment damage
                const db = firebase.firestore();
                db.collection("Game").doc("Toh_jin_wen@hotmail.com").collection("inventory").get().then(function (query) {
                    var countDamage = 1
                    query.forEach(function (doc) {
                      if (doc.data().itemStatus == true) {
                        countDamage += doc.data().damage;
                      }})
                      this.setState({ totalDamage : countDamage})
                    }.bind(this));
                if (this.state.journeyStarted){
                    this.setState({ totalDamage : this.state.totalDamage * 1.5})
                }
                console.log("my current damage", this.state.totalDamage)
                if(this.state.increaseStep != 0){
                    this.setState({
                        hp: (this.state.hp - (this.state.increaseStep*this.state.totalDamage))
                    })
                    console.log(this.state.hp, "monster left this hp")
                }
                if(this.state.hp <= 0){
                    console.log("monster diedddddddddddddddddddddddddddd")
                    this.addEXP()
                    this.addRunes()
                    this.generateMob()
                }
                else {
                    console.log("monster aliveeeeeeeeeeeeeeeeeeeeeeeeeeee")
                }
                this.setState({
                    increaseStep: 0
                })
            } 
        }, 1000); //run with ms
    }

    _subscribe = () => {
        console.log("sub in")
        this._subscription = Pedometer.watchStepCount(result => {
            console.log("insideee")
            if (result.steps>this.state.currentStepCount){
                var increaseBy = result.steps - this.state.currentStepCount
                console.log(increaseBy)
                this.setState({currentStepCount: result.steps,
                    increaseStep: increaseBy});
                this.addSteps(increaseBy)
            }
        });
    }

    addEXP = () =>{
        const db = firebase.firestore();
        const docUserProfile = db.collection("Game").doc("Toh_jin_wen@hotmail.com");
        docUserProfile.update({ Exp: firebase.firestore.FieldValue.increment(100) });
    }

    addSteps = (steps) =>{
        const db = firebase.firestore();
        const docUserProfile = db.collection("Game").doc("Toh_jin_wen@hotmail.com");
        docUserProfile.update({ CurrentSteps: firebase.firestore.FieldValue.increment(steps) });
    }

    addRunes = () => {
        const db = firebase.firestore();
        const docUserProfile = db.collection("Game").doc("Toh_jin_wen@hotmail.com");
        docUserProfile.update({ Runes: firebase.firestore.FieldValue.increment(10) });
    }

    generateMob = () => {
        this.setState ({hp: 1000})
    }

    setTotalDamage = (damage) => {
        this.setState({totalDamage: damage})
    }

    setUserDetails = (user) => {
        this.setState({userDetails: user});
    }

    setContextData = (thing) => {
        this.setState({contextData: thing});
    }

    setJourneyStarted = (toggle) =>{
        this.setState({journeyStarted: toggle})
    }

    // equip(name) {
    //     firebase.firestore().collection("Game").doc("Toh_jin_wen@hotmail.com").collection("inventory").doc(name).update({ itemStatus: true });
    //     Alert.alert("You have successfully equip the item");
    // }

    // unequip(name) {
    //     firebase.firestore().collection("Game").doc("Toh_jin_wen@hotmail.com").collection("inventory").doc(name).update({ itemStatus: false });
    //     Alert.alert("You have successfully unequip the item");
    // }

    getValues = () => {
        return {
            contextData: this.state.contextData,
            stepCount: this.state.stepCount,
            journeyStarted: this.state.journeyStarted,
            userDetails: this.state.userDetails,
            totalDamage: this.state.totalDamage,
            currentStepCount: this.state.currentStepCount,
            hp: this.state.hp,
            increaseStep: this.state.increaseStep,
            userLoggedin: this.state.userLoggedin,

            


            setUserDetails : this.setUserDetails,
            setContextData : this.setContextData,
            setJourneyStarted : this.setJourneyStarted,
            setTotalDamage : this.setTotalDamage,
            equip : this.equip,
            unequip : this.unequip
        }
    }

    render() {
        return (
            <UserContext.Provider value={this.getValues()}>
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
                    {(value) => <Component {...this.props} userProvider={value} />}
                </UserContext.Consumer>
            );
        };
    }

    return ComponentWithContext;
}