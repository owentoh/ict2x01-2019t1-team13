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
        userDetails: " ",
        damage:1,
        totalDamage: 1,
        currentStepCount: 0,
        hp: 1000,
        increaseStep: 0,
        userLoggedin: false,
        userRole:" "
        Role:"Player"
    };


    componentDidMount() {
        this._subscribe();
        interval = setInterval(() => {
            if (this.state.userLoggedin){
                console.log("my current damage", this.state.totalDamage)
                if(this.state.increaseStep != 0){
                    this.setState({
                        hp: (this.state.hp - (this.state.increaseStep*this.state.totalDamage))
                    })
                    console.log(this.state.hp, "monster left this hp")
                }
                if(this.state.hp <= 0){
                    console.log("monster diedddddddddddddddddddddddddddd")
                    this.addEXP(this.state.userDetails)
                    this.addRunes(this.state.userDetails)
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
                this.addSteps(increaseBy, this.state.userDetails)
            }
        });
    }

    addEXP = (user) =>{
        const db = firebase.firestore();
        const docUserProfile = db.collection("Game").doc(user);
        docUserProfile.update({ Exp: firebase.firestore.FieldValue.increment(100) });
    }

    addSteps = (steps, user) =>{
        const db = firebase.firestore();
        const docUserProfile = db.collection("Game").doc(user);
        docUserProfile.update({ CurrentSteps: firebase.firestore.FieldValue.increment(steps) });
    }

    addRunes = (user) => {
        const db = firebase.firestore();
        const docUserProfile = db.collection("Game").doc(user);
        docUserProfile.update({ Runes: firebase.firestore.FieldValue.increment(10) });
    }

    generateMob = () => {
        this.setState ({hp: 1000})
    }

    setTotalDamage = (damage) => {
        this.setState({totalDamage: damage})
    }

    setDamage = (damage) => {
        this.setState({damage: damage})
    }

    setUserRole = (userRole) => {
        this.setState({userRole: userRole})
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

    setUserLoggedin = (toggle) => {
        this.setState({userLoggedin: toggle})
    }

    setRole = (str)=>{
        this.setState({Role:str})
    }

    getValues = () => {
        return {
            contextData: this.state.contextData,
            stepCount: this.state.stepCount,
            journeyStarted: this.state.journeyStarted,
            userDetails: this.state.userDetails,
            damage:this.state.damage,
            totalDamage: this.state.totalDamage,
            currentStepCount: this.state.currentStepCount,
            hp: this.state.hp,
            increaseStep: this.state.increaseStep,
            userLoggedin: this.state.userLoggedin,
            role:this.state.Role,
            userRole: this.state.userRole,
            
            setRole:this.setRole,
            setDamage : this.setDamage,
            setUserDetails : this.setUserDetails,
            setContextData : this.setContextData,
            setJourneyStarted : this.setJourneyStarted,
            setTotalDamage : this.setTotalDamage,
            setUserLoggedin : this.setUserLoggedin,
            setUserRole: this.setUserRole

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
