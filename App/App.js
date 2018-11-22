import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
const URL = "http://aaceda86.ngrok.io";

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  async componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }


  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    //  const gameArea = await fetch(URL+"/geoapi/allowedarea").then(res => res.json())   
    //  const pos = { coordinates: [longitude, latitude] }
    //  const opt = {method: "POST", 
    //               body: JSON.stringify(pos),
    //               headers: new Headers({
    //                 "Content-Type": 'application/json'
    //                 })
    //               }
    //  const response = await fetch(URL+"/geoapi", opt ).then(res => res.json());
    const address = await Location.reverseGeocodeAsync({ latitude, longitude })
    //  this.setState({gameArea, response, latitude, longitude, address})
    this.setState({ latitude, longitude, address })
  };

  render() {

    return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});

