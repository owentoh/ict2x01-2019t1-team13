import React, { Component } from "react";
import { Text, View, Dimensions, StyleSheet, Alert, Image, Animated, Easing } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase'

require("firebase/firestore");
// import { Pedometer } from "expo-sensors";
// import { AssertionError } from "assert";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const GOOGLE_MAPS_APIKEY = "AIzaSyDxxWG11kj8LaMhDuyZ69YaQaBrTGLxA44";

class gmaptest extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0);

        this.mapView = null;
        this.state = {
            coordinates: [
                {
                    latitude: 1,
                    longitude: 1
                },
                // {
                //     latitude: 1,
                //     longitude: 1
                // }
            ],
            
            noteArrayCoord:[],
            currentLocation: {latitude:0,longitude:0},
            location: null,
            errorMessage: null,
            heading: null,
            truenoth: null,
            camera: {
                center:{
                    latitude: 1.3521,
                    longitude: 103.8198
                },
                pitch:0,
                heading:0
            }
        };
    }

    //   onMapPress = e => {
    //     this.setState({
    //       coordinates: [...this.state.coordinates, e.nativeEvent.coordinate]
    //     });
    //   };

    async componentWillUpdate() {//will keep running update mapview here
    //     this.watchId = navigator.geolocation.watchPosition(
    //         (position) => {
    //             this.setState({
    //                 currentLocation: {
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude
    //                 },
    //             })
    //             // currentCamera = this.mapView.getCamera() ? this.mapView.getCamera() : this.state.camera
    //             // console.log(currentCamera);
    //             // this.mapView.setCamera={camera = currentCamera}
    //             console.log(position.coords.latitude +":"+ position.coords.longitude)
    //         },
    //         (error)=>{
    //             this.setState({currentLocationErr:error.message})
    //         },
    //         {enableHighAccuracy: true, timeout:1, maximumAge:1, distanceFilter:1 }
    //     )
    //     // this.spin()
        this._getLocationAsync;
        console.log(this.state.errorMessage);
    }

    async updateNoteState(){
        const db = firebase.firestore();
        await db.collection("Notes").get().then(function (query) {
            var returnArray = []
            query.forEach(function (doc) {
              var item = doc.data();
              tbp = {lat:item.lat, lng:item.lng};
              returnArray.push(tbp);
              });
              

            this.setState({noteArrayCoord: returnArray, loading: false});     
            console.log(this.state.noteArrayCoord) 
          }.bind(this));
    }

    async componentDidMount(){
        await this.updateNoteState();
          
    }

    _getLocationAsync = async () => {
        // Checking device location permissions
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        else {
            // Location.watchHeadingAsync(obj => {
            //     this.setState({ heading: obj.trueHeading })
            // })
            // // Location.watchHeadingAsync((obj) => {
            // //   let heading = obj.magHeading;
            // //   this.setState({heading: heading})
            // // })

        }
    };
    
    //For calculating initial region
    regionFrom(lat, lon, distance=4000) {
        distance = distance/2
        const circumference = 40075
        const oneDegreeOfLatitudeInMeters = 111.32 * 1000
        const angularDistance = distance/circumference

        const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
        const longitudeDelta = Math.abs(Math.atan2(
                Math.sin(angularDistance)*Math.cos(lat),
                Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

        return result = {
            latitude: lat,
            longitude: lon,
            latitudeDelta,
            longitudeDelta,
        }
    } 

    async searchRoutes(start, end) {
        if (start == "" || end == "") {
            return "Please ensure start and end is filled up."
        }
        try {
            retMsg = ""
            const sr = await fetch('https://maps.googleapis.com/maps/api/geocode/json?region=sg&address=' + start + '&key=' + GOOGLE_MAPS_APIKEY)
            const SRJson = await sr.json()
            const er = await fetch('https://maps.googleapis.com/maps/api/geocode/json?region=sg&address=' + end + '&key=' + GOOGLE_MAPS_APIKEY)
            const ERJson = await er.json()
            if (SRJson.status == "ZERO_RESULTS") {
                retMsg = retMsg + "Starting address not found."
            }
            if (ERJson.status == "ZERO_RESULTS") {
                retMsg = retMsg + " Destination address not found."
            }

            if (retMsg != "") {
                Alert.alert('Error', retMsg, [{ text: 'OK' }], { cancelable: true })
                return retMsg
            }

            if (SRJson.status == "OK" && ERJson.status == "OK") {
                this.props.updateStartEnd(SRJson.results[0].formatted_address.toString(), ERJson.results[0].formatted_address.toString());
                this.setState({
                    coordinates: [
                        {
                            latitude: parseFloat(SRJson.results[0].geometry.location.lat.toString()),
                            longitude: parseFloat(SRJson.results[0].geometry.location.lng.toString())
                        }, {
                            latitude: parseFloat(ERJson.results[0].geometry.location.lat.toString()),
                            longitude: parseFloat(ERJson.results[0].geometry.location.lng.toString())
                        }]
                })
                console.log("Coordinates State has been set.")
                return "Route found."
            } else {
                Alert.alert('Error', "Maps Error, please try again.", [{ text: 'OK' }], { cancelable: true })
                console.log("Maps Error, please try again.")
                return "Maps Error, please try again."
            }
        } catch (error) {
            Alert.alert('Error', "Please ensure you have internet connectivity.", [{ text: 'OK' }], { cancelable: true })
            console.log("trycatch Error:\n")
            console.log(error)
            return "Maps Error, please try again."
        }
    }

    render() {
        let LoadingText = 'Loading...';
        let display = LoadingText;

        if (this.state.errorMessage)
            display = this.state.errorMessage;


        display = Math.round(JSON.stringify(this.spinValue))

        if (display < 0)
            display += 360
        if (display > 360)
            display -= 360
        return (


            <View style={styles.container}>
                <MapView 
                    
                    style={StyleSheet.absoluteFillObject}
                    showsCompass={true}
                    showsUserLocation={true}
                    followsUserLocation
                    initialRegion={{
                        latitude: 1.3521,
                        longitude: 103.8198,
                        latitudeDelta: this.regionFrom(1.3521,103.8198).latitudeDelta, //hardcoded to show singapore 
                        longitudeDelta:  this.regionFrom(1.3521,103.8198).longitudeDelta //hardcoded to show singapore
                    }}
                    ref={c => (this.mapView = c)}>
                    {this.state.coordinates.map((coordinate, index) => (
                        <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
                    ))}

                    {this.state.coordinates.map((coordinate, index) => (
                        <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
                    ))}
                    {this.state.coordinates.length >= 2 && (

                        <MapViewDirections

                            origin={this.state.coordinates[0]}
                            waypoints={
                                this.state.coordinates.length > 2
                                    ? this.state.coordinates.slice(1, -1)
                                    : null
                            }
                            destination={
                                this.state.coordinates[this.state.coordinates.length - 1]
                            }
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                            optimizeWaypoints={true}
                            mode="WALKING"
                            onStart={params => {
                                console.log(
                                    `Started routing between "${params.origin}" and "${
                                    params.destination
                                    }"`
                                );
                            }}
                            onReady={result => {
                                if (result != null) {

                                    console.log("Distance:" + result.distance + " km");
                                    console.log("Duration: " + result.duration + " min.");
                                    // console.log(result);
                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: width / 20,
                                            bottom: height / 20,
                                            left: width / 20,
                                            top: height / 20
                                        }
                                    })
                                };
                            }}
                            onError={errorMessage => {
                                console.log('GOT AN ERROR.', errorMessage);
                            }}
                        />
                    )}

                    <MapView.Marker
                        coordinate={this.state.currentLocation} >
                            <View style={styles.radius}>
                                <View style = {styles.marker}/>
                                
                            </View>
                        </MapView.Marker>
                        
                </MapView>
            </View>
        );
    }
}

// Device dimensions so we can properly center the images set to 'position: absolute'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radius:{
        height:50,
        width:50,
        borderRadius:50/2,
        overflow:"hidden",
        backgroundColor:'rgba(0,122,255,0.1)',
        borderWidth:1,
        borderColor:'rgba(0,122,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker:{
        height: 20,
        width:20,
        borderWidth:3,
        borderColor:'white',
        borderRadius:20/2,
        overflow:'hidden',
        backgroundColor: '#007AFF'
    },
    map: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute'
    },
    text: {
        color: '#263544',
        fontSize: 80,
        transform: ([{ translateY: -(deviceHeight / 2 - (deviceHeight / 2 - 10) / 2) - 50 }])
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    arrowContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    arrow: {
        width: deviceWidth / 7,
        height: deviceWidth / 7,
        left: deviceWidth / 2 - (deviceWidth / 7) / 2,
        top: deviceHeight / 2 - (deviceWidth / 7) / 2,
        opacity: 0.9
    }
});


export default gmaptest;