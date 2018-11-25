import React, { Component } from 'react';
import { Platform, StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import {Constants, Location, Permissions, MapView} from 'expo';

const serverURL = "http://46.101.214.160"

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            isLoading: true,
            friends: [],
        }
    }

    async componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        const { navigation } = this.props;
        this.setState({
            user: navigation.getParam('user'),
            password: navigation.getParam('password'),
            distance: navigation.getParam('distance'),
        });
    }

    _getLocationAsync = async () => {
        const { navigation } = this.props;
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        let userToSend = {
            username: this.state.user,
            password: this.state.password,
            longitude: longitude,
            latitude: latitude,
            distance: Number(this.state.distance),
        }
        const opt = {
            method: "POST",
            body: JSON.stringify(userToSend),
            headers: new Headers({
                "Content-Type": 'application/json'
            })
        }
        const response = await fetch(serverURL + "/api/login", opt).then(res => res.json());

        if (response.status == 403) {
            navigation.navigate('Denied');
        }
        let friends = response.friends;
        this.setState({ latitude, longitude, friends, isLoading: false });
    };

    render() {
        const { navigation } = this.props;
        return (
            this.state.isLoading ? <Text>Loading..</Text> :

                <View style={styles.containerStyle}>
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >

                        <MapView.Marker
                            coordinate={{ longitude: this.state.longitude, latitude: this.state.latitude }}
                            title={"You are here."}
                            description={"Latitude: " + this.state.latitude + ", Longitude: " + this.state.longitude}
                        />

                        {this.state.friends.map(friend => {
                            return <MapView.Marker
                                key={friend.username}
                                coordinate={{ longitude: friend.longitude, latitude: friend.latitude }}
                                title={"Your friend " + friend.username + " is here."}
                                description={"Latitude: " + friend.latitude + ", Longitude: " + friend.longitude}
                                pinColor='green'
                            />
                        })}


                    </MapView>
                </View>
        );
    }
}

export default withNavigation(Friends);

styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue'
    },
    mapStyle: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute'
    },

})