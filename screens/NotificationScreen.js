import React, { useState, useEffect, useCallback } from 'react';
import {View, 
        Text, 
        FlatList, 
        RefreshControl,
        BackHandler, 
        ActivityIndicator, 
        TouchableOpacity, 
        Image,
        StyleSheet} from 'react-native';
import ApiConfig from '../server/ApiConfig';
import DrawerScreenBox from '.././modals/DrawerScreenBox';
import Color from '../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';



const NotificationScreen = props=> {
const [isLoading, setLoading] = useState(true);
const [userNotify, setuserNotify] = useState([]);
const [accessToken, setAccessToken] = useState('');

const  [refreshing, setRefreshing] = useState(false);


function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  
    wait(500).then(() => setRefreshing(false));
  }, [refreshing]);

    
const getData = async() =>{
    let token = await AsyncStorage.getItem('access_token');
    setAccessToken(token);
}


const handleBackButton = () => {
    
        if (props.navigation.isFocused()) {
         props.navigation.goBack();
      }
      return true;
        }

      useEffect(() => {
          getData();
          allNotificationHandler();
          BackHandler.addEventListener('hardwareBackPress', handleBackButton);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
          };
        });

    const allNotificationHandler = ()=>{
        
            fetch(ApiConfig.ALL_NOTIFICATION_URL,{
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization:`Bearer ${accessToken}`,
              }
            })
            .then(res => res.json())
            .then(data => {
                if(data.status){
                    setuserNotify(data.notifications)
                    setLoading(false);
                }
            }).
            catch(err=>{
                Alert.alert(
                    'LolWhoa Says:',
                    'Check Connection.', [{
                        style: 'cancel'
                    }, {
                        text: 'OK',
                    }]
                 )
            })
    
    }

    const userPostData = async(slug, id)=>{
        if(slug != null && id != null){
            await AsyncStorage.setItem('slug', slug);
            await AsyncStorage.setItem('uuid', id);
            props.navigation.navigate('SinglePost');
            setLoading(false);
        }else{
            Alert.alert(
                'LolWhoa Says:',
                'Something went wrong...', [{
                    style: 'cancel'
                }, {
                    text: 'OK',
                }]
             )
        }
    }

    const renderData = itemData => {
        return(
            
        <TouchableOpacity 
            activeOpacity={0.6} 
            onPress={()=>{
                userPostData(itemData.item.meme.slug, itemData.item.meme.uuid)
            }} 
        >

                <View style={styles.userTitleInfo} >
                  <View style={styles.imgUser}>

                    <Image style={{width: 80, height: 80, borderRadius: 40,}} 
                        source={itemData.item.user.avatar != null ?
                         {uri: ApiConfig.PROFILE_URL+itemData.item.user.avatar} :
                          require('../assets/img/default_male.png')} />
                          
                  </View>
    
                <View style={{paddingLeft: 5}}>
    
    
                     <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}} >
                         {itemData.item.user.name}
                     </Text>
    
                    <Text style={{color: 'white'}}>{itemData.item.type}</Text>
                    <Text style={{color: 'white', paddingTop: 5}}>{itemData.item.date_age}</Text>
                </View>
                </View>
         </TouchableOpacity>
            
        );
    }

if(isLoading){
    return(
        <View style={{flex: 1,backgroundColor: Color.primaryColor, justifyContent: 'center'}} >
            <ActivityIndicator color='white' size='large' />
        </View>
    );
}else{
 return(
 <DrawerScreenBox navigation={props.navigation}>
     <View style={styles.screen}>
            <FlatList
                data={userNotify}
                renderItem={renderData}
                keyExtractor={(key, index)=> key == index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
     </View>
</DrawerScreenBox>
);
}
}

const styles= StyleSheet.create({
screen :{
    flex: 1,
    backgroundColor: Color.accent
},
userTitleInfo :{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.accent,
    padding: 5,
    borderBottomColor: Color.primaryColor,
    borderBottomWidth: 2
},
imgUser :{
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    margin: 5
},
});

export default NotificationScreen;