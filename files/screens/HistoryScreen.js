import React, {useState, useEffect, useCallback} from 'react';
import {View,
        StyleSheet,
        BackHandler,
        RefreshControl,
        Alert,
        ActivityIndicator,
        FlatList} from 'react-native';

import ApiConfig from '../server/ApiConfig'
import PostBox from '../modals/PostBox';
import Color from '../constants/Color'

import Share from 'react-native-share';
import AsyncStorage from '@react-native-community/async-storage';
import CommentModal from './subScreens/CommentModal';
import DrawerScreenBox from '../modals/DrawerScreenBox';

const HistoryScreen = props=> {

const [refreshing, setRefreshing] = useState(false);

const [postData, setPostData] = useState([]);
const [accessToken, setAccessToken] = useState('');
const [isLoading, setLoading] = useState(true);
const [modalLoad, setModalLoad] = useState(false);

const [upCount, setUpCount] = useState(false);
const [downCount, setDownCount] = useState(false);

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const onRefresh = useCallback(() => {
  setRefreshing(true);

  wait(500).then(() => setRefreshing(false));
}, [refreshing]);

useEffect(()=>{
  getData();
    fetch(ApiConfig.RECENT_MEME_URL)
    .then(res => res.json())
    .then(data => {
      if(data.recentMemes){
        // setPostData([ ...postData, data.recentMemes])
        setPostData([data.recentMemes])
        setLoading(false);
      }else{
        Alert.alert(
          'LolWhoa Says',
          'Something went wrong..', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }, ], {
              cancelable: false
          }
       )
      }
  }
    ).catch((err)=> {
      // if(err.message){
      //   Alert.alert(
      //     'LolWhoa Says',
      //     err.message, [{
      //         style: 'cancel'
      //     }, {
      //         text: 'OK',
      //     }, ], {
      //         cancelable: false
      //     }
      //  )
      // }
      setLoading(false);
    })
},[refreshing, upCount, downCount]);

const onShareHandler = (slug, uuid) => {
    const shareOptions = {
        title: 'Share via',
        message: 'some message',
        url: `https://lolwhoa.com/${slug}/${uuid}`,
        filename: 'test' , // only for base64 file in Android
    };
    Share.open(shareOptions).
    then(res=> res).
    catch(err => {
      //
    });
}

const upVoteHandler = (val) => {
getData();
val = val.toString();

// if(upCount > DBcount){
//   if(upCount > DBcount){
//     setUpCount(DBcount);
//   } else {
//     setUpCount(DBcount - 1);
//   }
// } else {
//   setUpCount(DBcount + 1);
//   if(downCount > DBdownCount){
//     setDownCount(downCount - 1);
//   }
// }

    fetch(ApiConfig.LIKE_POST_URL,{
    method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json',
        Authorization:`Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        value : 1,
        meme_id: val,
      }),
    }).
    then(response=> response.json()).
    then(data=> {
      setUpCount(!upCount)
      console.log(data)}).
    catch(err=> {
      //
    });
}

const downVoteHandler = (val) => {
getData();
val = val.toString();

// if(downCount > DBcount){
//   if(downCount > DBcount){
//     setDownCount(DBcount);
//   } else {
//     setDownCount(DBcount - 1);
//   }
// } else {
//   setDownCount(DBcount + 1);
//   if(upCount > DBupCount){
//     setUpCount(upCount - 1);
//   }
// }

    fetch(ApiConfig.DISLIKE_POST_URL,{
    method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json',
        Authorization:`Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        value : 0,
        meme_id: val,
      }),
    }).
    then(response=> response.json()).
    then(data=> {
      setDownCount(!downCount)
      console.log(data)}).
    catch(err=> {
      //
    });
}

const getData = async () => {
        let value = await AsyncStorage.getItem('access_token')
        if(value !== null) {
            setAccessToken(value);
        }
    }

    const setData = async (val, uuid) => {
        if(uuid != null && val != null){
        await AsyncStorage.setItem('slug', val);
        await AsyncStorage.setItem('uuid', uuid);
        }
    }

    const handleBackButton = () => {
      if(props.navigation.isFocused()){
      Alert.alert(
          'Exit App',
          'Exiting the application?', [{
              text: 'Cancel',
              style: 'cancel'
          }, {
              text: 'OK',
              onPress: () => BackHandler.exitApp()
          }, ], {
              cancelable: false
          }
       )
     }
     return true;
    }
    
    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      };
    },[]);

    const onSinglePostHandler = (val, id)=>{
      let slug = val.toString();
      setData(slug, id);
    
      if(slug && id){
        setLoading(false);
          props.navigation.navigate('SinglePost');
      }
    }

const onCancelHandler = (val, uuid) => {
  let slug = val.toString();
  setModalLoad(!modalLoad);
  setData(slug, uuid);
}

const onRandomPersonProfile = async(name, id)=>{
  const userId = id.toString();
  if(name != null && userId != null)
  await AsyncStorage.setItem('userName', name);
  await AsyncStorage.setItem('userId', userId);
  props.navigation.navigate('Profile');
}

const renderData = itemData => {

return(
    <PostBox
    source={itemData.item.UserAvatar != null ? {uri: ApiConfig.PROFILE_URL+itemData.item.UserAvatar} :
    require('../assets/img/default_male.png')}

    onPressProfile={()=>{
      onRandomPersonProfile(itemData.item.user.name, itemData.item.user.id)
    }}

    name={itemData.item.user.name}
    title={itemData.item.title}

    titleOnPress={()=>{
      onSinglePostHandler(itemData.item.slug, itemData.item.uuid)}
    }

    created_at={itemData.item.date_age}
    view_count={itemData.item.view_count}
    tags={itemData.item.tags}
    sourceThumb={{uri: ApiConfig.IMAGE_URL+itemData.item.thumbnail}}
    share_count={itemData.item.share_count}
    upvotesCount={ itemData.item.upvotes}
    downvotesCount={ itemData.item.downvotes}
    totalComments= {itemData.item.totalComments}

    upvote={()=>{
      !accessToken ? props.navigation.navigate('Login') :
      upVoteHandler(itemData.item.id)}
    }

    downvote={()=>{
      !accessToken ? props.navigation.navigate('Login') :
      downVoteHandler(itemData.item.id)}
    }

    share={()=>{
      !accessToken ? props.navigation.navigate('Login') :
      onShareHandler(itemData.item.slug, itemData.item.uuid)}
    }

    postImgOnPress={()=>{
      onSinglePostHandler(itemData.item.slug, itemData.item.uuid)}
    }

    onPostComment={()=>{
      !accessToken ? props.navigation.navigate('Login') :
      onCancelHandler(itemData.item.slug, itemData.item.uuid)}
    }

    />
    )
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
  <View style={styles.screen} >


    <FlatList
      data={postData[0]}
      renderItem={renderData}
      keyExtractor={(key,index)=> key = index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />

    <CommentModal
      modalVisible={modalLoad}
      onCancel={onCancelHandler}
    />

</View>
</DrawerScreenBox>
);
}
}

const styles= StyleSheet.create({
screen :{
    flex: 1,
    backgroundColor: Color.primaryColor
}
});

export default HistoryScreen;