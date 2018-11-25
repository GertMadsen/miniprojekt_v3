import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

class AccessDenied extends Component {
    constructor(props){
        super(props);
    }
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

export default withNavigation(AccessDenied);
