import React from 'react';
import { Platform, Button, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants, Location, Permissions, MapView } from 'expo';

const serverURL = "http://46.101.214.160"

class HomeScreen extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Welcome',
      headerRight: (
        <Button
        onPress={() => {
              /* 1. Navigate to the Details route with params */
              navigation.navigate('Login');
            }}
          title="Login"
        />
      ),
    };
  };

  state = {
    location: null,
    errorMessage: null,
    isLoading: true
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
    this.setState({ latitude, longitude, isLoading: false })

  };

  render() {
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
          }}       >

          <MapView.Marker
            coordinate={{ longitude: this.state.longitude, latitude: this.state.latitude }}
            title={"You are here"}
            description={"Latitude: "+this.state.latitude.toFixed(7)+", Longitude: "+this.state.longitude.toFixed(7)}
          />

        </MapView>
        
        </View>
    );
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Login',
    };
  };
  state = {
    user: '',
    password: '',
    distance: ''
 }
 
 handleUser = (text) => {
    this.setState({ user: text })
 }
 handlePassword = (text) => {
    this.setState({ password: text })
 }
 handleDistance = (text) => {
  this.setState({ distance: text })
 }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style = {styles.text}>Login to view friends nearby:</Text>
      <TextInput style = {styles.input}
         underlineColorAndroid = "transparent"
         placeholder = " Username"
         placeholderTextColor = "#9a73ef"
         autoCapitalize = "none"
         onChangeText = {this.handleUser}/>
      
      <TextInput style = {styles.input}
         underlineColorAndroid = "transparent"
         placeholder = " Password"
         placeholderTextColor = "#9a73ef"
         autoCapitalize = "none"
         onChangeText = {this.handlePassword}/>
      
      <TextInput style = {styles.input}
         underlineColorAndroid = "transparent"
         placeholder = " Distance to search"
         placeholderTextColor = "#9a73ef"
         autoCapitalize = "none"
         onChangeText = {this.handleDistance}/>
         
      <TouchableOpacity
         style = {styles.submitButton}
         onPress = {
            () => {
              navigation.navigate('Friends', {
                user: this.state.user, password: this.state.password, distance: this.state.distance
              })
            }
         }>
         <Text style = {styles.submitButtonText}> Submit </Text>
      </TouchableOpacity>

      </View>
    );
  }
}

class FriendsScreen extends React.Component {
  state = {
    location: null,
    errorMessage: null,
    isLoading: true,
    friends: [],
  };

  async componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    const { navigation } = this.props;
    this.setState( {user: navigation.getParam('user'), 
                    password: navigation.getParam('password'),
                    distance: navigation.getParam('distance'),
    });
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
    this.setState({ latitude, longitude })
    let userToSend = {
      username: this.state.user,
      password: this.state.password,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      distance: Number(this.state.distance),
    }  
    const { navigation } = this.props;
     const opt = {method: "POST", 
                  body: JSON.stringify(userToSend),
                  headers: new Headers({
                    "Content-Type": 'application/json'
                    })
                  }
     const response = await fetch(serverURL+"/api/login", opt ).then(res => res.json());
     if (response.status == 403) {
      navigation.navigate('Denied');
     }             

     this.setState({friends: response.friends, isLoading: false})
    
  };



  render() {

    const { navigation } = this.props;
    this.state.friends.map(friend => console.log(friend.username))
    console.log(this.state.friends)
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
            title={"You"}
            description={"Latitude: "+this.state.latitude+", Longitude: "+this.state.longitude}
          />

           <MapView.Marker
            coordinate={{ longitude: this.state.longitude, latitude: this.state.latitude+0.01 }}
            title={"Nearby Friend"}
            description={"Latitude: "+this.state.latitude+", Longitude: "+this.state.longitude}
            pinColor='green'
          />

          {/* <MapView.Marker
            coordinate={{ longitude: this.state.longitude+0.01, latitude: this.state.latitude }}
            title={"Nearby Friend"}
            description={"Latitude: "+this.state.latitude+", Longitude: "+this.state.longitude}
            pinColor='green'
          /> */}

        </MapView>        
        </View>
    );
  }
}

class DeniedScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Failed to Login!</Text>
        <Text>Wrong username or Password.</Text>
        <Text>Please try again.!</Text>
        <Button
          title="Back to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    Friends: FriendsScreen,
    Denied: DeniedScreen,
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);


const styles = {
	containerStyle: {
		flex:1,
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
  
 container: {
    paddingTop: 23
 },
 text: {
   margin: 5,
   height: 20,
},
 input: {
    margin: 5,
    height: 40,
    width: 200,
    borderWidth: 1
 },
 submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 5,
    height: 40,
 },
 submitButtonText:{
    color: 'white'
 }

}



const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}