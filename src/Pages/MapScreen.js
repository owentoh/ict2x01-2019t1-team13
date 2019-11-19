import React from 'react';
import {Platform, StyleSheet, Text, View,TextInput,TouchableOpacity, Alert } from 'react-native';
import Gmaptest from '../component/gmaptest'
import Pedometer from '../component/pedometer'

export default class MapScreen extends React.Component {

  constructor() {
    super();
    //this.updateStartEnd = this.updateStartEnd.bind(this);
    this.state = {
      input_start: '',
      input_end: ''
    };
  }

  // 

  

  // EndJourney(player){
  //   player.enRoute = false;
  // }

  //Supporting functions, not important
  updateStartEnd = (start,end) =>{
    this.setState({input_start:start,input_end:end})
  }

  render() {
      const statusbar = (Platform.OS == 'ios') ? <View style = {styles.iosstatusbar}></View> :<View style = {styles.androidstatusbar}></View>
      
    return (

      <View style={styles.container}>

        {statusbar}

        <View style={styles.container2}>
          <Text style={flex = 1}>Start:</Text><TextInput clearTextOnFocus={true} autoFocus={true} onChangeText={a => this.setState({ input_start: a })} style={styles.searchInput} placeholder={this.state.input_start} value={this.state.input_start} />
        </View>
        <View style={styles.container2}>
          <Text style={flex = 1}>End:</Text><TextInput onChangeText={a => this.setState({ input_end: a })} style={styles.searchInput} placeholder={this.state.input_end} value={this.state.input_end} />
        </View>
        <TouchableOpacity onPress={() => this.child.searchRoutes(this.state.input_start, this.state.input_end)} style={styles.button} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
        <Gmaptest updateStartEnd={this.updateStartEnd} ref={child => { this.child = child }} {...this.props} />
        <Pedometer/>

        {/* <Compass/> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container2: {
    // flex:0,
    flexDirection:"row",
    backgroundColor:'#48BBEC',
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
    //fontFamily:"sans-serif-thin",
    borderBottomColor:"black"
  },
  container3:{

  },
  iosstatusbar: {
    zIndex:1,
    backgroundColor:'red',
    height:20
  },
  androidstatusbar:{
    zIndex:1,
    backgroundColor:'red',
    height:24
  },
  button:{
    height:40,
    backgroundColor:'black',
    borderColor:'black',
    // marginLeft:10,
    // width:80,
    alignItems:'stretch',
    justifyContent:'center'
  },
  buttonText:{
    fontSize:18,
    color:'white',
    alignSelf:'center'
  },
  searchInput:{
    flex:5,
    height:40,
    width:250,
    fontSize:18,
    borderWidth:1,
    color:'black',
    borderColor:'#48BBEC',
    borderRadius:1
  }
});
