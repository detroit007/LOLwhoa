import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet, Modal, TouchableHighlight, Dimensions, Image, Button} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const ModalViewMenu = props=> {
const WIDTH = Dimensions.get('window');

const setData = async () => {
  try{
  await AsyncStorage.removeItem('access_token');
  props.navigation.navigate('Login');
  }catch(err){
    Alert.alert(err.message);
  }
}

return(
<View style={styles.screen} >
    <View style={styles.container}>
            <Text style={{color: 'white'}}>The default value is </Text>

            <Button  title='Contact' onPress={()=>{props.navigation.navigate('Contact')}}/>
            <Button  title='Edit Profile' onPress={()=>{props.navigation.navigate('EditProfile')}}/>
            <Button  title='Upload Image' onPress={()=>{props.navigation.navigate('UploadGallery')}}/>
            <Button  title='Account Setting' onPress={()=>{props.navigation.navigate('AccountSetting')}}/>

            <Button  title='SignOut' onPress={()=>{
                        setData()}
                        }/>

            {/* <Button  title='SinglePost' onPress={()=>{props.navigation.navigate('SinglePost')}}/>
            <Button  title='PopUp' onPress={()=>{props.navigation.navigate('PopUp')}}/> */}



            <View>



              {
//              <Modal
//                animationType="slide"
//                transparent={true}
//                onDismiss={()=>{
//
//                }}
//                onRequestClose={() => {
//                  Alert.alert('Modal has been closed.');
//                }}>
//                  <View style={styles.modalWrapper}>
//                    <TouchableHighlight onPress={()=> {}}>
//                      <View >
//                      <Image style={{width:30, height:30, top:2, right:9, left:1}} source={require('../assets/img/default_male.png')} />
//                      <View style={{flexDirection:'column'}}>
//                      <Text style={[styles.modalWrapperTitle, {left:9, marginBottom:0}]}>User Name</Text>
//                      <Text style={{left:9, color:'white',fontSize:11}}>See your profile</Text>
//                      </View>
//                      </View>
//                    </TouchableHighlight>
//                    <TouchableHighlight onPress={()=> {}}>
//                      <View style={styles.modalWrapperTextContainer}>
//                      <Image style={styles.modalWrapperIcon} source={require('../assets/img/default_male.png')} />
//                      <Text style={styles.modalWrapperText}>Edit Profile</Text>
//                      </View>
//                    </TouchableHighlight>
//                    <TouchableHighlight onPress={()=> {}}>
//                      <View style={styles.modalWrapperTextContainer}>
//                      <Image style={[styles.modalWrapperIcon ,{left:-25}]} source={require('../assets/img/default_male.png')} />
//                      <Text style={[styles.modalWrapperText, {left:-8}]}>Settings</Text>
//                      </View>
//                    </TouchableHighlight>
//                    <TouchableHighlight onPress={()=> {}}>
//                      <View style={styles.modalWrapperTextContainer}>
//                      <Image style={[styles.modalWrapperIcon ,{left:-26}]} source={require('../assets/img/default_male.png')} />
//                      <Text style={[styles.modalWrapperText, {left:-9}]}>Contact</Text>
//                      </View>
//                    </TouchableHighlight>
//                    <TouchableHighlight onPress={()=> {}}>
//                      <View style={styles.modalWrapperTextContainer}>
//                      <Image style={[styles.modalWrapperIcon ,{left:-27.6}]} source={require('../assets/img/default_male.png')} />
//                      <Text style={[styles.modalWrapperText, {left:-11}]}>Logout</Text>
//                      </View>
//                    </TouchableHighlight>
//                  </View>
//                </Modal>

                }

            </View>
            </View>
</View>
);
}

const styles= StyleSheet.create({
screen :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
},
modalWrapper: {
      margin:28,
      padding: 10,
      backgroundColor: '#434343',
      opacity: 0.8,
      bottom: 25,
      left: 175,
      right: -28,
      alignItems: 'center',
      position: 'absolute'
    },
    modalWrapperTextContainer: {
      paddingTop: 7,
      paddingBottom: 4,
      flexDirection: 'row'
    },
    modalWrapperIcon: {
      width:15,
      height:15,
      top:2,
      right:15,
    },
    modalWrapperText: {
      color: 'white',
    },
    modalWrapperTitle: {
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white'
    },
});

export default ModalViewMenu;