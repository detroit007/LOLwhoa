import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Color from '../constants/Color';
import Icon from 'react-native-vector-icons/FontAwesome5'

import AsyncStorage from '@react-native-community/async-storage';
import ApiConfig from '../server/ApiConfig'
import { BgImageCache, ImageCache } from './ImageCache';

const SideBar = (props) => {

  const [avatarimg, setAvatarImg] = useState(null);
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userID, setUserID] = useState('');

  const [locFlag, setLocFlag] = useState(false);



  useEffect(()=>{
    getData();
  });

  const getData = async()=>{
    let name = await AsyncStorage.getItem('user_name')
    let logUserId = await AsyncStorage.getItem('loginUser_id');
    let avatar = await AsyncStorage.getItem('user_avatar');
    let value = await AsyncStorage.getItem('access_token');
    
    if(name != null && avatar != null){
      let uName = name.toString();
      setUserName(uName);
      setAvatarImg(avatar);
    }
    if(value != null){
      setAccessToken(value);
      // setLocFlag(!locFlag);
    }
  
    if(logUserId != null){
      setUserID(logUserId);
      // setLocFlag(!locFlag);
    }
  }

    const setData = async () => {
        try{
        // await AsyncStorage.removeItem('access_token');
        // await AsyncStorage.removeItem('slug');
        // await AsyncStorage.removeItem('uuid');
        // await AsyncStorage.removeItem('user_name');
        // await AsyncStorage.removeItem('user_avatar');
        AsyncStorage.clear();
        // const resetAction = props.navigation.reset({
        //   index: 0,
        //   actions : [
        //   props.navigation.navigate('Login')],
        // })
        // props.navigation.navigate('Login');
        // props.navigation.dispatch('Login');
        // console.log(props.navigation.navigate());
        if(accessToken === '' ){
            props.navigation.navigate('Login')
        }else{
            props.navigation.replace('HomeScreen')
        }
        // props.navigation.navigate('Login');
        }catch(err){
          // Alert.alert(err.message);
        }
      }

  return(
    <View style={styles.screen}>
      <View>  
        <View style={styles.profileCont}>

          <BgImageCache style={{width: '100%', height: 190,}}
             source={require('../assets/img/profile_Background.jpg')}>
          <View style={styles.overlay}></View>

            <View style={{paddingTop: 70, paddingLeft: 10}}>

              <TouchableOpacity onPress={async()=> {
                userID != null ?
                  await AsyncStorage.setItem('userId', userID) : null;
                !accessToken  ? props.navigation.navigate('Login') :
                props.navigation.push('Profile')}}>

                  {avatarimg != null ?
                  <Image style={styles.profileImg} source={{uri: ApiConfig.PROFILE_URL+avatarimg}}/> :
                  <ImageCache source={require('../assets/img/default_male.png')} style={styles.profileImg}
                  />
                }       

              </TouchableOpacity>

              <TouchableOpacity onPress={()=> {
                !accessToken  ? props.navigation.navigate('Login') :
                props.navigation.push('Profile')}}>

                <Text style={{color: 'white', fontWeight: 'bold', paddingTop: 10}}>
                  {!userName ? 'User Name' : userName}
                  </Text>

              </TouchableOpacity>
            </View>

          </BgImageCache>

        </View>
        <View style={styles.drawerBody}>

          <View style={styles.optionText}>
              <Icon name='pencil-alt' size={20} color= 'white'/>
            <TouchableOpacity 
              style={{paddingLeft: 20}}
              onPress={()=>{
                  !accessToken ? props.navigation.navigate('Login') :
                  props.navigation.navigate('UploadGallery')}}
              >
                <Text style={{fontSize: 18, color: 'white'}}>Create Meme</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionText}>
              <Icon name='user-edit' size={20} color= 'white'/>
            <TouchableOpacity 
              style={{paddingLeft: 20}}
              onPress={()=>{
                  !accessToken ? props.navigation.navigate('Login') :
                  props.navigation.navigate('EditProfile')}}
              >
                <Text style={{fontSize: 18, color: 'white'}}>Profile Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionText}>
              <Icon name='cog' size={20} color= 'white'/>
            <TouchableOpacity 
              style={{paddingLeft: 20}}
              onPress={()=>{
                  !accessToken ? props.navigation.navigate('Login') :
                  props.navigation.navigate('AccountSetting')}}
              >
                <Text style={{fontSize: 18, color: 'white'}}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionText}>
              <Icon name='phone' size={20} color= 'white'/>
            <TouchableOpacity 
              style={{paddingLeft: 20}}
              onPress={()=>{
                  !accessToken ? props.navigation.navigate('Login') :
                  props.navigation.navigate('Contact')}}
              >
                <Text style={{fontSize: 18, color: 'white'}}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionText}>
              <Icon name='sign-out-alt' size={20} color= 'white'/>
            <TouchableOpacity 
              style={{paddingLeft: 20}}
              onPress={()=>{setData()}}>
                <Text style={{fontSize: 18, color: 'white'}}>{!accessToken ? 'Log In' : 'Log Out'}</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen :{
      flex: 1,
      backgroundColor: 'rgba(37, 37, 37,0.9)',
  },
  profileCont :{
    borderBottomColor: Color.accent,
    borderBottomWidth: 2,
    
  },
  profileImg :{
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'white'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  optionText :{
    flexDirection: 'row', 
    paddingVertical: 10, 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.accent,
  },
  drawerBody :{
      padding: 5,
  }
});

export default SideBar;