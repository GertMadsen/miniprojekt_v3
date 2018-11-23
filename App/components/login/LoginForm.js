import React, {Component} from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity, Text} from 'react-native';

export default class LoginForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: '',
            password: '',
            distance: ''
        }
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

    render(){
        return(
            <View style={styles.container}>
                <TextInput 
                    placeholder="Username"
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    returnKeyType="next"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style = {styles.input}
                    onChangeText = {this.handleUser}
                />
                <TextInput 
                    placeholder="password"
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    returnKeyType="next"
                    onSubmitEditing={() => this.distanceInput.focus()}
                    secureTextEntry
                    style = {styles.input}
                    onChangeText = {this.handlePassword}
                    ref={(input) => this.passwordInput = input}
                />

                <TextInput
                    placeholder="Distance to search"
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    returnKeyType="go"
                    keyboardType="numeric"
                    style={styles.input}
                    onChangeText = {this.handleDistance}
                    ref={(input) => this.distanceInput = input}
                />

                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#2980b9',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: '700'
    }
})