import React, { useState, useEffect } from 'react';
import {StyleSheet, TouchableOpacity, StatusBar, Image} from 'react-native';
import { Drawer, Body, Container, Header, Left, Right, Button, Title, View } from 'native-base';
import SideBar from '../components/SideBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from '../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';
import { ImageCache } from '../components/ImageCache';


const DrawerScreenBox = (props) =>{

  const [drawerFlag, setDrawerFlag] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const getData = async() => {
    let value = await AsyncStorage.getItem('access_token');
   
    if(value != null){
      setAccessToken(value);
    }
  }

  getData();

 
    const closeDrawer = () =>{
      setDrawerFlag(false);
      
    };
    
    const openDrawer = () => { 
      setDrawerFlag(true);
      
    };

    return(
    <Drawer 
    // ref ={(ref) =>  {drawer = ref }} 
      open={drawerFlag}
      onClose={()=> closeDrawer()}
      content={<SideBar navigation={props.navigation} />} 
     >
      <Container>
          <Header iosBarStyle='light-content' style={{backgroundColor: Color.primaryColor}}>
            <StatusBar backgroundColor='black'/>
              <Left >
                  <TouchableOpacity 
                  style={{paddingLeft: 7}}
                    onPress={()=>openDrawer()}>

                    <Icon name='bars' color='white' size={25}/>

                  </TouchableOpacity>
              </Left>

              <Body style={{alignItems:'flex-end'}}>
                    <ImageCache style={{width: 50, height: 40}} source={require('../assets/img/logo.png')}/>
              </Body>

              <Right>

                <View style={{flexDirection: 'row', justifyContent: 'space-around' }}>

                    <TouchableOpacity 
                      style={{paddingRight: 20}}
                      onPress={()=>{
                          accessToken === '' ? props.navigation.navigate('Login') :
                          props.navigation.navigate('Notify')}}
                    >

                        <Icon name='bell' color='white' size={25}/>
                    
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={{paddingRight: 5}}
                      onPress={()=>{
                        props.navigation.navigate('SearchBar')}
                      }
                      transparent
                    >

                        <Icon name='search' color='white' size={25}/>

                    </TouchableOpacity>

                    </View>

              </Right>
          </Header>
          {props.children}
      </Container>
    </Drawer>
 );
}

const styles = StyleSheet.create({

});

export default DrawerScreenBox;