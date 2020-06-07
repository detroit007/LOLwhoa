import React, { useEffect, useState } from 'react';
import {View, Alert, ActivityIndicator, BackHandler, Text, Image, TouchableOpacity} from 'react-native'
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import{createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import SignUpScreen from '../screens/signUpScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TrendingScreen from '../screens/TrendingScreen';
import ModalViewMenu from '../modals/ModalViewMenu';
import NotificationScreen from '../screens/NotificationScreen';
import MemeEditScreen from '../screens/MemeEditScreen';
import ForgetPasswordScreen from '../screens/subScreens/ForgetPasswordScreen';
import AccountSettingScreen from '../screens/subScreens/AccountSettingScreen';
import ContactScreen from '../screens/subScreens/ContactScreen';
import EditProfileScreen from '../screens/subScreens/EditProfileScreen';
import UploadGalleryScreen from '../screens/subScreens/UploadGalleryScreen';
import UploadURLScreen from '../screens/subScreens/UploadURLScreen';
import test from '../components/test';

import AsyncStorage from '@react-native-community/async-storage';


import Icon from 'react-native-vector-icons/FontAwesome5'
import Color from '../constants/Color'
import PopUpMenu from '../screens/subScreens/PopUpMenu';
import SideBar from '../components/SideBar';
import DrawerScreenBox from '../modals/DrawerScreenBox';
import signUpScreen from '../screens/signUpScreen';
import SearchBarScreen from '../screens/SearchBarScreen';
import SinglePostScreen from '../screens/subScreens/SinglePostScreen';
import UserProfileScreen from '../screens/subScreens/UserProfileScreen';
import ReplyModal from '../screens/subScreens/ReplyModal';


let accessToken;
const getData = async () => {
  let value = await AsyncStorage.getItem('access_token');
  if(value != null){
      accessToken = value;
  }
}
getData();

const BottomTabNavigation = createMaterialBottomTabNavigator({
Home: {screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor})=> <Icon color = {tintColor} size={22} name='home'/>,
          }
        },
History: {screen: HistoryScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor})=> <Icon color = {tintColor} size={22} name='history'/>,
        }
          },
Trending: {screen: TrendingScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor})=> <Icon color = {tintColor} size={22} name='poll'/>,

        }}
},{
    initialRouteName: 'Home',
    labeled: false,
    activeColor: 'white',
    inactiveColor: '#505050',
    shifting: false,
    barStyle :{
      backgroundColor : Color.primaryColor,
    }
});

// const AuthScreen = createStackNavigator({
//     Login : {screen: LoginScreen,
//         navigationOptions: {
//             header:()=> false
//         }},
//     SignUp : {screen: SignUpScreen,
//        navigationOptions: {
//            header: ()=> false
//        }},
//     ForgetPass: {screen: ForgetPasswordScreen,
//         navigationOptions :{
//             header : ()=> false,
//     }
//     },
// });


const AppScreen = createStackNavigator(
    {
     HomeScreen: {screen: BottomTabNavigation,
            navigationOptions:{
                // header: ()=> false,
            //     headerLeft:() => (<TouchableOpacity 
            //       onPress={(props)=> {props.navigation.navigate('Edit')}}>)
            //      <Icon style={{marginLeft: 10}} name="pencil" size={25} color="white" />
            //  </TouchableOpacity>),
            }
    },
     Notify: NotificationScreen,
     Edit: MemeEditScreen,
     AccountSetting: AccountSettingScreen,
     Contact: ContactScreen,
     EditProfile: EditProfileScreen,
     UploadGallery: UploadGalleryScreen,
     UploadUrl: UploadURLScreen,
     SearchBar : SearchBarScreen,
     SinglePost: {screen: SinglePostScreen,
        // navigationOptions:{
        //     gestureEnabled: false,
        // }
    },
     Profile: {screen: UserProfileScreen},
     Login : {screen: LoginScreen,
        navigationOptions: {
            header:()=> false
        }},
     SignUp : {screen: SignUpScreen,
       navigationOptions: {
           header: ()=> false
       }},
    ForgetPass: {screen: ForgetPasswordScreen,
        navigationOptions :{
            header : ()=> false,
    }
    },
    },
    {
         defaultNavigationOptions :{
           header: ()=> false,
         headerStyle: {backgroundColor: '#363636'},
         headerTitle: ()=> <Image style={{width: 60, height: 30}} source={require('../assets/img/logo.png')}/>,
         headerTitleAlign:'center',
         headerTintColor: '#fff',
            headerLeft:() => (<TouchableOpacity 
                     onPress={()=> {}}>
                    <Icon style={{marginLeft: 10}} name="pencil" size={25} color="white" />
                </TouchableOpacity>),
            headerRight: ()=> (<View style={{flexDirection: 'row'}}>

            <TouchableOpacity onPress={()=> {}}>
            <Icon style={{marginRight: 10, paddingRight: 10}} name="bell" size={25}
            color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> {}}>
            <Icon style={{marginRight: 10}} name="search" size={25} color="white" />
            </TouchableOpacity>
          </View>),
         }
    }
    );

    // const AuthLoading = props =>{

    //     let LoggedInValue;
    //     const CheckLoggedIn = async()=>{
    //         LoggedInValue = await AsyncStorage.getItem('access_token');
            
    //         props.navigation.navigate(LoggedInValue == null ? 'Auth' : 'App');
    //     }

    //     useEffect(()=>{
    //         CheckLoggedIn();
    //     },[LoggedInValue]);

    //     return(
    //         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //             <ActivityIndicator/>
    //         </View>
    //     );
    // };


    const NavigationScreen = createStackNavigator(
        {
        //   Auth: {
        //       screen: AuthScreen,
        //       navigationOptions: {
        //         header: ()=> false
        //     }
        //     },
          App: {
              screen: AppScreen,
              navigationOptions: {
                header: ()=> false
            }
            },
        //   AuthLoading : {
        //         screen: AuthLoading,
        //         navigationOptions: {
        //           header: ()=> false
        //       }
        //       }
        },
        {
          initialRouteName: 'App',
        }
      );

      



    // NavigationScreen.navigationOptions = () => {
    //     return{
    //             headerLeft:() => (<TouchableOpacity onPress={()=>navigation.navigate('UploadGalleryScreen')}>
    //                         <Icon style={{marginLeft: 10}} name="pencil" size={25} color="white" />
    //                       </TouchableOpacity>),
    //             headerRight: ()=> (<View style={{flexDirection: 'row'}}>

    //                         <TouchableOpacity onPress={()=> {}}>
    //                         <Icon style={{marginRight: 10, paddingRight: 10}} name="bell" size={25}
    //                         color="white" />
    //                         </TouchableOpacity>

    //                         <TouchableOpacity onPress={()=> {}}>
    //                         <Icon style={{marginRight: 10}} name="search" size={25} color="white" />
    //                         </TouchableOpacity>
    //                       </View>)
    //         }
    // }

export default createAppContainer(NavigationScreen);