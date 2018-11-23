import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, KeyboardAvoidingView} from 'react-native';
import LoginForm from './LoginForm';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: '',
            password: '',
            distance: ''
        }
    }


    render(){
        return(
            <KeyboardAvoidingView behavior="padding" style = {styles.container}>
                <View style={styles.logoContainer}>
                    <Image 
                        style = {styles.logo}
                        source={require('../../logo/logo.png')}
                    />
                    <Text style = {styles.title}>Login to view friends nearby:</Text>
                </View>
                <View style={styles.formContainer}>
                    <LoginForm />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center' 
    },
    logo: {
        width: 100,
        height: 100
    },
    title: {
        color: '#FFF',
        marginTop: 10,
        textAlign: 'center'
    }
});