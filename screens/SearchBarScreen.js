import React, { useState, useEffect } from 'react';
import {View, StatusBar, TextInput, BackHandler, Image, Text, StyleSheet, TouchableOpacity, Alert, FlatList} from 'react-native';
import {Header, Container} from 'native-base';
import Color from '../constants/Color';
import  Icon  from 'react-native-vector-icons/FontAwesome5';
import PostBox from '../modals/PostBox';
import ApiConfig from '../server/ApiConfig';
import AsyncStorage from '@react-native-community/async-storage';

const SearchBarScreen = props=> {
    const [serachText, setSearchText] = useState('');
    const [userSearchData, setUserSearchData] = useState([]);

    const searchTextChange = val =>{
        setSearchText(val);
    }

    const handleBackButton = () => {

        if (props.navigation.isFocused()) {
         props.navigation.navigate('HomeScreen');
      }
      return true;
        }
      
      useEffect(() => {
          onSerachMemeHandler();
          BackHandler.addEventListener('hardwareBackPress', handleBackButton);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
          };
        },[serachText]);

const onSerachMemeHandler = ()=>{
    if(serachText){
        fetch(ApiConfig.SEARCH_MEME_URL,{
          method: 'Post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            search: serachText,
          })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status){
                setUserSearchData(data.posts)
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

}


const renderData = itemData => {
    return(
        <View style={styles.userTitleInfo} >
            <TouchableOpacity 
                activeOpacity={0.6} 
                onPress={()=>{userPostData(itemData.item.slug, itemData.item.uuid)}} 
                style={styles.btnImgUser} 
            >

                <Image style={{width: 80, height: 80}} source={itemData.item.thumbnail ?
                     {uri: ApiConfig.IMAGE_URL+itemData.item.thumbnail} :
                      require('../assets/img/default_male.png')} />

            </TouchableOpacity>

            <View style={{paddingLeft: 5}}>

                <TouchableOpacity 
                    activeOpacity={0.6} 
                    onPress={()=>{userPostData(itemData.item.slug, itemData.item.uuid)}}
                >

                    <Text style={{color: 'white'}} >{itemData.item.title}</Text>

                </TouchableOpacity>
                <Text style={{color: 'white'}}>{itemData.item.tags}</Text>
            </View>
        </View>
    );
}

const userPostData = async(slug, id) =>{
    if(slug && id){
        await AsyncStorage.setItem('slug', slug);
        await AsyncStorage.setItem('uuid', id);
        props.navigation.navigate('SinglePost')
    }
}


return(
    <Container style={styles.screen}>
        <View style={styles.serachbar}>
            <Header style={styles.headerBar}>
            <StatusBar backgroundColor='black'/>
                <TextInput
                    style={styles.searchTextInput}
                    placeholder='search meme'
                    placeholderTextColor = {Color.placeholderColor}
                    onChangeText={searchTextChange}
                    value={serachText}
                />
                <TouchableOpacity 
                    style={{justifyContent: 'center',top: 5, right: 30}}
                    onPress={onSerachMemeHandler}
                    >
                    <Icon name='search' size={22} color='white'/>
                </TouchableOpacity>
            </Header>
        </View>
        <View style={{flex: 1}}>
            <FlatList
                data={userSearchData}
                renderItem={renderData}
                keyExtractor={(key, index)=> key == index.toString()}
            />

        



        </View>

    </Container>
);
}

const styles= StyleSheet.create({
screen :{
    backgroundColor: Color.primaryColor,
},
serachbar :{
    
},
headerBar :{
    backgroundColor: Color.accent,
    height: 70,
    padding: 10,
    paddingHorizontal: 10,
    borderBottomColor: Color.primaryColor,
    borderBottomWidth: 2
},
searchTextInput :{
    backgroundColor: Color.primaryColor,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 25,
    padding: 12,
    color: 'white',
    borderColor: 'white',

},
userTitleInfo :{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.accent,
    padding: 5,
    borderBottomColor: Color.primaryColor,
    borderBottomWidth: 2
},
btnImgUser :{
    borderRadius: 40,
    overflow: 'hidden',
    margin: 5
},
});

export default SearchBarScreen;