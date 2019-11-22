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
import {withNavigation} from 'react-navigation';
import "@firebase/firestore";
import { UserConsumer,UserProvider, withUserContext } from './userContext'

class Mainpage extends Component {

    //static contextType = UserProvider;

    componentDidMount(){
        // interval = setInterval(() => {
        //     if (this.props.userProvider.increaseStep != 0){
        //         console.log("got update")
        //     } 
        //     else{
        //         console.log("no update")
        //     }
        // }, 1000); //run with ms
    }

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

//          const monster = (this.props.userProvider.increaseStep == 0) ? <Image source={require('../Images/monsterStand.png')}/>
//  : <Image source={require('../Images/monsterHit.png')}/>
        let monster
        if (this.props.userProvider.hp <= 0) {
            monster = <Image source={require('../Images/monsterDead.png')} />
        }
        else if (this.props.userProvider.increaseStep == 0) {
            monster = <Image source={require('../Images/monsterStand.png')} />
        }
        else {
            monster = <Image source={require('../Images/monsterHit.png')} />
        }


        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <View style={styles.container}>
        <Text style={styles.welcome}>Monster HP: {this.props.userProvider.hp} / 1000</Text>
        <Text style={styles.welcome}>Current Damage: {this.props.userProvider.totalDamage}</Text>

                            {monster}
                        </View>

                    
            </KeyboardAvoidingView>
        )
    }
}
export default withNavigation(withUserContext(Mainpage))



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
