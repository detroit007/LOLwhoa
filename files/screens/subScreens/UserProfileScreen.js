
import React, {useState, useEffect, useCallback} from 'react';
import {View,
        StyleSheet,
        BackHandler,
        Image,
        Text,
        ActivityIndicator,
        RefreshControl,
        FlatList,
        TouchableOpacity,
        } from 'react-native';

import ApiConfig from '../../server/ApiConfig'
import PostBox from '../../modals/PostBox';
import Color from '../../constants/Color'

import Share from 'react-native-share';
import AsyncStorage from '@react-native-community/async-storage';
import CommentModal from '../subScreens/CommentModal';
import DrawerScreenBox from '../../modals/DrawerScreenBox';
import  Icon  from 'react-native-vector-icons/FontAwesome5';
import { ImageCache } from '../../components/ImageCache';

const UserProfileScreen = props=> {

const [refreshing, setRefreshing] = useState(false);


const [postData, setPostData] = useState([])
const [accessToken, setAccessToken] = useState('');
const [isLoading, setLoading] = useState(true);
const [modalLoad, setModalLoad] = useState(false);

const [upCount, setUpCount] = useState(false);
const [downCount, setDownCount] = useState(false);

const [avatarimg, setAvatarImg] = useState(null);
const [userName, setUserName] = useState('');

const [loginUserId, setLoginUserId] = useState(null);
const [userID, setUserID] = useState('');
const [userProfileName, setUserProfileName] =useState('');

const [randProfile, setRandProfile] = useState(null);

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const onRefresh = useCallback(() => {
  setRefreshing(true);

  wait(500).then(() => setRefreshing(false));
}, [refreshing]);

const getData = async () => {
  let value = await AsyncStorage.getItem('access_token');
  let name = await AsyncStorage.getItem('user_name')
  let avatar = await AsyncStorage.getItem('user_avatar');
  let logUserId = await AsyncStorage.getItem('loginUser_id');
  let userName = await AsyncStorage.getItem('userName')
  let userId = await AsyncStorage.getItem('userId');

  if(value !== null) {
      setAccessToken(value);
  }
  if(name != null ){
      setUserProfileName(name);
  }

  if(avatar != null){
    setAvatarImg(avatar);

  }

  if(logUserId != null ){
    setLoginUserId(logUserId);

  }
  if(userName != null ){
    setUserName(userName);

  }

  if(userId != null){
    setUserID(userId);

  }
}


useEffect(()=>{
    getData();
    
    if( loginUserId == userID){
      fetch(ApiConfig.USER_PROFILE_HOME_URL,{
          method: 'GET',
          headers :{
              Accept: 'application/json',
              // 'Content-Type' : 'application/json',
              Authorization:`Bearer ${accessToken}`,
          },
      })
      .then(res => res.json())
      .then(data => {
        if(data.home){
          setPostData(data.home);
          setLoading(false)
        }
    }
      ).catch((err)=> {
        setLoading(false);
        //
      })
    }
    else {
      fetch(`https://lolwhoa.com/api/random-user-profile/${userName}/${userID}`,{
        method: 'GET',
        headers :{
          Accept: 'application/json',
        }
      }).
      then(res=>res.json()).
      then(data=>{
        if(data.UserProfile){
          setPostData(data.UserProfile);
          if(data.UserProfile[0].UserAvatar){
          setRandProfile(data.UserProfile[0].UserAvatar);
          }else{
          setRandProfile(data.UserProfile[0].user.avatar);
          }
          setLoading(false)
        } 
      }).
      catch(err=>{
        setLoading(false);
      })
    }
},[userName, userID, upCount, downCount, loginUserId, isLoading]);


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

const upVoteHandler = (val, DBcount, DBdownCount) => {
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
      setUpCount(!upCount)}).
    catch(err=> {
      //
    });
}

const downVoteHandler = (val, DBcount, DBupCount) => {
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
        setDownCount(!downCount);
        }).
    catch(err=> {
      //
    });
}

    const setData = async (val, uuid) => {
      
        if(uuid != null && val != null){
        await AsyncStorage.setItem('slug', val);
        await AsyncStorage.setItem('uuid', uuid);
        }
    }

    const handleBackButton = () => {

        if (props.navigation.isFocused()) {
         props.navigation.navigate('HomeScreen');
      }
      return true;
        }
      
      useEffect(() => {
          BackHandler.addEventListener('hardwareBackPress', handleBackButton);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
          };
        },[]);

const onCancelHandler = (val, uuid) => {
  let slug = val.toString();
  setModalLoad(!modalLoad);
  setData(slug, uuid);
}

const onSinglePostHandler = (val, id)=>{
  let slug = val.toString();
  setData(slug, id);

  if(slug && id){
      props.navigation.navigate('SinglePost');
  }
}

const renderData = itemData => {

return(
    <PostBox
    source={ itemData.item.UserAvatar != null ? {uri: ApiConfig.PROFILE_URL+itemData.item.UserAvatar} :
      require('../../assets/img/default_male.png')}
    name={itemData.item.user.name}
    title={itemData.item.title}
    titleOnPress={()=>{}}
    created_at={itemData.item.date_age}
    view_count={itemData.item.view_count}
    tags={itemData.item.tags}
    sourceThumb={{uri: ApiConfig.IMAGE_URL+itemData.item.thumbnail}}
    share_count={itemData.item.share_count}
    upvotesCount={ itemData.item.upvotes}
    downvotesCount={ itemData.item.downvotes}
    totalComments= {itemData.item.totalComments}
    upvote={()=>upVoteHandler(itemData.item.id)}
    downvote={()=>downVoteHandler(itemData.item.id)}
    share={()=>onShareHandler(itemData.item.slug, itemData.item.uuid)}
    postImgOnPress={()=>onSinglePostHandler(itemData.item.slug, itemData.item.uuid)}
    onPostComment={()=>onCancelHandler(itemData.item.slug, itemData.item.uuid)}

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



      <TouchableOpacity onPress={()=>{ loginUserId === userID ? 
       props.navigation.navigate('EditProfile'): ''}}
       >

        <View style={styles.userTitleInfo} >
                  <View style={styles.imgUser}>
                    { loginUserId == userID ? 
                      <Image style={styles.image} 
                        source={{uri:ApiConfig.PROFILE_URL+avatarimg} }
                      /> : randProfile != null ?
                      <Image style={styles.image} 
                        source={{uri:ApiConfig.PROFILE_URL+randProfile}}
                      /> :
                      <ImageCache style={styles.image} source={require('../../assets/img/default_male.png')}/>
                    }
                  </View>
    
                <View style={{paddingHorizontal: 5}}>
    
                     <Text 
                     style={
                         {color: 'white', 
                         width: '84%', 
                         fontWeight: 'bold', 
                         fontSize: 18,
                         borderBottomColor: 'white',
                         borderBottomWidth: 1,
                         marginBottom: 5,
                         }} >
                         {loginUserId === userID ? userProfileName : userName}
                     </Text>
                <View style={{minWidth: '84%'}}>
                    <Text numberOfLines={3} style={{color: 'white'}}>
                        { postData.length > 0 ? postData[0].user.bio : 
                          <Text style={{color: Color.placeholderColor}}>You have no bio...</Text> }
                        
                    </Text>
                </View>
                
            </View>
      </View>
      </TouchableOpacity>

      {
        postData.length > 0 ?
            <FlatList
            data={postData}
            renderItem={renderData}
            keyExtractor={(key,index)=> key = index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          /> : 
          <View style={styles.noPostCont}>
                  <Icon name='frown' size={75} color={Color.placeholderColor} />
                  <Text style={ styles.noPostText}>You have no post</Text>
          </View> 
      }
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
},
userTitleInfo :{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.accent,
    marginBottom: 5,
},
image :{
    width: 100, 
    height: 100,
    borderRadius: 50
},
imgUser :{
    borderRadius: 50,
    overflow: 'hidden',
    margin: 5
},
noPostCont :{
    alignItems: 'center',
    paddingTop: 30,

},
noPostText :{
    color: Color.placeholderColor, 
    paddingTop: 10,
    fontSize: 16
  },

});

export default UserProfileScreen;