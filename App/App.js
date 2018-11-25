import React from 'react';
import { Platform, Button, View, Text} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants, Location, Permissions, MapView } from 'expo';
import Login from './components/login/Login';
import Friends from './components/Friends';
import AccessDenied from './components/AccessDenied';

const serverURL = "https://www.ramsbone.dk"

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
              description={"Latitude: " + this.state.latitude.toFixed(7) + ", Longitude: " + this.state.longitude.toFixed(7)}
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

  render() {
    return (
      <Login />
    )
  }
}

class FriendsScreen extends React.Component {
  render() {
    return (
      <Friends />
    )
  }
}

class DeniedScreen extends React.Component {
  render() {
    return (
      <AccessDenied/>
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
  }
}

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}